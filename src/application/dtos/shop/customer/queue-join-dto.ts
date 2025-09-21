// Queue Join DTOs following Clean Architecture principles

export interface ServiceOptionDTO {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedTime: number;
  category: string;
  available: boolean;
  icon: string;
}

export interface QueueServiceDTO {
  id: string;
  name: string;
  price: number;
  quantity: number;
  estimatedTime: number;
}

export interface QueueFormDataDTO {
  customerName: string;
  customerPhone: string;
  services: QueueServiceDTO[];
  specialRequests?: string;
  priority: "normal" | "urgent";
}

export interface ShopQueueInfoDTO {
  estimatedWaitTime: number;
  currentQueueLength: number;
  shopName: string;
  isAcceptingQueues: boolean;
  maxQueueLength: number;
}

export interface QueueJoinDataDTO {
  services: ServiceOptionDTO[];
  categories: string[];
  shopQueueInfo: ShopQueueInfoDTO;
}

export interface JoinQueueResultDTO {
  success: boolean;
  queueNumber?: string;
  estimatedWaitTime?: number;
  message?: string;
  error?: string;
}

// Input DTOs for use cases
export interface GetAvailableServicesInputDTO {
  shopId: string;
}

export interface GetShopQueueInfoInputDTO {
  shopId: string;
}

export interface JoinQueueInputDTO {
  shopId: string;
  customerName: string;
  customerPhone: string;
  services: QueueServiceDTO[];
  specialRequests?: string;
  priority: "normal" | "urgent";
}
