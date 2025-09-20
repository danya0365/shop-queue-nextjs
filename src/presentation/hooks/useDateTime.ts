"use client";

import { getClientService } from "@/src/di/client-container";
import { useCallback, useEffect, useState } from "react";
import {
  DateTimeConfigOutputDTO,
  FormatDateTimeInputDTO,
  FormatRelativeDateTimeInputDTO,
  UpdateDateTimeConfigInputDTO,
} from "../../application/dtos/datetime/DateTimeDTOs";
import { IDateTimeFormattingService } from "../../application/services/DateTimeFormattingService";
import {
  DateTimeFormatType,
  Locale,
} from "../../domain/entities/datetime/DateTimeEntities";
// Initialize DateTimeFormattingService
const dateTimeService = getClientService<IDateTimeFormattingService>(
  "DateTimeFormattingService"
);

interface UseFormatDateTimeOptions {
  formatType?: DateTimeFormatType;
  locale?: Locale;
  includeSeconds?: boolean;
  includeTimezone?: boolean;
}

export const useFormatDateTime = (
  service: IDateTimeFormattingService | undefined = dateTimeService
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatDateTime = useCallback(
    async (
      date: Date | string,
      options?: UseFormatDateTimeOptions
    ): Promise<string> => {
      setIsLoading(true);
      setError(null);

      try {
        const input = new FormatDateTimeInputDTO(date, options);
        const result = await service.formatDateTime(input.date, options);
        return result.formattedString;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to format date time";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [service]
  );

  const formatRelativeDateTime = useCallback(
    async (date: Date | string, referenceDate?: Date): Promise<string> => {
      setIsLoading(true);
      setError(null);

      try {
        const input = new FormatRelativeDateTimeInputDTO(date, referenceDate);
        const result = await service.formatRelativeDateTime(
          input.date,
          referenceDate
        );
        return result.formattedString;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to format relative date time";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [service]
  );

  return {
    formatDateTime,
    formatRelativeDateTime,
    isLoading,
    error,
  };
};

export const useDateTimeConfig = (service: IDateTimeFormattingService) => {
  const [config, setConfig] = useState<DateTimeConfigOutputDTO | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getConfig = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await service.getDateTimeConfig();
      setConfig(result);
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to get config";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [service]);

  const updateConfig = useCallback(
    async (configData: UpdateDateTimeConfigInputDTO) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await service.updateDateTimeConfig(configData);
        setConfig(result);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update config";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [service]
  );

  useEffect(() => {
    getConfig();
  }, [getConfig]);

  return {
    config,
    getConfig,
    updateConfig,
    isLoading,
    error,
  };
};
