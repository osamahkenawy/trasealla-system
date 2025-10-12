'use client';

import { SessionProvider } from 'next-auth/react';
import { ToastContainer } from 'react-toastify';
import dynamic from 'next/dynamic';
const LayoutProvider = dynamic(() => import('@/context/useLayoutContext').then(mod => mod.LayoutProvider), {
  ssr: false
});
import { NotificationProvider } from '@/context/useNotificationContext';
import { AuthProvider } from '@/context/useAuthContext';
import { FlightProvider } from '@/context/useFlightContext';

const AppProvidersWrapper = ({
  children
}) => {
  return <SessionProvider>
      <AuthProvider>
        <LayoutProvider>
          <NotificationProvider>
            <FlightProvider>
              {children}
              <ToastContainer theme="colored" />
            </FlightProvider>
          </NotificationProvider>
        </LayoutProvider>
      </AuthProvider>
    </SessionProvider>;
};
export default AppProvidersWrapper;