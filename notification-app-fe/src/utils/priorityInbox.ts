import { logger } from '../shared/logger/logger';
import { MinHeap } from './minHeap';

export type NotificationType = 'Event' | 'Result' | 'Placement';

export interface NotificationItem {
  id: string | number;
  type: NotificationType | string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  user_id?: string | number;
  [key: string]: unknown;
}

export interface RankedNotification extends NotificationItem {
  score: number;
  rank: number;
}

const priorityWeights: Record<NotificationType, number> = {
  Placement: 3,
  Result: 2,
  Event: 1
};

function resolveNotificationType(value: string): NotificationType | undefined {
  if (value === 'Placement' || value === 'Result' || value === 'Event') {
    return value;
  }

  return undefined;
}

function calculateScore(notification: NotificationItem): number {
  const notificationType = resolveNotificationType(notification.type);
  const priorityWeight = notificationType ? priorityWeights[notificationType] : 0;
  const createdAt = new Date(notification.created_at).getTime();
  const ageInSeconds = Number.isFinite(createdAt) ? Math.max(Math.floor((Date.now() - createdAt) / 1000), 0) : 0;

  return priorityWeight * 1_000_000 - ageInSeconds;
}

export function getTopNNotifications(notifications: NotificationItem[], n: number): RankedNotification[] {
  if (n <= 0) {
    logger.info('utils', 'Priority ranking calculated');
    return [];
  }

  const heap = new MinHeap<RankedNotification>((left, right) => {
    if (left.score !== right.score) {
      return left.score - right.score;
    }

    return String(left.id).localeCompare(String(right.id));
  });

  for (const notification of notifications) {
    if (notification.is_read) {
      continue;
    }

    const score = calculateScore(notification);
    const rankedNotification: RankedNotification = {
      ...notification,
      score,
      rank: 0
    };

    if (heap.size() < n) {
      heap.insert(rankedNotification);
      continue;
    }

    const smallestNotification = heap.peek();
    if (smallestNotification && rankedNotification.score > smallestNotification.score) {
      heap.extractMin();
      heap.insert(rankedNotification);
    }
  }

  const rankedNotifications: RankedNotification[] = [];
  while (heap.size() > 0) {
    const notification = heap.extractMin();
    if (notification) {
      rankedNotifications.push(notification);
    }
  }

  const sortedNotifications = rankedNotifications.sort((left, right) => right.score - left.score);
  const withRanks = sortedNotifications.map((notification, index) => ({
    ...notification,
    rank: index + 1
  }));

  logger.info('utils', 'Priority ranking calculated');
  return withRanks;
}
