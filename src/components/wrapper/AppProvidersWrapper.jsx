'use client';

import { SessionProvider } from 'next-auth/react';
import { ToastContainer } from 'react-toastify';
import dynamic from 'next/dynamic';
const LayoutProvider = dynamic(() => import('@/context/useLayoutContext').then(mod => mod.LayoutProvider), {
  ssr: false
});
import { NotificationProvider } from '@/context/useNotificationContext';
import { AuthProvider } from '@/context/useAuthContext';

const AppProvidersWrapper = ({
  children
}) => {
  return <SessionProvider>
      <AuthProvider>
        <LayoutProvider>
          <NotificationProvider>
            {children}
            <ToastContainer theme="colored" />
          </NotificationProvider>
        </LayoutProvider>
      </AuthProvider>
    </SessionProvider>;
};
export default AppProvidersWrapper;