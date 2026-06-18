import { useEffect } from 'react';
import { Box, Paper, Stack, Typography } from '@mui/material';
import { logger } from '../shared/logger/logger';

interface EmptyStateProps {
  title: string;
  message: string;
  icon: React.ReactNode;
}

export function EmptyState({ title, message, icon }: EmptyStateProps) {
  useEffect(() => {
    logger.info('component', 'EmptyState mounted');
  }, []);

  return (
    <Paper
      elevation={0}
      sx={{
        border: '1px dashed',
        borderColor: 'divider',
        borderRadius: 4,
        p: 4,
        backgroundColor: 'rgba(255,255,255,0.72)'
      }}
    >
      <Stack spacing={2} alignItems="center" textAlign="center">
        <Box sx={{ color: 'primary.main', display: 'grid', placeItems: 'center' }}>{icon}</Box>
        <Typography variant="h6" component="div" sx={{ fontFamily: '"Space Grotesk", "IBM Plex Sans", sans-serif' }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 420 }}>
          {message}
        </Typography>
      </Stack>
    </Paper>
  );
}
