import { OptimizeQueueFlowInput, OptimizeQueueFlowResult } from '@/src/application/dtos/shop/backend/queue-advanced-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import type { Logger } from '@/src/domain/interfaces/logger';
import { ShopBackendQueueError, ShopBackendQueueErrorType } from '@/src/domain/repositories/shop/backend/backend-queue-repository';
import { ShopBackendQueueRepository } from '@/src/domain/repositories/shop/backend/backend-queue-repository';
import { ShopBackendEmployeeRepository } from '@/src/domain/repositories/shop/backend/backend-employee-repository';

/**
 * Use case for optimizing queue flow and providing recommendations
 * Following SOLID principles and Clean Architecture
 */
export class OptimizeQueueFlowUseCase implements IUseCase<OptimizeQueueFlowInput, OptimizeQueueFlowResult> {
  constructor(
    private readonly queueRepository: ShopBackendQueueRepository,
    private readonly employeeRepository: ShopBackendEmployeeRepository,
    private readonly logger: Logger
  ) { }

  /**
   * Execute the use case to optimize queue flow
   * @param input Optimize input
   * @returns Optimize result
   */
  async execute(input: OptimizeQueueFlowInput): Promise<OptimizeQueueFlowResult> {
    try {
      // Validate input
      if (!input.shopId) {
        throw new Error('Shop ID is required');
      }

      this.logger.info('Starting optimize queue flow', { 
        shopId: input.shopId,
        departmentId: input.departmentId
      });

      // Get current queue data
      const queueData = await this.getCurrentQueueData(input.shopId, input.departmentId);

      // Get employee data
      const employeeData = await this.getEmployeeData(input.shopId, input.departmentId);

      // Analyze queue flow
      const analysis = this.analyzeQueueFlow(queueData, employeeData);

      // Generate recommendations
      const recommendations = this.generateRecommendations(analysis, queueData, employeeData);

      // Calculate optimization metrics
      const optimizationMetrics = this.calculateOptimizationMetrics(analysis);

      const result: OptimizeQueueFlowResult = {
        success: true,
        shopId: input.shopId,
        analysis,
        recommendations,
        optimizationMetrics,
        summary: {
          totalRecommendations: recommendations.length,
          highPriorityRecommendations: recommendations.filter(r => r.priority === 'high').length,
          mediumPriorityRecommendations: recommendations.filter(r => r.priority === 'medium').length,
          lowPriorityRecommendations: recommendations.filter(r => r.priority === 'low').length,
          potentialImprovement: optimizationMetrics.potentialImprovement
        }
      };

      this.logger.info('Optimize queue flow completed', { 
        result: {
          shopId: result.shopId,
          totalRecommendations: result.summary.totalRecommendations,
          highPriorityRecommendations: result.summary.highPriorityRecommendations,
          potentialImprovement: result.summary.potentialImprovement
        }
      });

      return result;
    } catch (error) {
      this.logger.error('Failed to optimize queue flow', { error, input });

      if (error instanceof ShopBackendQueueError) {
        throw error;
      }

      throw new ShopBackendQueueError(
        ShopBackendQueueErrorType.OPERATION_FAILED,
        'Failed to optimize queue flow',
        'optimizeQueueFlow',
        { input },
        error
      );
    }
  }

  /**
   * Get current queue data
   * @param shopId Shop ID
   * @param departmentId Department ID
   * @returns Queue data
   */
  private async getCurrentQueueData(shopId: string, departmentId?: string): Promise<any[]> {
    try {
      const queues = await this.queueRepository.getPaginatedQueues({
        page: 1,
        limit: 1000,
        filters: {
          shopId,
          dateFrom: this.getDateRange(7).from, // Last 7 days
          dateTo: this.getDateRange(7).to
        }
      });

      return queues.data;
    } catch (error) {
      this.logger.error('Failed to get current queue data', { error, shopId, departmentId });
      throw error;
    }
  }

  /**
   * Get employee data
   * @param shopId Shop ID
   * @param departmentId Department ID
   * @returns Employee data
   */
  private async getEmployeeData(shopId: string, departmentId?: string): Promise<any[]> {
    try {
      const employees = await this.employeeRepository.getPaginatedEmployees({
        page: 1,
        limit: 100,
        filters: {
          statusFilter: 'active'
        }
      });

      return employees.data;
    } catch (error) {
      this.logger.error('Failed to get employee data', { error, shopId, departmentId });
      throw error;
    }
  }

