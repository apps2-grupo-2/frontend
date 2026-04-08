import { Outlet } from 'react-router-dom';

import { Sidebar } from './sidebar';

export function BaseLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 pt-16 pb-8 lg:overflow-auto lg:pt-0">
        <div className="mx-auto max-w-5xl px-3 py-4 sm:px-4 sm:py-6 md:px-6 md:py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
