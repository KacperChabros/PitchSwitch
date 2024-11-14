import { MinimalUserDto } from "./UserDto";

export type AddJournalistStatusApplicationDto = {
    motivation: string;
}

export type ReviewJournalistStatusApplicationDto = {
    isAccepted: boolean;
    rejectionReason?: string;
}

export type UpdateJournalistStatusApplicationDto = {
    motivation: string;
}

export type JournalistStatusApplicationQueryObject = {
    motivation?: string;
    createdOn?: Date;
    createdOnComparison: string;
    isAccepted?: boolean;
    isReviewed?: boolean;
    rejectionReason?: string;
    submittedByUserId?: number;
    sortBy?: string;
    isDescending?: boolean;
    pageNumber?: number;
    pageSize?: number;
}

export type JournalistStatusApplicationDto = {
    id: number;
    motivation: string;
    createdOn: Date;
    isAccepted: boolean;
    isReviewed: boolean;
    reviewedOn?: Date;
    rejectionReason?: string;
    submittedByUser: MinimalUserDto;
}

export type NewJournalistStatusApplicationDto = {
    id: number;
    motivation: string;
    createdOn: Date;
    isAccepted: boolean;
    isReviewed: boolean;
    reviewedOn?: Date;
    rejectionReason?: string;
    submittedByUser: MinimalUserDto;
}