import type { Optional } from 'sequelize';

export interface UserAttributes {
    id: string;
    username: string;
    email?: string;
    password?: string;
    refreshToken?: string;
    age?: number;
    verified?: boolean;
    image_url?: string;
    created_at?: Date;
    updated_at?: Date;
    verified_at?: Date;
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'email' | 'password' | 'refreshToken' | 'age' | 'verified' | 'image_url' | 'created_at' | 'updated_at' | 'verified_at'> {}

