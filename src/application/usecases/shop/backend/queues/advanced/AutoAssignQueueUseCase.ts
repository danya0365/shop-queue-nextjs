import { AutoAssignQueueInput, AutoAssignQueueResult } from '@/src/application/dtos/shop/backend/queue-advanced-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { ILogger } from '@/src/application/interfaces/logger.interface';
import { QueueEntity } from '@/src/domain/entities/shop/backend/backend-queue.entity';
import { ShopBackendQueueError, ShopBackendQueueErrorType } from '@/src/domain/repositories/shop/backend/backend-queue-repository';
import { ShopBackendQueueRepository } from '@/src/domain/repositories/shop/backend/backend-queue-repository';
import { ShopBackendEmployeeRepository } from '@/src/domain/repositories/shop/backend/backend-employee-repository';
import { EmployeeEntity, EmployeeStatus } from '@/src/domain/entities/shop/backend/backend-employee.entity';

/**
 * Use case for automatically assigning queues to employees
 * Following SOLID principles and Clean Architecture
 */
export class AutoAssignQueueUseCase implements IUseCase<AutoAssignQueueInput, AutoAssignQueueResult> {
  constructor(
    private readonly queueRepository: ShopBackendQueueRepository,
    private readonly employeeRepository: ShopBackendEmployeeRepository,
    private readonly logger: ILogger
  ) { }

  /**
   * Execute the use case to auto-assign a queue
   * @param input Auto-assign input
   * @returns Auto-assign result
   */
  async execute(input: AutoAssignQueueInput): Promise<AutoAssignQueueResult> {
    try {
      // Validate input
      if (!input.queueId) {
        throw new Error('Queue ID is required');
      }

      if (!input.shopId) {
        throw new Error('Shop ID is required');
      }

      this.logger.info('Starting auto-assign queue', { 
        queueId: input.queueId,
        shopId: input.shopId,
        strategy: input.strategy || 'load-balancing'
      });

      // Get the queue to be assigned
      const queue = await this.queueRepository.getQueueById(input.queueId);
      if (!queue) {
        throw new Error('Queue not found');
      }

      // Validate queue can be assigned
      this.validateQueueForAssignment(queue);

      // Get available employees
      const availableEmployees = await this.getAvailableEmployees(input.shopId);
      
      if (availableEmployees.length === 0) {
        throw new Error('No available employees found');
      }

      // Select the best employee using the specified strategy
      const selectedEmployee = this.applyAssignmentStrategy(availableEmployees, queue, input.strategy);

      // Assign the queue to the selected employee
      const updatedQueue = await this.assignQueueToEmployee(queue, selectedEmployee);

      const result: AutoAssignQueueResult = {
        success: true,
        shopId: input.shopId,
        queueId: input.queueId,
        assignedEmployeeId: selectedEmployee.id,
        assignedEmployeeName: selectedEmployee.name,
        strategy: input.strategy || 'load-balancing',
        assignmentReason: `Queue successfully assigned to ${selectedEmployee.name}`
      };

      this.logger.info('Auto-assign queue completed', { 
        result: {
          queueId: result.queueId,
          assignedEmployeeId: result.assignedEmployeeId,
          assignedEmployeeName: result.assignedEmployeeName,
          strategy: result.strategy
        },
        updatedQueue: {
          id: updatedQueue.id,
          status: updatedQueue.status,
          servedByEmployeeId: updatedQueue.servedByEmployeeId
        }
      });

      return result;
    } catch (error) {
      this.logger.error('Failed to auto-assign queue', error instanceof Error ? error : undefined, { input });

      if (error instanceof ShopBackendQueueError) {
        throw error;
      }

      throw new ShopBackendQueueError(
        ShopBackendQueueErrorType.OPERATION_FAILED,
        'Failed to auto-assign queue',
        'autoAssignQueue',
        { input },
        error
      );
    }
  }

  /**
   * Validate queue for assignment
   * @param queue Queue to validate
   * @throws Error if queue cannot be assigned
   */
  private validateQueueForAssignment(queue: QueueEntity): void {
    // Check if queue is already assigned
    if (queue.servedByEmployeeId) {
      throw new Error('Queue is already assigned to an employee');
    }

    // Check if queue is in a state that can be assigned
    if (queue.status !== 'waiting') {
      throw new Error(`Cannot assign queue with status: ${queue.status}`);
    }
  }

