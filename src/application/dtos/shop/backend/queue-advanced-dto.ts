/**
 * DTOs for advanced queue management features
 * Following Clean Architecture principles
 */

export interface AutoAssignQueueInput {
  shopId: string;
  queueId: string;
  strategy: 'load-balancing' | 'priority' | 'round-robin' | 'skills';
  departmentId?: string;
  requiredSkills?: string[];
  priority?: 'low' | 'medium' | 'high';
}

export interface AutoAssignQueueResult {
  success: boolean;
  shopId: string;
  queueId: string;
  assignedEmployeeId?: string;
  assignedEmployeeName?: string;
  strategy: string;
  assignmentReason: string;
  previousAssignment?: {
    employeeId: string;
    employeeName: string;
  };
}

export interface PrioritizeQueuesInput {
  shopId: string;
  queues: Array<{
    queueId: string;
    currentPriority?: 'low' | 'medium' | 'high';
  }>;
  strategy: 'wait-time' | 'customer-tier' | 'service-complexity' | 'revenue' | 'combined';
  departmentId?: string;
}

export interface PrioritizeQueuesResult {
  success: boolean;
  shopId: string;
  prioritizedQueues: Array<{
    queueId: string;
    priority: 'normal' | 'high' | 'urgent';
    score: number;
    reason: string;
  }>;
  strategy: string;
  summary: {
    totalQueues: number;
    highPriorityCount: number;
    normalPriorityCount: number;
    urgentPriorityCount: number;
  };
}

export interface OptimizeQueueFlowInput {
  shopId: string;
  departmentId?: string;
  dateRange?: {
    from: string;
    to: string;
  };
  includeRecommendations?: boolean;
  optimizationGoals?: Array<'reduce-wait-time' | 'increase-efficiency' | 'improve-customer-satisfaction'>;
}

export interface OptimizeQueueFlowResult {
  success: boolean;
  shopId: string;
  analysis: {
    totalQueues: number;
    completedQueues: number;
    cancelledQueues: number;
    noShowQueues: number;
    completionRate: number;
    cancellationRate: number;
    noShowRate: number;
    averageWaitTime: number;
    maxWaitTime: number;
    averageServiceTime: number;
    employeeUtilization: Array<{
      employeeId: string;
      employeeName: string;
      totalQueues: number;
      totalServiceTime: number;
      utilizationRate: number;
    }>;
    hourlyData: Array<{
      hour: number;
      queueCount: number;
      averageWaitTime: number;
      completionRate: number;
    }>;
    bottlenecks: Array<{
      type: string;
      severity: 'low' | 'medium' | 'high';
      description: string;
      affectedQueues?: number;
      affectedEmployees?: number;
      completionRate?: number;
    }>;
  };
  recommendations: Array<{
    type: 'staffing' | 'utilization' | 'process' | 'technology' | 'training';
    priority: 'low' | 'medium' | 'high';
    title: string;
    description: string;
    action: string;
    estimatedImpact: string;
  }>;
  optimizationMetrics: {
    currentEfficiency: number;
    targetEfficiency: number;
    potentialImprovement: number;
    currentRevenue: number;
    potentialRevenue: number;
    potentialRevenueIncrease: number;
    timeToImplement: string;
    roi: number;
  };
  summary: {
    totalRecommendations: number;
    highPriorityRecommendations: number;
    mediumPriorityRecommendations: number;
    lowPriorityRecommendations: number;
    potentialImprovement: number;
  };
}