  /**
   * Analyze queue flow
   * @param queues Queue data
   * @param employees Employee data
   * @returns Flow analysis
   */
  private analyzeQueueFlow(queues: any[], employees: any[]): any {
    // Calculate basic metrics
    const totalQueues = queues.length;
    const completedQueues = queues.filter(q => q.status === 'completed').length;
    const cancelledQueues = queues.filter(q => q.status === 'cancelled').length;
    const noShowQueues = queues.filter(q => q.status === 'no_show').length;

    // Calculate wait times
    const waitTimes = queues
      .filter(q => q.actualWaitTime && q.actualWaitTime > 0)
      .map(q => q.actualWaitTime);

    const averageWaitTime = waitTimes.length > 0 
      ? Math.round(waitTimes.reduce((sum, time) => sum + time, 0) / waitTimes.length)
      : 0;

    const maxWaitTime = waitTimes.length > 0 ? Math.max(...waitTimes) : 0;

    // Calculate service times
    const serviceTimes = queues
      .filter(q => q.completedAt && q.calledAt)
      .map(q => {
        const completed = new Date(q.completedAt).getTime();
        const called = new Date(q.calledAt).getTime();
        return Math.round((completed - called) / (1000 * 60));
      })
      .filter(time => time > 0);

    const averageServiceTime = serviceTimes.length > 0
      ? Math.round(serviceTimes.reduce((sum, time) => sum + time, 0) / serviceTimes.length)
      : 0;

    // Calculate employee utilization
    const employeeUtilization = employees.map(employee => {
      const employeeQueues = queues.filter(q => q.servedByEmployeeId === employee.id);
      const totalServiceTime = employeeQueues.reduce((sum, queue) => {
        if (queue.completedAt && queue.calledAt) {
          const completed = new Date(queue.completedAt).getTime();
          const called = new Date(queue.calledAt).getTime();
          return sum + (completed - called) / (1000 * 60);
        }
        return sum;
      }, 0);

      return {
        employeeId: employee.id,
        employeeName: employee.name,
        totalQueues: employeeQueues.length,
        totalServiceTime: Math.round(totalServiceTime),
        utilizationRate: employeeQueues.length > 0 ? Math.round((totalServiceTime / (7 * 8 * 60)) * 100) : 0 // 7 days * 8 hours
      };
    });

    // Calculate peak hours
    const hourlyData = this.analyzeHourlyData(queues);

    return {
      totalQueues,
      completedQueues,
      cancelledQueues,
      noShowQueues,
      completionRate: totalQueues > 0 ? Math.round((completedQueues / totalQueues) * 100) : 0,
      cancellationRate: totalQueues > 0 ? Math.round((cancelledQueues / totalQueues) * 100) : 0,
      noShowRate: totalQueues > 0 ? Math.round((noShowQueues / totalQueues) * 100) : 0,
      averageWaitTime,
      maxWaitTime,
      averageServiceTime,
      employeeUtilization,
      hourlyData,
      bottlenecks: this.identifyBottlenecks(queues, employees, averageWaitTime)
    };
  }

  /**
   * Analyze hourly data
   * @param queues Queue data
   * @returns Hourly analysis
   */
  private analyzeHourlyData(queues: any[]): any[] {
    const hourlyData: Record<number, any> = {};

    queues.forEach(queue => {
      const createdAt = new Date(queue.createdAt);
      const hour = createdAt.getHours();

      if (!hourlyData[hour]) {
        hourlyData[hour] = {
          hour,
          queueCount: 0,
          averageWaitTime: 0,
          completionRate: 0
        };
      }

      hourlyData[hour].queueCount++;

      if (queue.actualWaitTime) {
        hourlyData[hour].averageWaitTime += queue.actualWaitTime;
      }

      if (queue.status === 'completed') {
        hourlyData[hour].completionRate++;
      }
    });

    // Calculate averages
    Object.values(hourlyData).forEach((data: any) => {
      if (data.queueCount > 0) {
        data.averageWaitTime = Math.round(data.averageWaitTime / data.queueCount);
        data.completionRate = Math.round((data.completionRate / data.queueCount) * 100);
      }
    });

    return Object.values(hourlyData);
  }

  /**
   * Identify bottlenecks
   * @param queues Queue data
   * @param employees Employee data
   * @param averageWaitTime Average wait time
   * @returns Bottlenecks
   */
  private identifyBottlenecks(queues: any[], employees: any[], averageWaitTime: number): any[] {
    const bottlenecks: any[] = [];

    // Check for high wait times
    const highWaitTimeQueues = queues.filter(q => q.actualWaitTime > averageWaitTime * 1.5);
    if (highWaitTimeQueues.length > 0) {
      bottlenecks.push({
        type: 'high_wait_time',
        severity: 'high',
        description: `${highWaitTimeQueues.length} queues have wait times 50% above average`,
        affectedQueues: highWaitTimeQueues.length
      });
    }

    // Check for employee overload
    const overloadedEmployees = employees.filter(e => e.activeQueueCount > 5);
    if (overloadedEmployees.length > 0) {
      bottlenecks.push({
        type: 'employee_overload',
        severity: 'medium',
        description: `${overloadedEmployees.length} employees are handling more than 5 queues`,
        affectedEmployees: overloadedEmployees.length
      });
    }

    // Check for low completion rate
    const completionRate = queues.length > 0 ? (queues.filter(q => q.status === 'completed').length / queues.length) * 100 : 0;
    if (completionRate < 70) {
      bottlenecks.push({
        type: 'low_completion_rate',
        severity: 'medium',
        description: `Completion rate is ${Math.round(completionRate)}% (below 70% target)`,
        completionRate: Math.round(completionRate)
      });
    }

    return bottlenecks;
  }

