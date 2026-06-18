import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { logger } from './shared/logger/logger';
import { NotificationsPage } from './pages/NotificationsPage';
import { PriorityInboxPage } from './pages/PriorityInboxPage';

export function App() {
  useEffect(() => {
    logger.info('component', 'App mounted');
  }, []);

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<NotificationsPage />} />
        <Route path="/priority" element={<PriorityInboxPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
