export type ClubQueryObject = {
    name?: string;
    shortname?: string;
    league?: string;
    country?: string;
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