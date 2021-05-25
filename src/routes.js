import React from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from './Layouts/DashboardLayout/DashboardLayout';
import MainLayout from './Layouts/MainLayout/MainLayout';
import LoginView from './Views/Auth/LoginView';
import DashboardTransactions from './Views/DashboardTransactions/DashboardTransactions';

const routes = (user) => [
  {
    path: '/',
    element:  <MainLayout/>,
    children: [
      { path: 'login', element: <LoginView/> },
      { path: '404', element: <h1>Not found view</h1> },
      { path: '/', element: user ? <Navigate to='/administration' /> : <Navigate to='/login' /> }
    ]
  },
  {
    path: '/dashboard',
    element:  <DashboardLayout/>,
    children: [
      { path: '/', element: !user ? <DashboardTransactions/> : <Navigate to='/login' /> },
    ]
  },
  {
    path: '/operation-transactions',
    element:  <DashboardLayout/>,
    children: [
      { path: '/inbound-transactions', element: !user ? <h1>Welcome to dashboard</h1> : <Navigate to='/login' /> },
      { path: '/outbound-transactions', element: !user ? <h1>Welcome to dashboard</h1> : <Navigate to='/login' /> }
    ]
  },
];

export default routes;
