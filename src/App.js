import React, { useEffect, useState } from 'react';
import { useNavigate, useRoutes, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';
import GlobalStyles from '../src/Components/GlobalStyles';
import theme from '../src/theme';
import routes from '../src/routes';
import { getUser, setUser, getURL, SharedContext, getUserToken } from './Utils/common';
import { setRequestInterceptor, setResponseInterceptor, ejectRequestInterceptor, ejectResponseInterceptor } from './Utils/interceptors';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [authToken, setAuthToken] = useState(getUserToken());
  const [currentUser, setCurrentUser] = useState(null);
  const routing = useRoutes(routes(currentUser));

  const updateInterceptors = () => {
    const requestInterceptor = setRequestInterceptor(() => {
      setIsLoading(true);
    });
    const responseInterceptor = setResponseInterceptor(data => {
      setIsLoading(false);
      return data;
    }, error => {
      setIsLoading(false);
      if (error.response && error.response.status == 401) {
        if (location.pathname.split('/').pop() != 'login') {
          navigate('/login');
        }
      }
      return Promise.reject(error)
    });
    return { requestInterceptor, responseInterceptor };
  };
  updateInterceptors();

  useEffect(async () => {
    const { requestInterceptor, responseInterceptor } = await updateInterceptors();
    return async () => {
      await ejectRequestInterceptor(requestInterceptor || 0);
      await ejectResponseInterceptor(responseInterceptor || 0);
    };
  }, [authToken]);


  return (
    <ThemeProvider theme={theme}>
      <SharedContext.Provider value={{ isLoading, authToken, currentUser, setAuthToken, setCurrentUser }}>
        <GlobalStyles />
        {routing}
      </SharedContext.Provider>
    </ThemeProvider>
  );
}

export default App;
