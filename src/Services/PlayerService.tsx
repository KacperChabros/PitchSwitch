import axios from 'axios';
import { PlayerDto, PlayerQueryObject } from '../Dtos/PlayerDto';

const playerApiUrl = `${process.env.REACT_APP_PITCH_SWITCH_BACKEND_API_URL}players`;

export const getAllPlayersAPI = async (playerQueryObject: PlayerQueryObject) => {
    const response = await axios.get<PlayerDto[]>(`${playerApiUrl}/getplayers`, {
        params: playerQueryObject,
    });
    return response;
};