import React, { useEffect, useState } from "react";
import { User } from "../Models/User"
import { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { loginAPI, registerAPI } from "../Services/AuthService";
import axios from 'axios';
import { NewUserDto, RegisterUserDto } from "../Dtos/UserDto";
import {jwtDecode} from 'jwt-decode';


type UserContextType = {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    loginUser: (username: string, password: string) => Promise<void>
    registerUser: (username: string, email: string, password: string, firstName: string, lastName: string, bio?: string | null, profilePicture?: File | null) => Promise<void>
    logoutUser: () => void;
    isLoggedIn: () => boolean;
    IsAdmin: () => boolean;
}

interface BackendToken {
    nameId: string;
    email: string;
    given_name: string;
    name: string;
    family_name: string;
    role: string;
    nbf: number;
    exp: number;
    iat: number;
    iss: string;
    aud: string;
}

type Props = { children: React.ReactNode };

export const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider = ({ children }: Props) => {
    const navigate = useNavigate();
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isReady, setIsReady] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() =>{
        const user = localStorage.getItem("user");
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");
        if(user && accessToken && refreshToken){
            setUser(JSON.parse(user));
            setAccessToken(accessToken);
            setRefreshToken(refreshToken);
            axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
            const decodedToken = jwtDecode<BackendToken>(accessToken.replace('Bearer',''));
            setIsAdmin(decodedToken.role === "Admin" ? true : false);
        }
        setIsReady(true);
    }, [accessToken]);

    const loginUser = async (username: string, password: string) => {
        await loginAPI(username, password)
        .then((res) => {
            if(res){
                const userDto: NewUserDto = res?.data;
                localStorage.setItem("accessToken", userDto.tokens?.accessToken);
                localStorage.setItem("refreshToken", userDto.tokens?.refreshToken);
                const userObj: User = {
                    userId: userDto.userId,
                    userName: userDto.userName,
                    email: userDto.email,
                    firstName: userDto.firstName,
                    lastName: userDto.lastName,
                    profilePictureUrl: userDto.profilePictureUrl,
                    bio: userDto.bio
                };
                localStorage.setItem("user", JSON.stringify(userObj));
                setUser(userObj!);
                setAccessToken(userDto.tokens?.accessToken!);
                setRefreshToken(userDto.tokens?.refreshToken!);

                return Promise.resolve();
            }
        })
        .catch( (e)=> {return Promise.reject(e)}
        );
    };

    const registerUser = async (username: string, email: string, password: string, firstName: string, lastName: string, bio?: string | null, profilePicture?: File | null) => {
        await registerAPI(username, email, password, firstName, lastName, bio, profilePicture)
        .then((res) => {
            if(res){
                const userDto: NewUserDto = res?.data;
                localStorage.setItem("accessToken", res?.data.tokens?.accessToken);
                localStorage.setItem("refreshToken", res?.data.tokens?.refreshToken);
                const userObj: User = {
                    userId: res?.data.userId,
                    userName: res?.data.userName,
                    email: res?.data.email,
                    firstName: res?.data.firstName,
                    lastName: res?.data.lastName,
                    profilePictureUrl: res?.data.profilePictureUrl,
                    bio: res?.data.bio
                };
                localStorage.setItem("user", JSON.stringify(userObj));
                setUser(userObj!);
                setAccessToken(res?.data.tokens?.accessToken!);
                setRefreshToken(res?.data.tokens?.refreshToken!);

                return Promise.resolve(res);
            }
        })
        .catch( (e)=> {return Promise.reject(e)}
        );
    };

    const isLoggedIn = () => {
        return !!user;
    }

    const logoutUser = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        setUser(null);
        setAccessToken(null);
        setRefreshToken(null);
        navigate("/");
    }

    const IsAdmin = () => {
        return isAdmin;
    }

    return (
        <UserContext.Provider value={{user, accessToken, refreshToken, loginUser, registerUser, logoutUser, isLoggedIn, IsAdmin}}>
             {isReady ? children : null}
        </UserContext.Provider>
    );
};

export const useAuth = () => React.useContext(UserContext);