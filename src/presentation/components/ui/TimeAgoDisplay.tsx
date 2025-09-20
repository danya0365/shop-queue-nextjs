"use client";

import { useEffect, useState } from "react";
import { useFormatDateTime } from "@/src/presentation/hooks/useDateTime";
import { DateTimeFormatType, Locale } from "@/src/domain/entities/datetime/DateTimeEntities";

interface TimeAgoDisplayProps {
  date: Date | string; // The date to display time ago for
  locale?: Locale;
  className?: string;
  updateInterval?: number; // in milliseconds, default 60000 (1 minute)
  showAbsoluteTime?: boolean; // Whether to show absolute time alongside relative time
  absoluteTimeFormat?: DateTimeFormatType; // Format for absolute time display
  includeSecondsInAbsolute?: boolean; // Whether to include seconds in absolute time
}

export const TimeAgoDisplay = ({
  date,
  locale = Locale.THAI,
  className = "",
  updateInterval = 60000, // Update every minute by default
  showAbsoluteTime = false,
  absoluteTimeFormat = DateTimeFormatType.DATETIME,
  includeSecondsInAbsolute = false,
}: TimeAgoDisplayProps) => {
  const { formatDateTime, isLoading, error } = useFormatDateTime();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [relativeTime, setRelativeTime] = useState<string>("");
  const [absoluteTime, setAbsoluteTime] = useState<string>("");

  // Update current time every interval
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, updateInterval);

    return () => clearInterval(timer);
  }, [updateInterval]);

  // Format the time whenever currentTime changes
  useEffect(() => {
    const formatTime = async () => {
      try {
        // Format relative time
        const relativeFormatted = await formatDateTime(date, {
          formatType: DateTimeFormatType.RELATIVE,
          locale,
        });
        setRelativeTime(relativeFormatted);

        // Format absolute time if requested
        if (showAbsoluteTime) {
          const absoluteFormatted = await formatDateTime(date, {
            formatType: absoluteTimeFormat,
            locale,
            includeSeconds: includeSecondsInAbsolute,
          });
          setAbsoluteTime(absoluteFormatted);
        }
      } catch (err) {
        console.error("Failed to format time ago:", err);
        // Fallback to simple relative time calculation
        const targetDate = new Date(date);
        const diff = currentTime.getTime() - targetDate.getTime();
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));

        let fallbackText = "";
        if (months > 0) {
          fallbackText = `${months} เดือนผ่านไป`;
        } else if (days > 0) {
          fallbackText = `${days} วันผ่านไป`;
        } else if (hours > 0) {
          fallbackText = `${hours} ชม ผ่านไป`;
        } else if (minutes > 0) {
          fallbackText = `${minutes} นาทีผ่านไป`;
        } else {
          fallbackText = "เมื่อสักครู่";
        }
        
        setRelativeTime(fallbackText);
      }
    };

    formatTime();
  }, [currentTime, date, formatDateTime, locale, showAbsoluteTime, absoluteTimeFormat, includeSecondsInAbsolute]);

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
      {relativeTime}
      {showAbsoluteTime && absoluteTime && (
        <span className="text-gray-500 dark:text-gray-400 text-sm ml-1">
          ({absoluteTime})
        </span>
      )}
    </span>
  );
};

// Default export for convenience
export default TimeAgoDisplay;
