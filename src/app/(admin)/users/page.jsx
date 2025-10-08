'use client';

import React from 'react';
import UsersList from './components/UsersList';
import RoleGuard from '@/components/RoleGuard';

const UsersPage = () => {
  return (
    <RoleGuard requiredRoles={['admin', 'superadmin']}>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
              <h4 className="mb-sm-0">Users Management</h4>
              <div className="page-title-right">
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item">
                    <a href="/dashboards">Dashboard</a>
                  </li>
                  <li className="breadcrumb-item active">Users</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
        <UsersList />
      </div>
    </RoleGuard>
  );
};

export default UsersPage;
