import axios from 'axios';
import { AddPostDto, ListElementPostDto, NewPostDto, PostDto, PostQueryObject, UpdatePostDto } from '../Dtos/PostDto';
import { PaginatedListDto } from '../Dtos/PaginatedListDto';

const postApiUrl = `${process.env.REACT_APP_PITCH_SWITCH_BACKEND_API_URL}posts`;

export const getAllPostsAPI = async (postQueryObject: PostQueryObject) => {
    const response = await axios.get<PaginatedListDto<ListElementPostDto>>(`${postApiUrl}/getallposts`, {
        params: postQueryObject,
    });
    return response;
};

export const addPostAPI = async (addPostDto: AddPostDto) => {
    const response = await axios.post<NewPostDto>(`${postApiUrl}/addpost`, addPostDto,{
        headers: {
            'Content-Type': 'multipart/form-data',
        }});  
    return response;
}

export const getPostByIdAPI = async (postId: number) => {
    const response = await axios.get<PostDto>(`${postApiUrl}/getpost/${postId}`);
    return response;
}

export const updatePostAPI = async (postId: number, updatePostDto: UpdatePostDto) => {
    const response = await axios.put<PostDto>(`${postApiUrl}/updatepost/${postId}`, updatePostDto,{
        headers: {
            'Content-Type': 'multipart/form-data',
        }});  
    return response;
}

export const deletePostAPI = async (postId: number) => {
    const response = await axios.delete(`${postApiUrl}/deletepost/${postId}`);
    return response;
}