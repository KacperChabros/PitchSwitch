import { MinimalClubDto } from "./ClubDto";
import { MinimalPlayerDto } from "./PlayerDto";

export type TransferDto = {
    transferId: number;
    transferType: TransferType;
    transferDate: Date;
    transferFee: number;
    player: MinimalPlayerDto;
    sellingClub?: MinimalClubDto;
    buyingClub?: MinimalClubDto;
}

export type NewTransferDto = {
    transferId: number;
    transferType: TransferType;
    transferDate: Date;
    transferFee: number;
    player: MinimalPlayerDto;
    sellingClub?: MinimalClubDto;
    buyingClub?: MinimalClubDto;
}

export type TransferQueryObject = {
    transferType?: TransferType;
    transferDate?: Date;
    transferDateComparison: string;
    transferFee?: number;
    transferFeeComparison: string;
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

export type AddTransferDto = {
    transferType: TransferType;
    transferDate: Date;
    transferFee: number;
    playerId: number;
    sellingClubId?: number | null;
    buyingClubId?: number | null;
}

export type UpdateTransferDto = {
    transferType?: TransferType;
    transferDate?: Date;
    transferFee?: number;
    playerId?: number | number;
    sellingClubId?: number | null;
    buyingClubId?: number | null;
    isSellingClubDeleted: boolean;
    isBuyingClubDeleted: boolean;
}

export enum TransferType {
    Permament,
    Loan
}