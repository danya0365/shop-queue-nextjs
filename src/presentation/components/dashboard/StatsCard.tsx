'use client';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon: React.ReactNode;
  description?: string;
}

export function StatsCard({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  icon, 
  description 
}: StatsCardProps) {
  const getChangeColor = () => {
    switch (changeType) {
      case 'increase':
        return 'text-success';
      case 'decrease':
        return 'text-error';
      default:
        return 'text-muted';
    }
  };

  const getChangeIcon = () => {
    switch (changeType) {
      case 'increase':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
          </svg>
        );
      case 'decrease':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7l-9.2 9.2M7 7v10h10" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-surface rounded-lg border border-border p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted mb-1">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          
          {change && (
            <div className={`flex items-center mt-2 ${getChangeColor()}`}>
              {getChangeIcon()}
              <span className="text-sm ml-1">{change}</span>
            </div>
          )}
          
          {description && (
            <p className="text-xs text-muted mt-1">{description}</p>
          )}
        </div>
        
        <div className="text-primary opacity-80">
          {icon}
        </div>
      </div>
    </div>
  );
}
