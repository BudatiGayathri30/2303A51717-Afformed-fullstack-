import { useEffect } from 'react';
import { Alert, Box, Button, Paper, Stack, Typography } from '@mui/material';
import { logger } from '../shared/logger/logger';

interface NetworkErrorProps {
  title?: string;
  message: string;
  onRetry: () => void;
  error?: Error | null;
}

export function NetworkError({ title = 'Request failed', message, onRetry, error }: NetworkErrorProps) {
  useEffect(() => {
    logger.info('component', 'NetworkError mounted');

    if (error) {
      logger.error('component', error.message);
    }
  }, [error]);

  return (
    <Paper
      elevation={0}
      sx={{
        border: '1px solid',
        borderColor: 'error.light',
        borderRadius: 4,
        p: 3,
        background: 'linear-gradient(180deg, rgba(211,47,47,0.08) 0%, rgba(255,255,255,0.92) 100%)'
      }}
    >
      <Stack spacing={1.5}>
        <Alert severity="error" variant="outlined" sx={{ borderRadius: 3 }}>
          <Typography variant="h6" component="div" sx={{ fontFamily: '"Space Grotesk", "IBM Plex Sans", sans-serif' }}>
            {title}
          </Typography>
        </Alert>
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
        <Box>
          <Button variant="contained" color="error" onClick={onRetry} sx={{ borderRadius: 999, px: 3 }}>
            Retry
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
}
