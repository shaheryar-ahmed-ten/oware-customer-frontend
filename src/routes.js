import React from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout/DashboardLayout';
import MainLayout from './layouts/MainLayout/MainLayout';
import LoginView from './views/Auth/LoginView';
import DashboardTransactions from './views/DashboardTransactions/DashboardTransactions';
import Inbound from './views/Operations/Inbound/Inbound';
import Outbound from './views/Operations/Outbound/Outbound';
import Profile from './views/User/Profile/Profile';
import Security from './views/User/Security/Security';

const routes = (user) => [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: 'login', element: <LoginView /> },
      { path: '404', element: <h1>Not found view</h1> },
      { path: '/', element: user ? <Navigate to='/administration' /> : <Navigate to='/login' /> }
    ]
  },
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      { path: '/', element: (true || !user) ? <DashboardTransactions /> : <Navigate to='/login' /> },
    ]
  },
  {
    path: '/operation-transactions',
    element: <DashboardLayout />,
    children: [
      { path: '/inwards', element: (true || !user) ? <Inbound /> : <Navigate to='/login' /> },
      { path: '/orders', element: (true || !user) ? <Outbound /> : <Navigate to='/login' /> },
    ]
  },
  {
    path: '/profile',
    element: <DashboardLayout />,
    children: [
      { path: '/', element: (true || !user) ? <Profile /> : <Navigate to='/login' /> },
      { path: '/security', element: (true || !user) ? <Security /> : <Navigate to='/login' /> },
    ]
  },
];

export default routes;
