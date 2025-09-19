"use client";

import type { DepartmentDTO } from "@/src/application/dtos/shop/backend/department-dto";
import { ClientDepartmentSelectionPresenterFactory } from "@/src/presentation/presenters/shop/backend/DepartmentSelectionPresenter";
import { useCallback, useEffect, useState } from "react";

const presenter = await ClientDepartmentSelectionPresenterFactory.create();

export interface Department {
  id: string;
  name: string;
  description?: string;
  employeeCount: number;
  isActive: boolean;
  shopId: string;
}

interface UseDepartmentsReturn {
  departments: Department[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  searchDepartments: (searchQuery: string) => Promise<void>;
  createDepartment: (departmentData: {
    name: string;
    slug: string;
    description?: string;
    shopId: string;
  }) => Promise<Department>;
}

export function useDepartments(shopId?: string): UseDepartmentsReturn {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDepartments = useCallback(
    async (searchQuery?: string) => {
      if (!shopId) return;

      setLoading(true);
      setError(null);

      try {
        const result = await presenter.getViewModel(shopId, 1, 100, {
          searchQuery,
          shopFilter: shopId,
        });

        // Transform DTO to our interface
        const transformedDepartments: Department[] = result.departments.map(
          (department: DepartmentDTO) => ({
            id: department.id,
            name: department.name,
            description: department.description || undefined,
            employeeCount: department.employeeCount,
            isActive: department.isActive,
            shopId: department.shopId,
          })
        );

        setDepartments(transformedDepartments);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch departments"
        );
        console.error("Error fetching departments:", err);
      } finally {
        setLoading(false);
      }
    },
    [shopId]
  );

  const searchDepartments = useCallback(
    async (searchQuery: string) => {
      await fetchDepartments(searchQuery);
    },
    [fetchDepartments]
  );

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments, shopId]);

  const createDepartment = useCallback(
    async (departmentData: {
      name: string;
      slug: string;
      description?: string;
      shopId: string;
    }): Promise<Department> => {
      if (!shopId) {
        throw new Error("Shop ID is required");
      }

      setLoading(true);
      setError(null);

      try {
        const newDepartment = await presenter.createDepartment({
          shopId: departmentData.shopId,
          name: departmentData.name,
          slug: departmentData.slug,
          description: departmentData.description,
        });

        // Transform DTO to our interface
        const transformedDepartment: Department = {
          id: newDepartment.id,
          name: newDepartment.name,
          description: newDepartment.description || undefined,
          employeeCount: newDepartment.employeeCount,
          isActive: newDepartment.isActive,
          shopId: newDepartment.shopId,
        };

        // Add to departments list
        setDepartments((prev) => [transformedDepartment, ...prev]);

        return transformedDepartment;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to create department"
        );
        console.error("Error creating department:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [shopId]
  );

  return {
    departments,
    loading,
    error,
    refetch: fetchDepartments,
    searchDepartments,
    createDepartment,
  };
}
