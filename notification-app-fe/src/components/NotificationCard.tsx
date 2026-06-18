import { useEffect } from 'react';
import { Card, CardContent, Chip, Stack, Typography } from '@mui/material';
import type { NotificationItem, NotificationType, RankedNotification } from '../utils/priorityInbox';
import { logger } from '../shared/logger/logger';

interface NotificationCardProps {
  notification: NotificationItem | RankedNotification;
  rank?: number;
  score?: number;
  showScore?: boolean;
}

const chipColorByType: Record<NotificationType, 'primary' | 'success' | 'warning'> = {
  Placement: 'primary',
  Result: 'success',
  Event: 'warning'
};

function formatRelativeTime(timestamp: string): string {
  const parsedTimestamp = new Date(timestamp).getTime();
  if (!Number.isFinite(parsedTimestamp)) {
    return 'Recently';
  }

  const deltaInSeconds = Math.floor((Date.now() - parsedTimestamp) / 1000);
  if (deltaInSeconds < 60) {
    return 'Just now';
  }

  const deltaInMinutes = Math.floor(deltaInSeconds / 60);
  if (deltaInMinutes < 60) {
    return `${deltaInMinutes}m ago`;
  }

  const deltaInHours = Math.floor(deltaInMinutes / 60);
  if (deltaInHours < 24) {
    return `${deltaInHours}h ago`;
  }

  const deltaInDays = Math.floor(deltaInHours / 24);
  return `${deltaInDays}d ago`;
}

export function NotificationCard({ notification, rank, score, showScore = false }: NotificationCardProps) {
  useEffect(() => {
    logger.info('component', 'NotificationCard mounted');
  }, []);

  const notificationType = notification.type as NotificationType;
  const chipColor = chipColorByType[notificationType] ?? 'primary';
  const borderColor = notification.is_read ? 'divider' : 'primary.main';

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        border: '1px solid',
        borderColor,
        background: notification.is_read
          ? 'linear-gradient(180deg, rgba(255,255,255,0.94) 0%, rgba(247,248,252,0.92) 100%)'
          : 'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(232,244,255,0.92) 100%)',
        boxShadow: '0 16px 40px rgba(15, 23, 42, 0.08)'
      }}
    >
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Stack spacing={1.5}>
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between" flexWrap="wrap">
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
              {typeof rank === 'number' ? (
                <Chip label={`#${rank}`} size="small" variant="outlined" sx={{ fontWeight: 700 }} />
              ) : null}
              <Chip label={notification.type} color={chipColor} size="small" />
            </Stack>
            <Typography variant="caption" color="text.secondary">
              {formatRelativeTime(notification.created_at)}
            </Typography>
          </Stack>

          <Stack spacing={0.5}>
            <Typography
              variant="h6"
              component="h3"
              sx={{
                fontFamily: '"Space Grotesk", "IBM Plex Sans", sans-serif',
                fontSize: '1rem',
                fontWeight: 700,
                lineHeight: 1.35
              }}
            >
              {notification.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
              {notification.message}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1} flexWrap="wrap" alignItems="center">
            {!notification.is_read ? <Chip label="Unread" size="small" color="warning" variant="outlined" /> : null}
            {showScore && typeof score === 'number' ? <Chip label={`Score ${score}`} size="small" color="secondary" /> : null}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
