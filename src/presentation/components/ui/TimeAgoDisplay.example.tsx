"use client";

import { TimeAgoDisplay } from "./TimeAgoDisplay";
import { DateTimeFormatType, Locale } from "@/src/domain/entities/datetime/DateTimeEntities";

// Example usage of TimeAgoDisplay component

export function TimeAgoDisplayExamples() {
  // Current time for examples
  const now = new Date();
  
  // Create some past dates for demonstration
  const oneMinuteAgo = new Date(now.getTime() - 1 * 60 * 1000);
  const oneHourAgo = new Date(now.getTime() - 1 * 60 * 60 * 1000);
  const oneDayAgo = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold mb-4">TimeAgoDisplay Component Examples</h2>
      
      {/* Basic Usage */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Basic Usage</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">1 minute ago:</p>
            <TimeAgoDisplay date={oneMinuteAgo} />
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">1 hour ago:</p>
            <TimeAgoDisplay date={oneHourAgo} />
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">1 day ago:</p>
            <TimeAgoDisplay date={oneDayAgo} />
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">1 month ago:</p>
            <TimeAgoDisplay date={oneMonthAgo} />
          </div>
        </div>
      </div>

      {/* With Absolute Time */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">With Absolute Time</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">1 hour ago with datetime:</p>
            <TimeAgoDisplay 
              date={oneHourAgo} 
              showAbsoluteTime={true}
              absoluteTimeFormat={DateTimeFormatType.DATETIME}
            />
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">1 day ago with time only:</p>
            <TimeAgoDisplay 
              date={oneDayAgo} 
              showAbsoluteTime={true}
              absoluteTimeFormat={DateTimeFormatType.TIME}
              includeSecondsInAbsolute={false}
            />
          </div>
        </div>
      </div>

      {/* English Locale */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">English Locale</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">1 hour ago (English):</p>
            <TimeAgoDisplay 
              date={oneHourAgo} 
              locale={Locale.ENGLISH}
            />
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">1 day ago with datetime (English):</p>
            <TimeAgoDisplay 
              date={oneDayAgo} 
              locale={Locale.ENGLISH}
              showAbsoluteTime={true}
              absoluteTimeFormat={DateTimeFormatType.DATETIME}
            />
          </div>
        </div>
      </div>

      {/* Custom Styling */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Custom Styling</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Large text:</p>
            <TimeAgoDisplay 
              date={oneHourAgo} 
              className="text-xl font-bold text-blue-600"
            />
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Small text:</p>
            <TimeAgoDisplay 
              date={oneDayAgo} 
              className="text-xs text-gray-500"
            />
          </div>
        </div>
      </div>

      {/* Custom Update Interval */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Custom Update Interval (5 seconds)</h3>
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Updates every 5 seconds:</p>
          <TimeAgoDisplay 
            date={new Date(Date.now() - 2 * 60 * 1000)} // 2 minutes ago
            updateInterval={5000} // 5 seconds
            className="text-green-600 font-mono"
          />
        </div>
      </div>
    </div>
  );
}

// Queue Management Usage Example
export function QueueTimeAgoExample() {
  // Simulate queue data
  const queueCreatedAt = new Date(Date.now() - 45 * 60 * 1000); // 45 minutes ago
  const queueUpdatedAt = new Date(Date.now() - 15 * 60 * 1000); // 15 minutes ago

  return (
    <div className="space-y-4 p-6">
      <h2 className="text-2xl font-bold mb-4">Queue Management Example</h2>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              คิว #001
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ลูกค้า: สมชาย ใจดี
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              สร้างเมื่อ:
            </p>
            <TimeAgoDisplay 
              date={queueCreatedAt}
              showAbsoluteTime={true}
              absoluteTimeFormat={DateTimeFormatType.TIME}
              className="text-sm font-medium text-gray-900 dark:text-gray-100"
            />
            {queueUpdatedAt && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                อัปเดต: 
                <TimeAgoDisplay 
                  date={queueUpdatedAt}
                  showAbsoluteTime={false}
                  className="text-xs"
                />
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
