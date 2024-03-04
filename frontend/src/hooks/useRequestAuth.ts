import { useSnackbar } from "notistack";
import { useCallback, useContext, useState } from "react";
import formatHttpApiError from "../helpers/formatHttpAPIError.js";
import axios from "axios";
import getCommonOptions from "../helpers/getCommonOptions.js";
import { AuthContext } from "../context/AuthContextProvider.js";


export default function useRequestAuth() {
    const [loading, setLoading] = useState<boolean>(false)
    const [logoutPending, setLogoutPending] = useState<boolean>(false)
    const {setIsAuthenticated,setUser}=useContext(AuthContext)
    const { enqueueSnackbar } = useSnackbar()

    const handleError = useCallback((err) => {
        const formattedError = formatHttpApiError(err);
        enqueueSnackbar(formattedError,{variant:"error"})
        setLoading(false);
    }, [enqueueSnackbar, setLoading])

    const login = useCallback(({ username, password }:{
        username: string,
        password: string
    }, successCallback: () => void) => {
        setLoading(true)
        axios.post(import.meta.env.VITE_BACKEND_URL+"/api/auth/token/login/", { username, password })
            .then((res) => {
                const { auth_token } = res.data
                localStorage.setItem('authToken', auth_token)
                setLoading(false)
                setIsAuthenticated(true)
                if (successCallback) {
                    successCallback();
                }
            }).catch(handleError)
    }, [setLoading, handleError,setIsAuthenticated])

    const register = useCallback(({ username, email, password }:{
        username: string,
        email: string,
        password: string
    }, successCallback: () => void) => {
        setLoading(true)
        axios.post(import.meta.env.VITE_BACKEND_URL+"/api/auth/users/", {
            username,
            password,
            email
        })
            .then(() => {
                enqueueSnackbar("Successfully Signed Up")
                setLoading(false)
                if (successCallback) {
                    successCallback()
                }
            }).catch(handleError)
    }, [enqueueSnackbar, setLoading, handleError])

    const logout = useCallback(() => {
        setLogoutPending(true);
        axios
          .post(import.meta.env.VITE_BACKEND_URL+"/api/auth/token/logout/",null, getCommonOptions())
          .then(() => {
            localStorage.removeItem("authToken");
            setLogoutPending(false);
            setIsAuthenticated(false);
            setUser(null)
          })
          .catch((err) => {
            setLogoutPending(false);
            handleError(err);
          });
      }, [handleError, setLogoutPending, setIsAuthenticated,setUser]);

    return {
        loading,
        login,
        register,
        logout,
        logoutPending
    }

}