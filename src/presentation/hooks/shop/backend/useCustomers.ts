"use client";

import type { CustomerDTO } from "@/src/application/dtos/shop/backend/customers-dto";
import { ClientCustomerSelectionPresenterFactory } from "@/src/presentation/presenters/shop/backend/CustomerSelectionPresenter";
import { useCallback, useEffect, useState } from "react";

export interface Customer {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  membershipTier: "regular" | "bronze" | "silver" | "gold" | "platinum";
  totalQueues: number;
  totalPoints: number;
  isActive: boolean;
  lastVisit?: string;
}

interface UseCustomersReturn {
  customers: Customer[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  searchCustomers: (searchQuery: string) => Promise<void>;
  createCustomer: (customerData: {
    name: string;
    phone?: string;
    email?: string;
    dateOfBirth?: string;
    gender?: "male" | "female" | "other";
    address?: string;
    notes?: string;
  }) => Promise<Customer>;
}

export function useCustomers(shopId?: string): UseCustomersReturn {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = useCallback(
    async (searchQuery?: string) => {
      if (!shopId) return;

      setLoading(true);
      setError(null);

      try {
        const presenter =
          await ClientCustomerSelectionPresenterFactory.create();
        const result = await presenter.getViewModel(shopId, 1, 100, {
          searchQuery,
          isActiveFilter: true, // Only fetch active customers by default
        });

        // Transform DTO to our interface
        const transformedCustomers = result.customers.map(
          (customer: CustomerDTO) => ({
            id: customer.id,
            name: customer.name,
            phone: customer.phone,
            email: customer.email,
            membershipTier: customer.membershipTier,
            totalQueues: customer.totalQueues,
            totalPoints: customer.totalPoints,
            isActive: customer.isActive,
            lastVisit: customer.lastVisit,
          })
        );

        setCustomers(transformedCustomers);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch customers"
        );
        console.error("Error fetching customers:", err);
      } finally {
        setLoading(false);
      }
    },
    [shopId]
  );

  const searchCustomers = useCallback(
    async (searchQuery: string) => {
      await fetchCustomers(searchQuery);
    },
    [fetchCustomers]
  );

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers, shopId]);

  const createCustomer = useCallback(
    async (customerData: {
      name: string;
      phone?: string;
      email?: string;
      dateOfBirth?: string;
      gender?: "male" | "female" | "other";
      address?: string;
      notes?: string;
    }): Promise<Customer> => {
      if (!shopId) {
        throw new Error("Shop ID is required");
      }

      setLoading(true);
      setError(null);

      try {
        const presenter =
          await ClientCustomerSelectionPresenterFactory.create();
        const newCustomer = await presenter.createCustomer({
          shopId,
          name: customerData.name,
          phone: customerData.phone,
          email: customerData.email,
          dateOfBirth: customerData.dateOfBirth,
          gender: customerData.gender,
          address: customerData.address,
          notes: customerData.notes,
        });

        // Transform DTO to our interface
        const transformedCustomer: Customer = {
          id: newCustomer.id,
          name: newCustomer.name,
          phone: newCustomer.phone,
          email: newCustomer.email,
          membershipTier: newCustomer.membershipTier,
          totalQueues: newCustomer.totalQueues,
          totalPoints: newCustomer.totalPoints,
          isActive: newCustomer.isActive,
          lastVisit: newCustomer.lastVisit,
        };

        // Add to customers list
        setCustomers((prev) => [transformedCustomer, ...prev]);

        return transformedCustomer;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to create customer"
        );
        console.error("Error creating customer:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [shopId]
  );

  return {
    customers,
    loading,
    error,
    refetch: fetchCustomers,
    searchCustomers,
    createCustomer,
  };
}
