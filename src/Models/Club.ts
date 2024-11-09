export type Club = {
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