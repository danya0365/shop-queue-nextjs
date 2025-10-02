import { ConsoleLogger } from "@/src/infrastructure/loggers/console-logger";
import { RealtimeChannel, SupabaseClient } from "@supabase/supabase-js";

const logger = new ConsoleLogger();

export interface QueueChangePayload {
  id: string;
  shop_id: string;
  customer_id: string;
  queue_number: string;
  status: string;
  priority?: string;
  note?: string;
  old_record?: any;
  new_record?: any;
}

export interface NotificationServiceOptions {
  shopId: string;
  onQueueCreated?: (payload: QueueChangePayload) => void;
  onQueueUpdated?: (payload: QueueChangePayload) => void;
  onError?: (error: Error) => void;
  autoSendNotification?: boolean; // Default: true
}

/**
 * RealtimeNotificationService
 *
 * Subscribe to real-time database changes and send notifications
 *
 * Usage:
 * ```typescript
 * const service = new RealtimeNotificationService(supabase);
 *
 * service.subscribeToQueueChanges({
 *   shopId: 'shop-uuid',
 *   autoSendNotification: true,
 *   onQueueCreated: (payload) => {
 *     console.log('New queue created:', payload);
 *   }
 * });
 *
 * // Later...
 * service.unsubscribe();
 * ```
 */
export class RealtimeNotificationService {
  private channel: RealtimeChannel | null = null;
  private options: NotificationServiceOptions | null = null;

  constructor(private supabase: SupabaseClient) {}

  /**
   * Subscribe to queue changes for a specific shop
   */
  subscribeToQueueChanges(
    options: NotificationServiceOptions
  ): RealtimeChannel {
    this.options = options;
    const { shopId, autoSendNotification = true } = options;

    logger.info("Subscribing to queue changes", { shopId });

    this.channel = this.supabase
      .channel(`queue-changes-${shopId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "queues",
          filter: `shop_id=eq.${shopId}`,
        },
        async (payload) => {
          logger.info("New queue detected", {
            queueId: payload.new.id,
            queueNumber: payload.new.queue_number,
          });

          const queuePayload: QueueChangePayload = {
            id: payload.new.id,
            shop_id: payload.new.shop_id,
            customer_id: payload.new.customer_id,
            queue_number: payload.new.queue_number,
            status: payload.new.status,
            priority: payload.new.priority,
            note: payload.new.note,
            new_record: payload.new,
          };

          // Call custom callback
          if (options.onQueueCreated) {
            try {
              options.onQueueCreated(queuePayload);
            } catch (error) {
              logger.error("Error in onQueueCreated callback", { error });
            }
          }

          // Auto-send notification
          if (autoSendNotification) {
            await this.sendNotification("new_queue", queuePayload);
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "queues",
          filter: `shop_id=eq.${shopId}`,
        },
        async (payload) => {
          // Check if status changed
          const oldStatus = payload.old?.status;
          const newStatus = payload.new.status;

          if (oldStatus === newStatus) {
            // Status not changed, skip notification
            return;
          }

          logger.info("Queue status changed", {
            queueId: payload.new.id,
            oldStatus,
            newStatus,
          });

          const queuePayload: QueueChangePayload = {
            id: payload.new.id,
            shop_id: payload.new.shop_id,
            customer_id: payload.new.customer_id,
            queue_number: payload.new.queue_number,
            status: newStatus,
            priority: payload.new.priority,
            note: payload.new.note,
            old_record: payload.old,
            new_record: payload.new,
          };

          // Call custom callback
          if (options.onQueueUpdated) {
            try {
              options.onQueueUpdated(queuePayload);
            } catch (error) {
              logger.error("Error in onQueueUpdated callback", { error });
            }
          }

          // Auto-send notification based on status
          if (autoSendNotification) {
            const notificationType =
              this.getNotificationTypeFromStatus(newStatus);
            if (notificationType) {
              await this.sendNotification(notificationType, queuePayload);
            }
          }
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          logger.info("Successfully subscribed to queue changes", { shopId });
        } else if (status === "CHANNEL_ERROR") {
          logger.error("Channel error", { shopId });
          if (options.onError) {
            options.onError(new Error("Realtime channel error"));
          }
        } else if (status === "TIMED_OUT") {
          logger.error("Subscription timed out", { shopId });
          if (options.onError) {
            options.onError(new Error("Realtime subscription timed out"));
          }
        }
      });

    return this.channel;
  }

  /**
   * Manually send notification
   */
  async sendNotification(
    type:
      | "new_queue"
      | "queue_confirmed"
      | "queue_serving"
      | "queue_completed"
      | "queue_cancelled"
      | "queue_no_show",
    queueData: QueueChangePayload
  ): Promise<boolean> {
    try {
      logger.info("Sending notification", { type, queueId: queueData.id });

      const response = await fetch("/api/notifications/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          queueData,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        logger.error("Failed to send notification", {
          status: response.status,
          error: errorText,
        });

        if (this.options?.onError) {
          this.options.onError(new Error(`Notification failed: ${errorText}`));
        }

        return false;
      }

      const result = await response.json();
      logger.info("Notification sent successfully", { result });
      return true;
    } catch (error) {
      logger.error("Notification error", { error });

      if (this.options?.onError) {
        this.options.onError(
          error instanceof Error ? error : new Error("Unknown error")
        );
      }

      return false;
    }
  }

  /**
   * Get notification type from queue status
   */
  private getNotificationTypeFromStatus(
    status: string
  ):
    | "queue_confirmed"
    | "queue_serving"
    | "queue_completed"
    | "queue_cancelled"
    | "queue_no_show"
    | null {
    const statusMap: Record<string, any> = {
      confirmed: "queue_confirmed",
      serving: "queue_serving",
      completed: "queue_completed",
      cancelled: "queue_cancelled",
      no_show: "queue_no_show",
    };

    return statusMap[status] || null;
  }

  /**
   * Unsubscribe from queue changes
   */
  unsubscribe(): void {
    if (this.channel) {
      logger.info("Unsubscribing from queue changes");
      this.supabase.removeChannel(this.channel);
      this.channel = null;
      this.options = null;
    }
  }

  /**
   * Check if currently subscribed
   */
  isSubscribed(): boolean {
    return this.channel !== null;
  }

  /**
   * Get current channel status
   */
  getChannelStatus(): string | null {
    return this.channel?.state || null;
  }
}

/**
 * Factory function to create RealtimeNotificationService
 */
export function createRealtimeNotificationService(
  supabase: SupabaseClient
): RealtimeNotificationService {
  return new RealtimeNotificationService(supabase);
}
