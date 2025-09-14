export enum DayOfWeek {
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
  SUNDAY = 'sunday'
}

export class OpeningHourEntity {
  constructor(
    public readonly id: string,
    public readonly shopId: string,
    public readonly dayOfWeek: DayOfWeek,
    public readonly isOpen: boolean,
    public readonly openTime: string | null,
    public readonly closeTime: string | null,
    public readonly breakStart: string | null,
    public readonly breakEnd: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  get totalWorkingHours(): number {
    if (!this.isOpen || !this.openTime || !this.closeTime) {
      return 0;
    }

    const openMinutes = this.timeToMinutes(this.openTime);
    const closeMinutes = this.timeToMinutes(this.closeTime);
    let totalMinutes = closeMinutes - openMinutes;

    // Subtract break time if exists
    if (this.breakStart && this.breakEnd) {
      const breakStartMinutes = this.timeToMinutes(this.breakStart);
      const breakEndMinutes = this.timeToMinutes(this.breakEnd);
      totalMinutes -= (breakEndMinutes - breakStartMinutes);
    }

    return Math.max(0, totalMinutes / 60); // Convert to hours
  }

  get hasBreakTime(): boolean {
    return !!(this.breakStart && this.breakEnd);
  }

  get formattedWorkingHours(): string {
    const hours = this.totalWorkingHours;
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);

    if (minutes === 0) {
      return `${wholeHours} ชั่วโมง`;
    }
    return `${wholeHours} ชั่วโมง ${minutes} นาที`;
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  static create(
    shopId: string,
    dayOfWeek: DayOfWeek,
    isOpen: boolean,
    openTime?: string,
    closeTime?: string,
    breakStart?: string,
    breakEnd?: string
  ): OpeningHourEntity {
    const now = new Date();
    return new OpeningHourEntity(
      crypto.randomUUID(),
      shopId,
      dayOfWeek,
      isOpen,
      openTime || null,
      closeTime || null,
      breakStart || null,
      breakEnd || null,
      now,
      now
    );
  }

  update(
    isOpen?: boolean,
    openTime?: string,
    closeTime?: string,
    breakStart?: string,
    breakEnd?: string
  ): OpeningHourEntity {
    return new OpeningHourEntity(
      this.id,
      this.shopId,
      this.dayOfWeek,
      isOpen ?? this.isOpen,
      openTime ?? this.openTime,
      closeTime ?? this.closeTime,
      breakStart ?? this.breakStart,
      breakEnd ?? this.breakEnd,
      this.createdAt,
      new Date()
    );
  }
}
