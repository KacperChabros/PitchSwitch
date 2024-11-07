import React from 'react'
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../Context/useAuth';

type Props = {children: React.ReactNode}

const PublicRoute = ({children}: Props) => {
    const location = useLocation();
    const { isLoggedIn } = useAuth();

    return (isLoggedIn() ? (
        <Navigate to="/home" state={{from: location}} replace/>
    ) : (
        <>{children}</>
    ));
}

export default PublicRoute