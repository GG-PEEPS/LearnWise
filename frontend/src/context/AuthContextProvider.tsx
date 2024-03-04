import React, { useEffect, useMemo, useState, createContext } from 'react'
import PropTypes from "prop-types";
import axios from "axios";

import getCommonOptions from '../helpers/getCommonOptions';

export type AuthContextType = {
    isAuthenticated: boolean | null,
    setIsAuthenticated: (value: boolean) => void,
    user: any,
    setUser: (value: any) => void
}

export const AuthContext = createContext({
    isAuthenticated: null,
    setIsAuthenticated: () => { },
    user: null,
    setUser: () => { }
})

export default function AuthContextProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [user, setUser] = useState(null);

    const loadAuthUser = () => {
        const authToken = localStorage.getItem("authToken");
        if (!authToken) {
            setIsAuthenticated(false);
            return;
        }
        axios.get(import.meta.env.VITE_BACKEND_URL+"/api/auth/users/me/", getCommonOptions())
            .then((res) => {
                console.log('[AuthContextProvider] loadAuthUser res:', res);
                setUser(res.data);
                setIsAuthenticated(true);
            }).catch(() => {
                setIsAuthenticated(false);
            })
    }

    const providerValue = useMemo(() => {
        return {
            isAuthenticated,
            setIsAuthenticated,
            user,
            setUser
        }
    }, [isAuthenticated, setIsAuthenticated, user, setUser])

    useEffect(() => {
        if (!user && (isAuthenticated === null || isAuthenticated === true)) {
            loadAuthUser();
        }
    }, [user, isAuthenticated]);

    return (
        <AuthContext.Provider value={providerValue}>
            {children}
        </AuthContext.Provider>
    );
}

AuthContextProvider.propTypes = {
    children: PropTypes.node
}