import React, { createContext, useState, useContext, useEffect } from "react";
//import { authProvider } from "../services/authService";
import useAxios from "axios-hooks";

import { API_URL } from "../settings";

const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const LOGIN_URL = API_URL + "/api/auth/login";
  const initialUsername = localStorage.getItem("username") || null;
  const initialToken = localStorage.getItem("token") || null;
  const initialRoles = JSON.parse(localStorage.getItem("roles")) || null;
  const [username, setUsername] = useState(initialUsername);
  const [roles, setUserRoles] = useState(initialRoles);
  const [token, setUserToken] = useState(initialToken);

  const [
    { data: postData, loading: postLoading, error: postError },
    executePut,
  ] = useAxios(
    {
      url: LOGIN_URL,
      method: "Post",
    },
    { manual: true }
  );

  const signIn = async (user_) => {
    await executePut({ data: user_ }).then((data) => {
      setUsername(data.data.username);
      console.log(JSON.stringify(data.data.roles));
      setUserRoles(JSON.stringify(data.data.roles));
      setUserToken(data.data.token);
      localStorage.setItem("username", data.data.username);
      localStorage.setItem("roles", JSON.stringify(data.data.roles));
      localStorage.setItem("token", data.data.token);
      return "Ok";
    });
  };

  const signOut = () => {
    setUsername(null);
    console.log(isLoggedIn(), "isLoggedIn");
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("roles");
  };

  function isLoggedIn() {
    console.log(username, "username");
    return username != null;
  }

  function isLoggedInAs(role) {
    const roles = JSON.parse(localStorage.getItem("roles") || "[]");
    return roles?.some((r) => role.includes(r)) || false;
  }

  const value = {
    username,
    isLoggedIn,
    isLoggedInAs,
    signIn,
    signOut,
    roles,
    token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
