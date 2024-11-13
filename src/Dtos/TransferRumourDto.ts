import { MinimalClubDto } from "./ClubDto";
import { MinimalPlayerDto } from "./PlayerDto";
import { TransferType } from "./TransferDto";
import { MinimalUserDto } from "./UserDto";

export type TransferRumourDto = {
    transferRumourId: number;
    transferType: TransferType;
    rumouredFee: number;
    confidenceLevel: number;
    isConfirmed: boolean;
    isArchived: boolean;
    createdByUser: MinimalUserDto;
    player: MinimalPlayerDto;
    sellingClub?: MinimalClubDto;
    buyingClub?: MinimalClubDto;
}

export type NewTransferRumourDto = {
    transferRumourId: number;
    transferType: TransferType;
    rumouredFee: number;
    confidenceLevel: number;
    isConfirmed: boolean;
    isArchived: boolean;
    createdByUser: MinimalUserDto;
    player: MinimalPlayerDto;
    sellingClub?: MinimalClubDto;
    buyingClub?: MinimalClubDto;
}

export type TransferRumourQueryObject = {
    transferType?: TransferType;
    rumouredFee: number;
    rumouredFeeComparison: string;
    confidenceLevel: number;
    confidenceLevelComparison: string;
    playerId?: number;
    sellingClubId?: number;
    buyingClubId?: number;
    filterForEmptySellingClubIfEmpty?: boolean;
    filterForEmptyBuyingClubIfEmpty?: boolean;
    sortBy?: string;
    isDescending?: boolean;
    pageNumber?: number;
    pageSize?: number;
}

export type AddTransferRumourDto = {
    transferType: TransferType;
    rumouredFee: number;
    confidenceLevel: number;
    playerId: number;
    buyingClubId?: number | null;
}

export type UpdateTransferRumourDto = {
    transferType?: TransferType;
    rumouredFee?: number;
    confidenceLevel?: number;
    playerId?: number | number;
    buyingClubId?: number | null;
    isBuyingClubDeleted: boolean;
}