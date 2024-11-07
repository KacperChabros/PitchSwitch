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

export type RegisterUserDto = {
    userName: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    profilePictureUrl?: string | null;
    bio?: string | null;
}