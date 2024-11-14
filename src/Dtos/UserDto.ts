import { MinimalClubDto } from "./ClubDto";
import { JournalistStatusApplicationDto } from "./JournalistStatusApplicationDto";
import { ListElementPostDto, MinimalPostDto } from "./PostDto";

export type NewUserDto = {
    userId: string;
    userName: string;
    email: string;
    firstName: string;
    lastName: string;
    profilePictureUrl?: string;
    bio?: string;
    tokens: {
        accessToken: string;
        refreshToken: string;
    }
}

export type GetUserDto = {
    userName: string;
    email: string;
    firstName: string;
    lastName: string;
    profilePictureUrl?: string;
    bio?: string;
    favouriteClub?: MinimalClubDto;
    registrationDate: Date;
    posts: ListElementPostDto[];
    applications: JournalistStatusApplicationDto[];
}

export type RegisterUserDto = {
    userName: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    bio?: string | null;
    profilePicture?: File | null;
}

export type MinimalUserDto = {
    userId: string;
    userName: string;
    profilePictureUrl?: string;
}

export type UpdateUserDto = {
    email?: string;
    firstName?: string;
    lastName?: string;
    profilePicture?: File;
    isProfilePictureDeleted: boolean;
    bio?: string;
    isBioDeleted: boolean;
    favouriteClubId?: number | null;
    isFavouriteClubIdDeleted: boolean;
}