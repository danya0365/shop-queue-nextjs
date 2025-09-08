import { ShopDTO } from '@/src/application/dtos/shop/backend/shops-dto';
import { ShopService } from '@/src/application/services/shop/ShopService';
import { getClientService } from '@/src/di/client-container';
import { Logger } from '@/src/domain/interfaces/logger';
import { useEffect, useState } from 'react';

// Define form/action data interfaces
export interface QueueJoinData {
  customerName: string;
  customerPhone: string;
  services: string[];
  specialRequests?: string;
  priority: 'normal' | 'urgent';
}

// Define state interface
export interface QueueJoinPresenterState {
  shopInfo: ShopDTO | null;
  isLoading: boolean;
  error: string | null;
  selectedServices: string[];
  totalPrice: number;
  estimatedTime: number;
  queueNumber: string | null;
  isSuccess: boolean;
}

// Define actions interface
export interface QueueJoinPresenterActions {
  joinQueue: (data: QueueJoinData) => Promise<boolean>;
  addService: (serviceId: string) => void;
  removeService: (serviceId: string) => void;
  reset: () => void;
  setError: (error: string | null) => void;
}

// Hook type
export type QueueJoinPresenterHook = [
  QueueJoinPresenterState,
  QueueJoinPresenterActions
];

// Custom hook implementation
export const useQueueJoinPresenter = ({ shopId }: { shopId: string }): QueueJoinPresenterHook => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [queueNumber, setQueueNumber] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const logger = getClientService<Logger>('Logger');
  const [shopInfo, setShopInfo] = useState<ShopDTO | null>(null);
  const shopService = getClientService<ShopService>('ShopService');

  useEffect(() => {
    const fetchShopInfo = async () => {
      try {
        const shopInfo = await shopService.getShopById(shopId);
        setShopInfo(shopInfo);
      } catch (error) {
        logger.error('QueueJoinPresenter: Error fetching shop info', error);
        setError('เกิดข้อผิดพลาดในการดึงข้อมูลร้านค้า');
      }
    };
    fetchShopInfo();
  }, [shopId]);

  const joinQueue = async (data: QueueJoinData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Validation logic
      if (!data.customerName.trim()) {
        throw new Error('กรุณากรอกชื่อ');
      }

      if (!data.customerPhone.trim()) {
        throw new Error('กรุณากรอกเบอร์โทรศัพท์');
      }

      if (data.services.length === 0) {
        throw new Error('กรุณาเลือกบริการอย่างน้อย 1 รายการ');
      }

      // Phone validation
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(data.customerPhone.replace(/[-\s]/g, ''))) {
        throw new Error('รูปแบบเบอร์โทรไม่ถูกต้อง');
      }

      // Mock API call - replace with actual service
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock success response
      const mockQueueNumber = 'A' + String(Math.floor(Math.random() * 900) + 100);
      setQueueNumber(mockQueueNumber);
      setIsSuccess(true);

      logger.info('QueueJoinPresenter: Queue joined successfully', {
        queueNumber: mockQueueNumber,
        services: data.services
      });

      return true;
    } catch (error) {
      logger.error('QueueJoinPresenter: Error joining queue', error);
      const errorMessage = error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการเข้าคิว';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const addService = (serviceId: string) => {
    if (!selectedServices.includes(serviceId)) {
      const newServices = [...selectedServices, serviceId];
      setSelectedServices(newServices);

      // Mock price calculation - replace with actual service
      const mockPrice = Math.floor(Math.random() * 100) + 50;
      const mockTime = Math.floor(Math.random() * 10) + 5;
      setTotalPrice(prev => prev + mockPrice);
      setEstimatedTime(prev => prev + mockTime);

      logger.info('QueueJoinPresenter: Service added', { serviceId });
    }
  };

  const removeService = (serviceId: string) => {
    const newServices = selectedServices.filter(id => id !== serviceId);
    setSelectedServices(newServices);

    // Mock price calculation - replace with actual service
    const mockPrice = Math.floor(Math.random() * 100) + 50;
    const mockTime = Math.floor(Math.random() * 10) + 5;
    setTotalPrice(prev => Math.max(0, prev - mockPrice));
    setEstimatedTime(prev => Math.max(0, prev - mockTime));

    logger.info('QueueJoinPresenter: Service removed', { serviceId });
  };

  const reset = () => {
    setIsLoading(false);
    setError(null);
    setSelectedServices([]);
    setTotalPrice(0);
    setEstimatedTime(0);
    setQueueNumber(null);
    setIsSuccess(false);
    logger.info('QueueJoinPresenter: Reset');
  };

  return [
    {
      shopInfo,
      isLoading,
      error,
      selectedServices,
      totalPrice,
      estimatedTime,
      queueNumber,
      isSuccess
    },
    { joinQueue, addService, removeService, reset, setError },
  ];
};
