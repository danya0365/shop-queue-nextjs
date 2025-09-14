import { ServiceDTO } from "@/src/application/dtos/backend/services-dto";
import { OpeningHourDTO } from "@/src/application/dtos/shop/backend/opening-hour-dto";
import { ShopDTO } from "@/src/application/dtos/shop/backend/shops-dto";
import { IShopService } from "@/src/application/services/shop/ShopService";
import type { Logger } from "@/src/domain/interfaces/logger";
import type { Metadata } from "next";

export interface ShopInfo {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  qrCodeUrl: string;
  logo?: string;
  openingHours: string;
  services: string[];
  isOpen: boolean;
  rating: number;
  totalReviews: number;
  status: ShopDTO["status"];
}

/**
 * Base presenter for Shop pages.
 * Provides common helpers for fetching shop info and generating metadata with shop name.
 */
export abstract class BaseShopPresenter {
  constructor(
    protected readonly logger: Logger,
    protected readonly shopService: IShopService
  ) {}

  public async getShopInfo(shopId: string): Promise<ShopInfo> {
    const shop = await this.shopService.getShopById(shopId);
    return {
      id: shop.id,
      name: shop.name,
      description: shop.description || "",
      address: shop.address || "",
      phone: shop.phone || "",
      qrCodeUrl: `https://shopqueue.app/shop/${shopId}`,
      logo: "/images/shop-logo.png",
      openingHours: this.createOpeningHoursString(shop.openingHours),
      services: this.createServicesString(shop.services),
      isOpen: true,
      rating: 4.8,
      totalReviews: 256,
      status: shop.status,
    };
  }

  // create opening hours string from OpeningHour[]
  protected createOpeningHoursString(openingHours: OpeningHourDTO[]): string {
    if (!openingHours || openingHours.length === 0) {
      return "ทุกวันตลอด 24 ชั่วโมง";
    }

    // create map of dayOfWeek to day and day order
    const dayMap = new Map([
      ["monday", { name: "จันทร์", order: 1 }],
      ["tuesday", { name: "อังคาร", order: 2 }],
      ["wednesday", { name: "พุธ", order: 3 }],
      ["thursday", { name: "พฤหัส", order: 4 }],
      ["friday", { name: "ศุกร์", order: 5 }],
      ["saturday", { name: "เสาร์", order: 6 }],
      ["sunday", { name: "อาทิตย์", order: 7 }],
    ]);

    // Group days by opening hours
    const hourGroups = new Map<string, string[]>();

    // Sort opening hours by day order
    const sortedHours = [...openingHours].sort((a, b) => {
      const orderA = dayMap.get(a.dayOfWeek)?.order || 0;
      const orderB = dayMap.get(b.dayOfWeek)?.order || 0;
      return orderA - orderB;
    });

    // Group days with the same opening hours
    sortedHours.forEach((hour) => {
      if (!hour.isOpen) {
        // Handle closed days separately
        const key = "closed";
        const days = hourGroups.get(key) || [];
        days.push(dayMap.get(hour.dayOfWeek)?.name || hour.dayOfWeek);
        hourGroups.set(key, days);
      } else {
        const key = `${hour.openTime}-${hour.closeTime}`;
        const days = hourGroups.get(key) || [];
        days.push(dayMap.get(hour.dayOfWeek)?.name || hour.dayOfWeek);
        hourGroups.set(key, days);
      }
    });

    // Create summary strings
    const summaries: string[] = [];

    // Process open days
    hourGroups.forEach((days, key) => {
      if (key === "closed") return; // Skip closed days for now

      const [openTime, closeTime] = key.split("-");
      const dayRanges = this.createDayRanges(days);

      dayRanges.forEach((range) => {
        summaries.push(
          `${range}: ${this.formatTimeString(
            openTime
          )} - ${this.formatTimeString(closeTime)}`
        );
      });
    });

    // Process closed days
    const closedDays = hourGroups.get("closed");
    if (closedDays && closedDays.length > 0) {
      const dayRanges = this.createDayRanges(closedDays);
      dayRanges.forEach((range) => {
        summaries.push(`${range}: ปิดทำการ`);
      });
    }

    return summaries.join(", ");
  }

  // Helper method to format time string from 00:00:00 to 00:00
  private formatTimeString(time: string): string {
    if (!time) return time;
    // Remove seconds part if present (format: HH:MM:SS -> HH:MM)
    return time.includes(":") ? time.substring(0, 5) : time;
  }

  // Helper method to create day ranges (e.g., "จันทร์ - ศุกร์" or "เสาร์, อาทิตย์")
  private createDayRanges(days: string[]): string[] {
    if (days.length === 0) return [];
    if (days.length === 1) return [days[0]];

    const dayOrder = [
      "จันทร์",
      "อังคาร",
      "พุธ",
      "พฤหัส",
      "ศุกร์",
      "เสาร์",
      "อาทิตย์",
    ];

    // Sort days according to the day order
    days.sort((a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b));

    const ranges: string[] = [];
    let rangeStart = 0;

    for (let i = 1; i <= days.length; i++) {
      // Check if the current day is consecutive with the previous one
      const isConsecutive =
        i < days.length &&
        dayOrder.indexOf(days[i]) === dayOrder.indexOf(days[i - 1]) + 1;

      // If not consecutive or at the end of the array, create a range
      if (!isConsecutive || i === days.length) {
        if (rangeStart === i - 1) {
          // Single day
          ranges.push(days[rangeStart]);
        } else {
          // Range of days
          ranges.push(`${days[rangeStart]} - ${days[i - 1]}`);
        }
        rangeStart = i;
      }
    }

    return ranges;
  }

  // create services string from ServiceDTO[]
  protected createServicesString(services: Partial<ServiceDTO>[]): string[] {
    return services.map((service) => service.name || "");
  }

  protected async generateShopMetadata(
    shopId: string,
    pageTitlePrefix: string,
    description: string
  ): Promise<Metadata> {
    const shopInfo = await this.getShopInfo(shopId);
    return {
      title: `${pageTitlePrefix} - ${shopInfo.name} | Shop Queue`,
      description,
    };
  }
}
