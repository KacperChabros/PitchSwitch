export type ClubQueryObject = {
    name?: string;
    shortname?: string;
    league?: string;
    country?: string;
    includeArchived?: boolean;
    sortBy?: string;
    isDescending?: boolean;
    pageNumber?: number;
    pageSize?: number;
}

export type ClubDto = {
    clubId: number;
    name: string;
    shortName: string;
    league: string;
    country: string;
    city: string;
    foundationYear: number;
    stadium: string;
    logoUrl?: string;
    isArchived: boolean;
}

export type NewClubDto = {
    clubId: number;
    name: string;
    shortName: string;
    league: string;
    country: string;
    city: string;
    foundationYear: number;
    stadium: string;
    logoUrl?: string;
    isArchived: boolean;
}

export type UpdateClubDto = {
    name?: string;
    shortName?: string;
    league?: string;
    country?: string;
    city?: string;
    foundationYear?: number;
    stadium?: string;
    Logo?: File;
    IsLogoDeleted: boolean;
}

export type AddClubDto = {
    name: string;
    shortName: string;
    league: string;
    country: string;
    city: string;
    foundationYear: number;
    stadium: string;
    Logo?: File;
}

export type MinimalClubDto = {
    clubId: number;
    name: string;
    shortName: string;
    logoUrl: string;
}