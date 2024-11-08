import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ChannelProvider } from '@/contexts/ChannelContext';
import AppRoutes from '@routes/index';
import { queryClient } from '@/config/queryClient';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <ChannelProvider>
          <AppRoutes />
        </ChannelProvider>
      </Router>
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
