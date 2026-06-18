import { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Skeleton, Stack, Typography } from '@mui/material';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';
import { logger } from '../shared/logger/logger';
import { EmptyState } from '../components/EmptyState';
import { NetworkError } from '../components/NetworkError';
import { NotificationCard } from '../components/NotificationCard';
import { usePriorityNotifications } from '../hooks/usePriorityNotifications';

const topNOptions = [5, 10, 20] as const;

export function PriorityInboxPage() {
  const [topN, setTopN] = useState<(typeof topNOptions)[number]>(5);
  const query = usePriorityNotifications(topN);

  useEffect(() => {
    logger.info('page', 'PriorityInboxPage mounted');
  }, []);

  const handleRefresh = (): void => {
    logger.info('state', 'Priority inbox refreshed');
    void query.refetch();
  };

  const handleTopNChange = (nextTopN: (typeof topNOptions)[number]): void => {
    logger.info('state', `Top N changed to ${nextTopN}`);
    setTopN(nextTopN);
  };

  if (query.isError) {
    return (
      <Box sx={{ display: 'grid', placeItems: 'center', py: { xs: 4, md: 8 } }}>
        <Box sx={{ width: '100%', maxWidth: 760 }}>
          <NetworkError
            title="Could not load priority inbox"
            message="The ranked notifications feed is unavailable right now."
            error={query.error as Error | null}
            onRetry={handleRefresh}
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
          background: 'rgba(255,255,255,0.84)',
          backdropFilter: 'blur(16px)'
        }}
      >
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2} alignItems={{ xs: 'stretch', md: 'center' }}>
          <Box>
            <Typography variant="overline" color="primary.main" sx={{ letterSpacing: 1.8, fontWeight: 700 }}>
              Ranked View
            </Typography>
            <Typography variant="h4" sx={{ fontFamily: '"Space Grotesk", "IBM Plex Sans", sans-serif', fontWeight: 700 }}>
              Priority Inbox
            </Typography>
          </Box>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'center' }}>
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel id="priority-topn-label">Top N</InputLabel>
              <Select
                labelId="priority-topn-label"
                value={topN}
                label="Top N"
                onChange={(event) => handleTopNChange(Number(event.target.value) as (typeof topNOptions)[number])}
              >
                {topNOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button variant="contained" startIcon={<RefreshRoundedIcon />} onClick={handleRefresh} sx={{ borderRadius: 999, px: 2.5 }}>
              Refresh
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {query.isLoading ? (
        <Grid container spacing={2.5}>
          {Array.from({ length: 4 }).map((_, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Skeleton variant="rounded" height={172} sx={{ borderRadius: 4 }} />
            </Grid>
          ))}
        </Grid>
      ) : query.data.length === 0 ? (
        <EmptyState
          title="Priority inbox is clear"
          message="Unread notifications that qualify for the ranked inbox will appear here."
          icon={<InboxOutlinedIcon sx={{ fontSize: 56 }} />}
        />
      ) : (
        <Grid container spacing={2.5}>
          {query.data.map((notification) => (
            <Grid key={String(notification.id)} item xs={12} md={6} lg={4}>
              <NotificationCard notification={notification} rank={notification.rank} score={notification.score} showScore />
            </Grid>
          ))}
        </Grid>
      )}

      {query.isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress size={24} />
        </Box>
      ) : null}
    </Stack>
  );
}
