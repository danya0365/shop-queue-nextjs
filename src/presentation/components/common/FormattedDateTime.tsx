import React from 'react';
import { useFormatDateTime } from '../../hooks/useDateTime';
import { IDateTimeFormattingService } from '../../../application/services/DateTimeFormattingService';
import { DateTimeFormatType, Locale } from '../../../domain/entities/datetime/DateTimeEntities';

interface FormattedDateTimeProps {
  date: Date | string;
  formatType?: DateTimeFormatType;
  locale?: Locale;
  includeSeconds?: boolean;
  includeTimezone?: boolean;
  service: IDateTimeFormattingService;
  fallback?: string;
  className?: string;
}

export const FormattedDateTime: React.FC<FormattedDateTimeProps> = ({
  date,
  formatType,
  locale,
  includeSeconds = false,
  includeTimezone = false,
  service,
  fallback = '-',
  className = ''
}) => {
  const { formatDateTime, isLoading, error } = useFormatDateTime(service);
  const [formattedDate, setFormattedDate] = React.useState<string>(fallback);

  React.useEffect(() => {
    const formatDate = async () => {
      try {
        const result = await formatDateTime(date, {
          formatType,
          locale,
          includeSeconds,
          includeTimezone
        });
        setFormattedDate(result);
      } catch (err) {
        console.error('Failed to format date:', err);
        setFormattedDate(fallback);
      }
    };

    formatDate();
  }, [date, formatType, locale, includeSeconds, includeTimezone, service, fallback, formatDateTime]);

  if (isLoading) {
    return <span className={className}>กำลังโหลด...</span>;
  }

  if (error) {
    return <span className={className} title={error}>{fallback}</span>;
  }

  return <span className={className}>{formattedDate}</span>;
};

interface RelativeTimeProps {
  date: Date | string;
  referenceDate?: Date;
  service: IDateTimeFormattingService;
  fallback?: string;
  className?: string;
}

export const RelativeTime: React.FC<RelativeTimeProps> = ({
  date,
  referenceDate,
  service,
  fallback = '-',
  className = ''
}) => {
  const { formatRelativeDateTime, isLoading, error } = useFormatDateTime(service);
  const [formattedDate, setFormattedDate] = React.useState<string>(fallback);

  React.useEffect(() => {
    const formatDate = async () => {
      try {
        const result = await formatRelativeDateTime(date, referenceDate);
        setFormattedDate(result);
      } catch (err) {
        console.error('Failed to format relative date:', err);
        setFormattedDate(fallback);
      }
    };

    formatDate();
  }, [date, referenceDate, service, fallback, formatRelativeDateTime]);

  if (isLoading) {
    return <span className={className}>กำลังโหลด...</span>;
  }

  if (error) {
    return <span className={className} title={error}>{fallback}</span>;
  }

  return <span className={className}>{formattedDate}</span>;
};
