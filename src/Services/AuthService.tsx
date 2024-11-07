import axios from 'axios';
import { RegisterUserDto, NewUserDto } from '../Dtos/UserDto';

const backendApiUrl = process.env.REACT_APP_PITCH_SWITCH_BACKEND_URL;

export const loginAPI = async (username: string, password: string) => {
    const response = await axios.post<NewUserDto>(`${backendApiUrl}account/login`, {
        username: username,
        password: password
    });   
    return response;
};

export const registerAPI = async (username: string, email: string, password: string, firstName: string, lastName: string, profilePictureUrl?: string | null, bio?: string | null) => {
    const registerUserDto: RegisterUserDto = {
        userName: username,
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
        profilePictureUrl: profilePictureUrl,
        bio: bio
    };
    const response = await axios.post<NewUserDto>(`${backendApiUrl}account/register`, registerUserDto);   
    return response;
};