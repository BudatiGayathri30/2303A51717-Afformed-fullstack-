import { useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAllNotifications } from './useNotifications';
import { getTopNNotifications } from '../utils/priorityInbox';
import { logger } from '../shared/logger/logger';

export function usePriorityNotifications(topN: number) {
  useEffect(() => {
    logger.info('hook', `usePriorityNotifications topN=${topN}`);
  }, [topN]);

  const query = useQuery({
    queryKey: ['priority-notifications', topN],
    queryFn: () => fetchAllNotifications('All'),
    staleTime: 15_000,
    retry: 1,
    refetchOnWindowFocus: false,
    select: (notifications) => getTopNNotifications(notifications, topN)
  });

  const rankedNotifications = useMemo(() => query.data ?? [], [query.data]);

  return {
    data: rankedNotifications,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch
  };
}
