'use client';

import React from 'react';
import AppMenu from './components/AppMenu';
import { getMenuItems } from '@/helpers/Manu';
import SimplebarReactClient from '@/components/wrapper/SimplebarReactClient';
import LogoBox from '@/components/wrapper/LogoBox';
import { useAuthContext } from '@/context/useAuthContext';

const page = () => {
  const { role } = useAuthContext();
  const menuItems = getMenuItems(role);
  
  return <div className="app-sidebar">
      <LogoBox />
      <SimplebarReactClient className="scrollbar" data-simplebar>
        <AppMenu menuItems={menuItems} />
      </SimplebarReactClient>
    </div>;
};
export default page;