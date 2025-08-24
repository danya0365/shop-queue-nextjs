import { ShopDto } from "../dtos/shop-dto";
import { IShopService } from "../interfaces/shop-service.interface";

// create mock shop service
export class ShopService implements IShopService {
  // CREATE mock shop data
  getShopsByOwnerId(ownerId: string): Promise<ShopDto[]> {
    const mockShops: ShopDto[] = [
      {
        id: "1",
        name: "Shop 1",
        description: "Description 1",
        ownerId: "1",
        address: "Address 1",
        qrCodeUrl: "https://example.com/qr-code-1",
        createdAt: "2025-08-25T02:30:37.000Z",
        updatedAt: "2025-08-25T02:30:37.000Z",
      },
      {
        id: "2",
        name: "Shop 2",
        description: "Description 2",
        ownerId: "2",
        address: "Address 2",
        qrCodeUrl: "https://example.com/qr-code-2",
        createdAt: "2025-08-25T02:30:37.000Z",
        updatedAt: "2025-08-25T02:30:37.000Z",
      },
      {
        id: "3",
        name: "Shop 3",
        description: "Description 3",
        ownerId: "3",
        address: "Address 3",
        qrCodeUrl: "https://example.com/qr-code-3",
        createdAt: "2025-08-25T02:30:37.000Z",
        updatedAt: "2025-08-25T02:30:37.000Z",
      },
    ]
    return Promise.resolve(mockShops);
  }
}
