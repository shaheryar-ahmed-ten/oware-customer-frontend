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
import ForgotPassword from './views/Auth/ForgotPassword';
import ChangePassword from './views/Auth/ChangePassword';
import { checkPermission } from './utils/auth';
import {
  CP_DASHBOARD_FULL,
  CP_INWARD_FULL,
  CP_ORDER_FULL,
  CP_PRODUCT_FULL,
} from './PermissionConstants';
import Logistics from './views/Logistics/Logistic';
import AddProductInwardView from './views/Operations/Inbound/AddInbound';
import AddProductOutwardView from './views/Operations/Outbound/AddOutbound';

const routes = user => [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: 'login', element: <LoginView /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
      { path: 'forgot-password/change-password/:id/:otp', element: <ChangePassword /> },
      { path: '404', element: <h1>Not found view</h1> },
      { path: '/', element: user ? <Navigate to='/dashboard' /> : <Navigate to='/login' /> }
    ]
  },
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      { path: '/', element: checkPermission(user, CP_DASHBOARD_FULL) ? <DashboardTransactions /> : <Navigate to='/login' /> },
    ]
  },
  {
    path: '/operation-transactions',
    element: <DashboardLayout />,
    children: [
      { path: '/inwards', element: checkPermission(user, CP_INWARD_FULL) ? <Inbound /> : <Navigate to='/login' /> },
      { path: '/orders', element: checkPermission(user, CP_ORDER_FULL) ? <Outbound /> : <Navigate to='/login' /> },
    ]
  },
  {
    path: '/profile',
    element: <DashboardLayout />,
    children: [
      { path: '/', element: checkPermission(user, CP_DASHBOARD_FULL) ? <Profile /> : <Navigate to='/login' /> },
      { path: '/security', element: checkPermission(user, CP_DASHBOARD_FULL) ? <Security /> : <Navigate to='/login' /> },
    ]
  },
  {
    path: '/products',
    element: <DashboardLayout />,
    children: [
      { path: '/', element: checkPermission(user, CP_PRODUCT_FULL) ? <Products /> : <Navigate to='/login' /> }
    ]
  },
  {
    path: '/inward/add',
    element: <DashboardLayout />,
    children: [
      { path: '/', element: checkPermission(user, CP_PRODUCT_FULL) ? <AddProductInwardView /> : <Navigate to='/login' /> }
    ]
  },
  {
    path: '/outward/add',
    element: <DashboardLayout />,
    children: [
      { path: '/', element: checkPermission(user, CP_PRODUCT_FULL) ? <AddProductOutwardView /> : <Navigate to='/login' /> }
    ]
  },
  {
    path: '/logistics',
    element: <DashboardLayout />,
    children: [
      { path: '/', element: checkPermission(user, CP_DASHBOARD_FULL) ? <Logistics /> : <Navigate to='/login' /> }
    ]
  }
];

export default routes;
