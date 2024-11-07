import axios from 'axios';
import { RegisterUserDto, NewUserDto } from '../Dtos/UserDto';

const accountApiUrl = `${process.env.REACT_APP_PITCH_SWITCH_BACKEND_API_URL}account`;

export const loginAPI = async (username: string, password: string) => {
    const response = await axios.post<NewUserDto>(`${accountApiUrl}/login`, {
        username: username,
        password: password
    });   
    return response;
};

export const registerAPI = async (username: string, email: string, password: string, firstName: string, lastName: string, bio?: string | null, profilePicture?: File | null) => {
    const registerUserDto: RegisterUserDto = {
        userName: username,
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
        bio: bio,
        profilePicture: profilePicture
    };
    const response = await axios.post<NewUserDto>(`${accountApiUrl}/register`, registerUserDto,{
        headers: {
            'Content-Type': 'multipart/form-data',
        }});   
    return response;
};