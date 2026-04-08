import type { PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export const TanstackQueryProvider = (props: PropsWithChildren) => (
  <QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>
);
