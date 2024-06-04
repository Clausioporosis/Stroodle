import React from "react";
import { useKeycloak } from "@react-keycloak/web";
import { Navigate, useLocation } from "react-router-dom";

interface PrivateRouteProps {
    children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const { keycloak } = useKeycloak();
    const location = useLocation();

    const isLoggedIn = keycloak.authenticated;
    const loginPath = `/login?redirect=${location.pathname}`;

    return isLoggedIn ? <>{children}</> : <Navigate to={loginPath} replace />;
};

export default PrivateRoute;