  /**
   * Get available employees for assignment
   * @param shopId Shop ID
   * @param departmentId Department ID
   * @param requiredSkills Required skills
   * @returns Array of available employees
   */
  private async getAvailableEmployees(
    shopId: string,
    departmentId?: string,
    requiredSkills?: string[]
  ): Promise<EmployeeEntity[]> {
    try {
      const employees = await this.employeeRepository.getPaginatedEmployees({
        page: 1,
        limit: 100,
        filters: {
          departmentFilter: departmentId,
          statusFilter: 'active'
        }
      });

      // Filter employees based on availability and skills
      return employees.data.filter(employee => {
        // Check if employee is currently available (not overloaded)
        const isAvailable = this.isEmployeeAvailable(employee);
        
        // Check if employee has required skills
        const hasRequiredSkills = requiredSkills 
          ? this.employeeHasRequiredSkills(employee, requiredSkills)
          : true;

        return isAvailable && hasRequiredSkills;
      });
    } catch (error) {
      this.logger.error('Failed to get available employees', error instanceof Error ? error : undefined, { 
        shopId, 
        departmentId 
      });
      throw error;
    }
  }

  /**
   * Check if employee is available for assignment
   * @param employee Employee to check
   * @returns True if employee is available
   */
  private isEmployeeAvailable(employee: EmployeeEntity): boolean {
    // Check if employee is active
    if (employee.status !== EmployeeStatus.ACTIVE) {
      return false;
    }

    // For now, we'll assume all active employees are available
    // In a real implementation, you would check on-duty status and queue capacity here
    return true;
  }

  /**
   * Check if employee is within working hours
   * @param employee Employee to check
   * @returns True if employee is within working hours
   */
  private isWithinWorkingHours(_employee: EmployeeEntity): boolean {
    // For now, we'll assume all employees are available since we don't have workingHours in EmployeeEntity
    // In a real implementation, you would check working hours here
    return true;
  }

  /**
   * Check if employee has required skills
   * @param employee Employee to check
   * @param requiredSkills Required skills
   * @returns True if employee has all required skills
   */
  private employeeHasRequiredSkills(_employee: EmployeeEntity, _requiredSkills: string[]): boolean {
    // For now, we'll assume all employees have the required skills since we don't have skills in EmployeeEntity
    // In a real implementation, you would check employee permissions or skills here
    return true;
  }

  /**
   * Apply assignment strategy to select best employee
   * @param employees Available employees
   * @param queue Queue to assign
   * @param strategy Assignment strategy
   * @returns Selected employee
   */
  private applyAssignmentStrategy(
    employees: EmployeeEntity[],
    queue: QueueEntity,
    strategy: string
  ): EmployeeEntity {
    switch (strategy) {
      case 'load-balancing':
        return this.selectByLoadBalancing(employees);
      case 'priority':
        return this.selectByPriority(employees, queue);
      case 'round-robin':
        return this.selectByRoundRobin(employees);
      case 'skills':
        return this.selectBySkills(employees, queue);
      default:
        return this.selectByLoadBalancing(employees);
    }
  }

  /**
   * Select employee by load balancing (least busy)
   * @param employees Available employees
   * @returns Selected employee
   */
  private selectByLoadBalancing(employees: EmployeeEntity[]): EmployeeEntity {
    // For now, just return the first employee since we don't have activeQueueCount in EmployeeEntity
    // In a real implementation, you would select based on current workload
    return employees[0];
  }

  /**
   * Select employee by priority matching
   * @param employees Available employees
   * @param queue Queue to assign
   * @returns Selected employee
   */
  private selectByPriority(employees: EmployeeEntity[], _queue: QueueEntity): EmployeeEntity {
    // For priority-based assignment, we can assign to employees who handle high-priority queues well
    // This is a simplified version - in reality, you might track employee performance with different priority levels
    // For now, just return the first employee
    return employees[0];
  }

  /**
   * Select employee by round-robin
   * @param employees Available employees
   * @returns Selected employee
   */
  private selectByRoundRobin(employees: EmployeeEntity[]): EmployeeEntity {
    // Simple round-robin implementation
    // In a real implementation, you would track the last assigned employee and select the next one
    const now = Date.now();
    const index = now % employees.length;
    return employees[index];
  }

  /**
   * Select employee by skills matching
   * @param employees Available employees
   * @param queue Queue to assign
   * @returns Selected employee
   */
  private selectBySkills(employees: EmployeeEntity[], queue: QueueEntity): EmployeeEntity {
    // For now, just return the first employee since we don't have skills in EmployeeEntity
    // In a real implementation, you would match employee skills with queue services
    return employees[0];
  }

  /**
   * Assign queue to employee
   * @param queue Queue to assign
   * @param employee Employee to assign
   * @returns Updated queue
   */
  private async assignQueueToEmployee(queue: QueueEntity, employee: EmployeeEntity): Promise<QueueEntity> {
    try {
      const updateData = {
        servedByEmployeeId: employee.id,
        status: 'in_progress' as const,
        calledAt: new Date().toISOString()
      };

      const updatedQueue = await this.queueRepository.updateQueue(queue.id, updateData);
      return updatedQueue;
    } catch (error) {
      this.logger.error('Failed to assign queue to employee', error instanceof Error ? error : undefined, { 
        queueId: queue.id, 
        employeeId: employee.id 
      });
      throw error;
    }
  }
}
