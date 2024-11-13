import { MinimalPostDto } from "./PostDto";
import { MinimalUserDto } from "./UserDto";

export type CommentDto = {
    commentId: number;
    content: string;
    createdOn: Date;
    isEdited: boolean;
    createdByUser: MinimalUserDto;
    post: MinimalPostDto;
}

export type NewCommentDto = {
    commentId: number;
    content: string;
    createdOn: Date;
    isEdited: boolean;
    createdByUser: MinimalUserDto;
    post: MinimalPostDto;
}

export type MinimalCommentDto = {
    commentId: number;
    content: string;
    createdOn: Date;
    isEdited: boolean;
    createdByUser: MinimalUserDto;
}

export type AddCommentDto = {
    content: string;
    postId: number;
}

export type UpdateCommentDto = {
    content?: string;
}

export type CommentQueryObject = {
    content?: string;
    createdOn?: Date;
    createdOnComparison: string;
    postId?: number;
    sortBy?: string;
    isDescending?: boolean;
    pageNumber?: number;
    pageSize?: number;
}