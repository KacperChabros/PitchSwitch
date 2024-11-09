import axios from 'axios';
import { ClubDto, ClubQueryObject } from '../Dtos/ClubDto';

const clubApiUrl = `${process.env.REACT_APP_PITCH_SWITCH_BACKEND_API_URL}clubs`;

export const getAllClubsAPI = async (clubQueryObject: ClubQueryObject) => {
    const response = await axios.get<ClubDto[]>(`${clubApiUrl}/getallclubs`, {
        params: clubQueryObject,
    });
    return response;
};