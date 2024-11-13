import { MinimalCommentDto } from "./Comment";
import { MinimalTransferDto } from "./TransferDto";
import { MinimalTransferRumourDto } from "./TransferRumourDto";
import { MinimalUserDto } from "./UserDto";

export type PostDto = {
    postId: number;
    title: string;
    content: string;
    imageUrl?: string;
    createdOn: Date;
    isEdited: boolean;
    createdByUser: MinimalUserDto;
    transfer?: MinimalTransferDto;
    transferRumour?: MinimalTransferRumourDto;
    comments: MinimalCommentDto[];
}

export type ListElementPostDto = {
    postId: number;
    title: string;
    content: string;
    imageUrl?: string;
    createdOn: Date;
    isEdited: boolean;
    createdByUser: MinimalUserDto;
    transfer?: MinimalTransferDto;
    transferRumour?: MinimalTransferRumourDto;
}

export type NewPostDto = {
    postId: number;
    title: string;
    content: string;
    imageUrl?: string;
    createdOn: Date;
    isEdited: boolean;
    createdByUser: MinimalUserDto;
    transfer?: MinimalTransferDto;
    transferRumour?: MinimalTransferRumourDto;
}

export type MinimalPostDto = {
    postId: number;
    title: string;
    createdByUser: MinimalUserDto;
}

export type AddPostDto = {
    title: string;
    content: string;
    image?: File;
    transferId?: number | null;
    transferRumourId?: number | null;
}

export type UpdatePostDto = {
    title?: string;
    content?: string;
    image?: File;
    isImageDeleted: boolean;
    transferId?: number | null;
    isTransferDeleted: boolean;
    transferRumourId?: number | null;
    isTransferRumourDeleted: boolean;
}

export type PostQueryObject = {
    title?: string;
    content?: string;
    createdOn?: Date;
    createdOnComparison: string;
    createdByUserId?: string
    transferId?: number;
    filterForEmptyTransferIfEmpty: boolean;
    transferRumourId?: number;
    filterForEmptyTransferRumourIfEmpty: boolean;
    sortBy?: string;
    isDescending?: boolean;
    pageNumber?: number;
    pageSize?: number;
}