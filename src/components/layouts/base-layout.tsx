import { Outlet } from 'react-router-dom';

import { Sidebar } from './sidebar';

export function BaseLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto pt-16 pb-8 lg:pt-0">
        <div className="px-4 py-6 sm:px-6 md:px-8 md:py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
