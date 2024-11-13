import axios from 'axios';
import { AddCommentDto, CommentDto, NewCommentDto, UpdateCommentDto } from '../Dtos/Comment';

const commentApiUrl = `${process.env.REACT_APP_PITCH_SWITCH_BACKEND_API_URL}comments`;

export const addCommentAPI = async (addCommentDto: AddCommentDto) => {
    const response = await axios.post<NewCommentDto>(`${commentApiUrl}/addcomment`, addCommentDto);  
    return response;
}

export const updateCommentAPI = async (commentId: number, updateCommentDto: UpdateCommentDto) => {
    const response = await axios.put<CommentDto>(`${commentApiUrl}/updatecomment/${commentId}`, updateCommentDto);  
    return response;
}

export const deleteCommentAPI = async (commentId: number) => {
    const response = await axios.delete(`${commentApiUrl}/deletecomment/${commentId}`);
    return response;
}