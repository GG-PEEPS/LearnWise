import React, { useEffect, useMemo, useState, createContext } from 'react'
import PropTypes from "prop-types";
import axios from "axios";

import getCommonOptions from '../helpers/getCommonOptions';

export type GlobalUserType={
    email: string,
    id:number,
    phone: string,
    role: string,
    username: string
}

export type AuthContextType = {
    isAuthenticated: boolean | null,
    setIsAuthenticated: (value: boolean) => void,
    user: null | GlobalUserType,
    setUser: (value: GlobalUserType | null) => void
}

export const AuthContext = createContext<AuthContextType>({
    isAuthenticated: null,
    setIsAuthenticated: () => { },
    user: null,
    setUser: () => { }
})

export default function AuthContextProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [user, setUser] = useState<GlobalUserType | null>(null);

    const loadAuthUser = () => {
        const authToken = localStorage.getItem("authToken");
        if (!authToken) {
            setIsAuthenticated(false);
            return;
        }
        axios.get(import.meta.env.VITE_BACKEND_URL+"/api/auth/users/me/", getCommonOptions())
            .then((res) => {
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