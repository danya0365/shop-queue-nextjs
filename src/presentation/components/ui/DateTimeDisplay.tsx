"use client";

import { useEffect, useState } from "react";
import { useFormatDateTime } from "@/src/presentation/hooks/useDateTime";
import { DateTimeFormatType, Locale } from "@/src/domain/entities/datetime/DateTimeEntities";

interface DateTimeDisplayProps {
  date?: Date | string; // Optional custom date to display instead of current time
  formatType?: DateTimeFormatType;
  locale?: Locale;
  includeSeconds?: boolean;
  includeTimezone?: boolean;
  className?: string;
  updateInterval?: number; // in milliseconds, default 1000 (1 second)
}

export const DateTimeDisplay = ({
  date,
  formatType = DateTimeFormatType.DATETIME,
  locale = Locale.THAI,
  includeSeconds = true,
  includeTimezone = false,
  className = "",
  updateInterval = 1000,
}: DateTimeDisplayProps) => {
  const { formatDateTime, isLoading, error } = useFormatDateTime();
  const [currentTime, setCurrentTime] = useState(date ? new Date(date) : new Date());
  const [formattedTime, setFormattedTime] = useState<string>("");

  // Update current time every interval (only when no custom date is provided)
  useEffect(() => {
    if (date) return; // Don't update if custom date is provided
    
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, updateInterval);

    return () => clearInterval(timer);
  }, [updateInterval, date]);

  // Format the time whenever currentTime changes
  useEffect(() => {
    const formatTime = async () => {
      try {
        const formatted = await formatDateTime(currentTime, {
          formatType,
          locale,
          includeSeconds,
          includeTimezone,
        });
        setFormattedTime(formatted);
      } catch (err) {
        console.error("Failed to format datetime:", err);
        setFormattedTime(currentTime.toLocaleString());
      }
    };

    formatTime();
  }, [currentTime, formatDateTime, formatType, locale, includeSeconds, includeTimezone]);

  if (isLoading) {
    return (
      <span className={`text-gray-500 ${className}`}>
        กำลังโหลด...
      </span>
    );
  }

  if (error) {
    return (
      <span className={`text-red-500 ${className}`}>
        ข้อผิดพลาด: {error}
      </span>
    );
  }

  return (
    <span className={className}>
      {formattedTime}
    </span>
  );
};

// Default export for convenience
export default DateTimeDisplay;
