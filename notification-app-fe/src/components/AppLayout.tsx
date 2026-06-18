import { useEffect } from 'react';
import { AppBar, Box, Container, Toolbar, Typography, Button, Stack } from '@mui/material';
import { NavLink, Outlet } from 'react-router-dom';
import { logger } from '../shared/logger/logger';

const navigationItems = [
  { label: 'Notifications', path: '/' },
  { label: 'Priority Inbox', path: '/priority' }
];

export function AppLayout() {
  useEffect(() => {
    logger.info('component', 'AppLayout mounted');
  }, []);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at top left, rgba(14, 165, 233, 0.16), transparent 30%), radial-gradient(circle at top right, rgba(249, 115, 22, 0.14), transparent 28%), linear-gradient(180deg, #f5f8ff 0%, #eef3fb 50%, #f7f9fd 100%)'
      }}
    >
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: 'rgba(8, 15, 34, 0.86)',
          backdropFilter: 'blur(14px)',
          borderBottom: '1px solid rgba(255,255,255,0.08)'
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
          <Stack spacing={0.25}>
            <Typography variant="h6" component="div" sx={{ fontFamily: '"Space Grotesk", "IBM Plex Sans", sans-serif', fontWeight: 700 }}>
              Notification Hub
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.72)' }}>
              Unified inbox and priority view
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1} flexWrap="wrap">
            {navigationItems.map((item) => (
              <Button
                key={item.path}
                component={NavLink}
                to={item.path}
                end={item.path === '/'}
                sx={{
                  borderRadius: 999,
                  px: 2,
                  color: '#fff',
                  border: '1px solid',
                  borderColor: 'rgba(255,255,255,0.16)',
                  backgroundColor: 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.18)'
                  },
                  '&.active': {
                    borderColor: 'rgba(255,255,255,0.45)',
                    backgroundColor: 'rgba(255,255,255,0.14)'
                  }
                }}
              >
                {item.label}
              </Button>
            ))}
          </Stack>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 4 } }}>
        <Outlet />
      </Container>
    </Box>
  );
}
