import { MinimalClubDto } from "./ClubDto";

export type PlayerDto = {
    playerId: number;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    nationality: string;
    position: string;
    height: number;
    weight: number;
    preferredFoot: Foot;
    marketValue: number;
    photoUrl?: string;
    club?: MinimalClubDto;
}

export type NewPlayerDto = {
    playerId: number;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    nationality: string;
    position: string;
    height: number;
    weight: number;
    preferredFoot: Foot;
    marketValue: number;
    photoUrl?: string;
    club?: MinimalClubDto;
}

export type AddPlayerDto = {
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    nationality: string;
    position: string;
    height: number;
    weight: number;
    preferredFoot: Foot;
    marketValue: number;
    photo?: File;
    clubId?: number | null;
}

export type UpdatePlayerDto = {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: Date;
    nationality?: string;
    position?: string;
    height?: number;
    weight?: number;
    preferredFoot?: Foot;
    marketValue?: number;
    photo?: File;
    isPhotoDeleted: boolean;
    clubId?: number | null;
    isClubIdDeleted: boolean;
}

export type PlayerQueryObject = {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: Date;
    dateOfBirthComparison?: string;
    nationality?: string;
    position?: string;
    marketValue?: number;
    marketValueComparison?: string;
    filterForUnemployedIfClubIsEmpty?: boolean;
    clubId?: number;
    sortBy?: string;
    isDescending?: boolean;
    pageNumber?: number;
    pageSize?: number;
}

export enum Foot {
    Left,
    Right,
    Both
}