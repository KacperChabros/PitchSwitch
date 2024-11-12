import axios from 'axios';
import { AddPlayerDto, MinimalPlayerDto, NewPlayerDto, PlayerDto, PlayerQueryObject, UpdatePlayerDto } from '../Dtos/PlayerDto';
import { PaginatedListDto } from '../Dtos/PaginatedListDto';

const playerApiUrl = `${process.env.REACT_APP_PITCH_SWITCH_BACKEND_API_URL}players`;

export const getAllPlayersAPI = async (playerQueryObject: PlayerQueryObject) => {
    const response = await axios.get<PaginatedListDto<PlayerDto>>(`${playerApiUrl}/getplayers`, {
        params: playerQueryObject,
    });
    return response;
};

export const getAllMinimalPlayersAPI = async () => {
    const response = await axios.get<MinimalPlayerDto[]>(`${playerApiUrl}/getallminplayers`);
    return response;
};

export const addPlayerAPI = async (addPlayerDto: AddPlayerDto) => {
    const response = await axios.post<NewPlayerDto>(`${playerApiUrl}/addplayer`, addPlayerDto,{
        headers: {
            'Content-Type': 'multipart/form-data',
        }});  
    return response;
}

export const getPlayerByIdAPI = async (playerId: number) => {
    const response = await axios.get<PlayerDto>(`${playerApiUrl}/getplayer/${playerId}`);
    return response;
}

export const updatePlayerAPI = async (playerId: number, updatePlayerDto: UpdatePlayerDto) => {
    const response = await axios.put<PlayerDto>(`${playerApiUrl}/updateplayer/${playerId}`, updatePlayerDto,{
        headers: {
            'Content-Type': 'multipart/form-data',
        }});  
    return response;
}

export const deletePlayerAPI = async (playerId: number) => {
    const response = await axios.delete(`${playerApiUrl}/deleteplayer/${playerId}`);
    return response;
}