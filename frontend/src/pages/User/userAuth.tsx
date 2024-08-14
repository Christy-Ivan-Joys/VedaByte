import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAllowed, setIsAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    const token = Cookies.get('StudentAccessToken');
    if (token) {
      setIsAllowed(true)
    } else {
      setIsAllowed(false)
    }
  },[])

  if (isAllowed === null) {
    return <div>Loading...</div>;
  }
  return isAllowed ? <>{children}</> : <Navigate to="/404"/>
}

export default ProtectedRoute;
