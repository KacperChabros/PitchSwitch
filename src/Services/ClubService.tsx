import axios from 'axios';
import { AddClubDto, ClubDto, ClubQueryObject, MinimalClubDto, NewClubDto, UpdateClubDto } from '../Dtos/ClubDto';
import { PaginatedListDto } from '../Dtos/PaginatedListDto';

const clubApiUrl = `${process.env.REACT_APP_PITCH_SWITCH_BACKEND_API_URL}clubs`;

export const getAllClubsAPI = async (clubQueryObject: ClubQueryObject) => {
    const response = await axios.get<PaginatedListDto<ClubDto>>(`${clubApiUrl}/getallclubs`, {
        params: clubQueryObject,
    });
    return response;
};

export const getAllMinimalClubsAPI = async () => {
    const response = await axios.get<MinimalClubDto[]>(`${clubApiUrl}/getallminclubs`);
    return response;
};

export const getClubByIdAPI = async (clubId: number) => {
    const response = await axios.get<ClubDto>(`${clubApiUrl}/getclub/${clubId}`);
    return response;
}

export const archiveClubAPI = async (clubId: number) => {
    const response = await axios.put(`${clubApiUrl}/archiveclub/${clubId}`)
    return response;
}

export const restoreClubAPI = async (clubId: number) => {
    const response = await axios.put<ClubDto>(`${clubApiUrl}/restoreclub/${clubId}`)
    return response;
}

export const updateClubAPI = async (clubId: number, updateClubDto: UpdateClubDto) => {
    const response = await axios.put<ClubDto>(`${clubApiUrl}/updateclub/${clubId}`, updateClubDto,{
        headers: {
            'Content-Type': 'multipart/form-data',
        }});  
    return response;
}

export const addClubAPI = async (addClubDto: AddClubDto) => {
    const response = await axios.post<NewClubDto>(`${clubApiUrl}/addclub`, addClubDto,{
        headers: {
            'Content-Type': 'multipart/form-data',
        }});  
    return response;
}