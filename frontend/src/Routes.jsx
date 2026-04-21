import React, { useEffect } from "react";
import {useNavigate, useRoutes, useLocation} from 'react-router-dom' ;

// Pages List
import Dashboard from "./components/dashboard/Dashboard" ;
import Profile from "./components/user/Profile" ;
import Login from "./components/auth/Login" ;
import Signup from "./components/auth/Signup" ;

// Auth Context
import { useAuth } from "./AuthContext";


const ProjectRoutes = () => {
    const {currentUser, setCurrentUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect( () => {
        const userIdFromStorage = localStorage.getItem("userId");
        const path = location.pathname;

        if(userIdFromStorage && !currentUser){
            setCurrentUser(userIdFromStorage);
        }

        if(!userIdFromStorage && !["/auth" , "/signup"].includes(path) ){
            navigate("/auth");
        }

        if(userIdFromStorage && ["/auth", "/signup"].includes(path) ){
            navigate("/");
        }

    }, [currentUser, navigate, setCurrentUser, location.pathname]);

    let element = useRoutes( [
        {
            path: "/" ,
            element: <Dashboard />
        },
        {
            path: "/auth" ,
            element: <Login />
        },
        {
            path: "/signup" ,
            element: <Signup />
        },
        {
            path: "/profile" ,
            element: <Profile />
        },
    ]);

    return element;

};

export default ProjectRoutes;