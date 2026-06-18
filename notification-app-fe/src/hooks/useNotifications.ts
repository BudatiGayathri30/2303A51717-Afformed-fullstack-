import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosClient from '../api/axiosClient';
import { logger } from '../shared/logger/logger';
import type { NotificationItem, NotificationType } from '../utils/priorityInbox';

interface NotificationsApiResponse {
  notifications?: unknown;
  items?: unknown;
  data?: unknown;
  total?: unknown;
  count?: unknown;
  totalPages?: unknown;
  total_pages?: unknown;
  meta?: {
    total?: unknown;
    count?: unknown;
    totalPages?: unknown;
    total_pages?: unknown;
  };
}

interface NotificationsPageResult {
  items: NotificationItem[];
  total: number;
  pageCount: number;
  page: number;
  limit: number;
}

function extractNotificationArray(payload: unknown): NotificationItem[] {
  if (Array.isArray(payload)) {
    return payload as NotificationItem[];
  }

  if (!payload || typeof payload !== 'object') {
    return [];
  }

  const record = payload as Record<string, unknown>;
  const possibleCollections = [record.notifications, record.items, record.data];

  for (const collection of possibleCollections) {
    if (Array.isArray(collection)) {
      return collection as NotificationItem[];
    }
  }

  return [];
}

function readNumericValue(payload: NotificationsApiResponse, keys: string[]): number | undefined {
  for (const key of keys) {
    const directValue = payload[key as keyof NotificationsApiResponse];
    if (typeof directValue === 'number' && Number.isFinite(directValue)) {
      return directValue;
    }
  }

  const nestedPayload = payload.meta;
  if (!nestedPayload) {
    return undefined;
  }

  for (const key of keys) {
    const nestedValue = nestedPayload[key as keyof NonNullable<NotificationsApiResponse['meta']>];
    if (typeof nestedValue === 'number' && Number.isFinite(nestedValue)) {
      return nestedValue;
    }
  }

  return undefined;
}

function derivePageCount(payload: NotificationsApiResponse, page: number, limit: number, itemCount: number): number {
  const totalPages = readNumericValue(payload, ['totalPages', 'total_pages']);
  if (typeof totalPages === 'number' && totalPages > 0) {
    return totalPages;
  }

  const totalRecords = readNumericValue(payload, ['total', 'count']);
  if (typeof totalRecords === 'number' && totalRecords >= 0) {
    return Math.max(Math.ceil(totalRecords / limit), 1);
  }

  return itemCount < limit ? page : page + 1;
}

export async function fetchNotificationsPage(
  page: number,
  limit: number,
  notificationType: NotificationType | 'All' = 'All'
): Promise<NotificationsPageResult> {
  logger.info('api', `Fetching notifications page=${page}`);

  try {
    const response = await axiosClient.get<NotificationsApiResponse>('/notifications', {
      params: {
        page,
        limit,
        ...(notificationType !== 'All' ? { notification_type: notificationType } : {})
      }
    });

    const responseBody = response.data ?? {};
    const items = extractNotificationArray(responseBody);
    const total = readNumericValue(responseBody, ['total', 'count']) ?? items.length;
    const pageCount = derivePageCount(responseBody, page, limit, items.length);

    logger.info('api', `Fetched ${items.length} notifications successfully`);

    return {
      items,
      total,
      pageCount,
      page,
      limit
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch notifications';
    logger.error('api', message);
    throw error;
  }
}

export async function fetchAllNotifications(notificationType: NotificationType | 'All' = 'All'): Promise<NotificationItem[]> {
  const limit = 100;
  let currentPage = 1;
  const collectedNotifications: NotificationItem[] = [];

  while (true) {
    const pageResult = await fetchNotificationsPage(currentPage, limit, notificationType);
    collectedNotifications.push(...pageResult.items);

    if (pageResult.items.length < limit || currentPage >= pageResult.pageCount) {
      break;
    }

    currentPage += 1;
  }

  return collectedNotifications;
}

export function useNotifications(page: number, limit: number, notificationType: NotificationType | 'All' = 'All') {
  useEffect(() => {
    logger.info('hook', `useNotifications page=${page} limit=${limit}`);
  }, [page, limit, notificationType]);

  const query = useQuery({
    queryKey: ['notifications', page, limit, notificationType],
    queryFn: () => fetchNotificationsPage(page, limit, notificationType),
    staleTime: 30_000,
    retry: 1,
    refetchOnWindowFocus: false
  });

  return {
    data: query.data?.items ?? [],
    total: query.data?.total ?? 0,
    pageCount: query.data?.pageCount ?? 0,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch
  };
}