  /**
   * Generate recommendations
   * @param analysis Flow analysis
   * @param queues Queue data
   * @param employees Employee data
   * @returns Recommendations
   */
  private generateRecommendations(analysis: any, queues: any[], employees: any[]): any[] {
    const recommendations: any[] = [];

    // Staffing recommendations
    if (analysis.averageWaitTime > 20) {
      recommendations.push({
        type: 'staffing',
        priority: 'high',
        title: 'Increase Staff During Peak Hours',
        description: 'Average wait time exceeds 20 minutes. Consider adding more staff during busy periods.',
        action: 'Add 1-2 additional employees during peak hours (9AM-11AM, 2PM-4PM)',
        estimatedImpact: 'Reduce wait time by 30-40%'
      });
    }

    // Employee utilization recommendations
    const underutilizedEmployees = analysis.employeeUtilization.filter((e: any) => e.utilizationRate < 50);
    if (underutilizedEmployees.length > 0) {
      recommendations.push({
        type: 'utilization',
        priority: 'medium',
        title: 'Optimize Employee Utilization',
        description: `${underutilizedEmployees.length} employees have utilization below 50%.`,
        action: 'Redistribute queues or provide cross-training to balance workload',
        estimatedImpact: 'Improve overall efficiency by 15-20%'
      });
    }

    // Process improvement recommendations
    if (analysis.completionRate < 80) {
      recommendations.push({
        type: 'process',
        priority: 'high',
        title: 'Improve Queue Completion Rate',
        description: `Current completion rate is ${analysis.completionRate}%. Target is 80%.`,
        action: 'Implement better queue management practices and reduce no-show rates',
        estimatedImpact: 'Increase completion rate by 15-20%'
      });
    }

    // Technology recommendations
    if (analysis.maxWaitTime > 45) {
      recommendations.push({
        type: 'technology',
        priority: 'medium',
        title: 'Implement Queue Management System',
        description: 'Maximum wait time exceeds 45 minutes.',
        action: 'Consider implementing digital queue management with SMS notifications',
        estimatedImpact: 'Reduce maximum wait time by 25-35%'
      });
    }

    // Training recommendations
    const lowPerformingEmployees = analysis.employeeUtilization.filter((e: any) => e.utilizationRate > 90);
    if (lowPerformingEmployees.length > 0) {
      recommendations.push({
        type: 'training',
        priority: 'low',
        title: 'Provide Additional Training',
        description: `${lowPerformingEmployees.length} employees are overutilized (>90%).`,
        action: 'Provide efficiency training and process optimization workshops',
        estimatedImpact: 'Improve service time by 10-15%'
      });
    }

    return recommendations;
  }

  /**
   * Calculate optimization metrics
   * @param analysis Flow analysis
   * @returns Optimization metrics
   */
  private calculateOptimizationMetrics(analysis: any): any {
    // Calculate potential improvement based on current metrics
    const currentEfficiency = analysis.completionRate / 100;
    const targetEfficiency = 0.9; // 90% target
    const potentialImprovement = Math.round(((targetEfficiency - currentEfficiency) / currentEfficiency) * 100);

    // Calculate cost savings
    const averageServiceCost = 100; // Assume 100 THB per service
    const currentRevenue = analysis.completedQueues * averageServiceCost;
    const potentialRevenue = analysis.totalQueues * targetEfficiency * averageServiceCost;
    const potentialRevenueIncrease = potentialRevenue - currentRevenue;

    return {
      currentEfficiency: Math.round(currentEfficiency * 100),
      targetEfficiency: Math.round(targetEfficiency * 100),
      potentialImprovement: Math.max(0, potentialImprovement),
      currentRevenue,
      potentialRevenue,
      potentialRevenueIncrease: Math.max(0, potentialRevenueIncrease),
      timeToImplement: '2-4 weeks',
      roi: Math.round((potentialRevenueIncrease / 5000) * 100) // Assume 5000 THB implementation cost
    };
  }

  /**
   * Get date range for last N days
   * @param days Number of days
   * @returns Date range
   */
  private getDateRange(days: number): { from: string; to: string } {
    const toDate = new Date();
    const fromDate = new Date();
    fromDate.setDate(toDate.getDate() - days);

    return {
      from: fromDate.toISOString(),
      to: toDate.toISOString()
    };
  }
}
