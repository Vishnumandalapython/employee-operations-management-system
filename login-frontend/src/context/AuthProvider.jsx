import { useState } from "react";
import AuthContext from "./AuthContext";

import {
    loginUser,
    getUser,
    logoutUser
} from "../services/authService";

function AuthProvider({ children }) {

    const [user, setUser] = useState(getUser());

    const login = (userData) => {
        loginUser(userData);
        setUser(userData);
    };

    const logout = () => {
        logoutUser();
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;