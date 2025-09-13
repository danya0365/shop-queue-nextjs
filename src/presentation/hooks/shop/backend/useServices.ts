'use client';

import { useState, useEffect, useCallback } from 'react';
import { ClientServicesPresenterFactory } from '@/src/presentation/presenters/shop/backend/ServicesPresenter';
import type { ServiceDTO } from '@/src/application/dtos/shop/backend/services-dto';

interface Service {
  id: string;
  name: string;
  category: string;
  price: number;
  estimatedDuration: number | null;
  icon: string | null;
  isAvailable: boolean;
}

export function useServices(shopId?: string) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = useCallback(async () => {
    if (!shopId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const presenter = await ClientServicesPresenterFactory.create();
      const result = await presenter.getViewModel(shopId, 1, 100);
      
      // Transform DTO to our interface
      const transformedServices = result.services.data.map((service: ServiceDTO) => ({
        id: service.id,
        name: service.name,
        category: service.category || '',
        price: service.price,
        estimatedDuration: service.estimatedDuration || null,
        icon: service.icon || null,
        isAvailable: service.isAvailable || false
      }));
      
      setServices(transformedServices);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch services');
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  }, [shopId]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices, shopId]);

  return {
    services,
    loading,
    error,
    refetch: fetchServices
  };
}
