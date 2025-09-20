"use client";

import { DateTimeDisplay } from "./DateTimeDisplay";
import { DateTimeFormatType, Locale } from "@/src/domain/entities/datetime/DateTimeEntities";

export const DateTimeDisplayExample = () => {
  return (
    <div className="space-y-4 p-6">
      <h2 className="text-2xl font-bold">DateTime Component Examples</h2>
      
      {/* Basic usage with default settings */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Basic Usage (Thai, with seconds)</h3>
        <div className="p-4 bg-gray-100 rounded-lg">
          <DateTimeDisplay />
        </div>
      </div>

      {/* English locale */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">English Locale</h3>
        <div className="p-4 bg-gray-100 rounded-lg">
          <DateTimeDisplay locale={Locale.ENGLISH} />
        </div>
      </div>

      {/* Time only */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Time Only</h3>
        <div className="p-4 bg-gray-100 rounded-lg">
          <DateTimeDisplay 
            formatType={DateTimeFormatType.TIME}
            includeSeconds={false}
          />
        </div>
      </div>

      {/* Date only */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Date Only</h3>
        <div className="p-4 bg-gray-100 rounded-lg">
          <DateTimeDisplay 
            formatType={DateTimeFormatType.DATE}
          />
        </div>
      </div>

      {/* Custom styling */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Custom Styling</h3>
        <div className="p-4 bg-gray-100 rounded-lg">
          <DateTimeDisplay 
            className="text-xl font-mono text-blue-600"
            includeTimezone={true}
          />
        </div>
      </div>

      {/* Custom update interval (5 seconds) */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Update Every 5 Seconds</h3>
        <div className="p-4 bg-gray-100 rounded-lg">
          <DateTimeDisplay 
            updateInterval={5000}
            className="text-green-600 font-semibold"
          />
        </div>
      </div>
    </div>
  );
};

export default DateTimeDisplayExample;
