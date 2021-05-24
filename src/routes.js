import React from 'react';
import { Navigate } from 'react-router-dom';

const routes = (user) => [
  {
    path: '/',
    element: user ? <h1> Main Layout </h1> : <h1>Not Login</h1>,
    children: [
      { path: 'login', element: <h1>Login View</h1> },
      { path: '404', element: <h1>Not found view</h1> },
      { path: '/', element: user ? <Navigate to='/administration' /> : <Navigate to='/login' /> }
    ]
  },
];

export default routes;
