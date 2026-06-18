import { useEffect, useState } from 'react';
import {
  Box,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Skeleton,
  Stack,
  Typography
} from '@mui/material';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { logger } from '../shared/logger/logger';
import { EmptyState } from '../components/EmptyState';
import { NetworkError } from '../components/NetworkError';
import { NotificationCard } from '../components/NotificationCard';
import { useNotifications } from '../hooks/useNotifications';
import type { NotificationType } from '../utils/priorityInbox';

const pageSize = 10;
const notificationFilters: Array<'All' | NotificationType> = ['All', 'Event', 'Result', 'Placement'];

function renderSkeletonCards() {
  return Array.from({ length: 6 }).map((_, index) => (
    <Grid item xs={12} md={6} key={index}>
      <Skeleton variant="rounded" height={172} sx={{ borderRadius: 4 }} />
    </Grid>
  ));
}

export function NotificationsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<'All' | NotificationType>('All');
  const query = useNotifications(currentPage, pageSize, filter);

  useEffect(() => {
    logger.info('page', 'NotificationsPage mounted');
  }, []);

  const handleFilterChange = (nextFilter: 'All' | NotificationType): void => {
    logger.info('state', `Filter changed to ${nextFilter}`);
    setCurrentPage(1);
    setFilter(nextFilter);
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, nextPage: number): void => {
    logger.info('state', `Page changed to ${nextPage}`);
    setCurrentPage(nextPage);
  };

  if (query.isError) {
    return (
      <Box sx={{ display: 'grid', placeItems: 'center', py: { xs: 4, md: 8 } }}>
        <Box sx={{ width: '100%', maxWidth: 760 }}>
          <NetworkError
            title="Could not load notifications"
            message="The notifications feed is unavailable right now."
            error={query.error as Error | null}
            onRetry={() => {
              void query.refetch();
            }}
          />
        </Box>
      </Box>
    );
  }

  return (
    <Stack spacing={3}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 3 },
          borderRadius: 4,
          border: '1px solid',
          borderColor: 'divider',
          background: 'rgba(255,255,255,0.82)',
          backdropFilter: 'blur(16px)'
        }}
      >
        <Stack spacing={2}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
            <Box>
              <Typography variant="overline" color="primary.main" sx={{ letterSpacing: 1.8, fontWeight: 700 }}>
                Activity Feed
              </Typography>
              <Typography variant="h4" sx={{ fontFamily: '"Space Grotesk", "IBM Plex Sans", sans-serif', fontWeight: 700 }}>
                Notifications
              </Typography>
            </Box>
            {query.isLoading ? <CircularProgress size={24} /> : null}
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <FormControl size="small" sx={{ minWidth: 220 }}>
              <InputLabel id="notification-filter-label">Notification type</InputLabel>
              <Select
                labelId="notification-filter-label"
                value={filter}
                label="Notification type"
                onChange={(event) => handleFilterChange(event.target.value as 'All' | NotificationType)}
              >
                {notificationFilters.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'center' }}>
              Page {currentPage}
            </Typography>
          </Stack>
        </Stack>
      </Paper>

      {query.isLoading ? (
        <Grid container spacing={2.5}>
          {renderSkeletonCards()}
        </Grid>
      ) : query.data.length === 0 ? (
        <EmptyState
          title="No notifications yet"
          message="There are no matching notifications for the selected filter."
          icon={<NotificationsOutlinedIcon sx={{ fontSize: 56 }} />}
        />
      ) : (
        <Grid container spacing={2.5}>
          {query.data.map((notification) => (
            <Grid key={String(notification.id)} item xs={12} md={6} lg={4}>
              <NotificationCard notification={notification} />
            </Grid>
          ))}
        </Grid>
      )}

      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: 4,
          border: '1px solid',
          borderColor: 'divider',
          background: 'rgba(255,255,255,0.82)'
        }}
      >
        <Stack direction="row" justifyContent="center" alignItems="center">
          <Pagination count={Math.max(query.pageCount, currentPage)} page={currentPage} onChange={handlePageChange} color="primary" />
        </Stack>
      </Paper>
    </Stack>
  );
}
