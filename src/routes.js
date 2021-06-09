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
import Products from './views/Products/Products';

const routes = user => [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: 'login', element: user ? <Navigate to='/dashboard' /> : <LoginView /> },
      { path: '404', element: <h1>Not found view</h1> },
      { path: '/', element: user ? <Navigate to='/dashboard' /> : <Navigate to='/login' /> }
    ]
  },
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      { path: '/', element: user ? <DashboardTransactions /> : <Navigate to='/login' /> },
    ]
  },
  {
    path: '/operation-transactions',
    element: <DashboardLayout />,
    children: [
      { path: '/inwards', element: user ? <Inbound /> : <Navigate to='/login' /> },
      { path: '/orders', element: user ? <Outbound /> : <Navigate to='/login' /> },
    ]
  },
  {
    path: '/profile',
    element: <DashboardLayout />,
    children: [
      { path: '/', element: user ? <Profile /> : <Navigate to='/login' /> },
      { path: '/security', element: user ? <Security /> : <Navigate to='/login' /> },
    ]
  },
  {
    path: '/products',
    element: <DashboardLayout />,
    children: [
      { path: '/', element: user ? <Products /> : <Navigate to='/login' /> }
    ]
  }
];

export default routes;
