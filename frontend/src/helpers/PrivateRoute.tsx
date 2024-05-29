import React from "react";
import { useKeycloak } from "@react-keycloak/web";

interface PrivateRouteProps {
    children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const { keycloak } = useKeycloak();
    const isLoggedIn = keycloak.authenticated;

    return isLoggedIn ? <>{children}</> : null;
};

export default PrivateRoute;
