import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom'
import { useAuth } from '../../providers/AuthProvider';
import queryString from 'query-string';

export const SpotifyRedirect = () => {
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    //const queryParams = new URLSearchParams(location.search);
     const queryParams = queryString.parse(location.search);
    const userId = user?.id; 
    const newQueryParams = {
      ...queryParams,
      userId: userId
    };
    const queryStringified = queryString.stringify(newQueryParams);
    const backendUrl = `/api/auth/spotify/callback?${queryStringified}`;
    // Redirect to backend
    window.location.href = backendUrl;
  }, [location]);

  return <>Redirecting...</>;
};
