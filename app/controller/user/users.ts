
import type { Request,Response } from "express";
import { UserModel,MySQLDatabase } from "../../models";
import bcrypt from "bcrypt"
import { v4 as uuidv4 } from "uuid";
import jsonwebtoken from "jsonwebtoken";
import BaseClient from "../../BaseClient/baseClient";

class UsersController extends BaseClient{
    constructor(){
        super();
        this._client = MySQLDatabase.config;
    }

    async register(req: Request,res:Response){
        try {
            const { username,password} = req.body as { username: string; password: string };
            if (!username || !password) {
                return res.status(400).json(this.response(400, {'message' : 'Username and password are required'}));
            }
            
            const existUser = await UserModel.findOne({where : {username}})

            if (existUser) {
                return res.status(400).json(this.response(400, {'message' : 'Username already exists'}));
            }
            
            if (!RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/).test(password)) {
                return res.status(400).json(this.response(400, {'message' : 'Password must be at least 8 characters long and contain at least one letter and one number'}));
            }
            const hashedPassword = await this.hashedPassword(password);
            const newUser = await UserModel.create({
                'id': uuidv4(),
                'username': username,
                'password': hashedPassword
            })
            return res.status(201).json(this.response(201, {'id' : newUser.id,'message' : "User created successfully"}));
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            return res.status(500).json(this.response(500, { error: errorMessage }));
        }
    }

    async login (req : Request,res : Response) {
        const { username,password } = req.body as { username: string; password: string };
        if (!username || !password) {
            return res.status(400).json(this.response(400, {'message' : 'Username and password are required'}));
        }
        const user = await this.findUser(username);
        if (!user){
            return res.status(404).json(this.response(404, {'message' : 'User not found'}));
        } 
        const isPasswordValid = await this.decryptPassword(password, user.get('password') as string);
        if (!isPasswordValid) {
            return res.status(401).json(this.response(401, {'message' : 'Invalid password'}));
        }
        const token = jsonwebtoken.sign({ id: user.get('id'), username: user.get('username') }, process.env.JWT_SECRET as string, { expiresIn: '15m' });
        const refreshToken = jsonwebtoken.sign({ id: user.get('id'), username: user.get('username') }, process.env.JWT_REFRESH_SECRET as string, { expiresIn: '7d' });

        await user.update({'refreshToken' : refreshToken});

        res.cookie('accessToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000 
        });
        
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        
        return res.status(200).json(this.response(200, { message: 'Login successful' }));
    }

    async logout (req : Request,res : Response) {
        const refreshToken = req.cookies.refreshToken;
        if (refreshToken) {
            await UserModel.update({ refreshToken: '' }, { where: { refreshToken } });
            res.clearCookie('refreshToken');
        }
        res.clearCookie('accessToken');
        return res.status(200).json(this.response(200, { message: 'Logout successful' }));
    }
    async refreshToken (req : Request,res : Response) {
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken){
            return res.status(401).json(this.response(401, { message: 'Refresh token is required' }));
        }
        const decoded = jsonwebtoken.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string) as any;
        if (!decoded || !decoded.id) {
            return res.status(401).json(this.response(401, { message: 'Invalid refresh token' }));
        }
        const user = await UserModel.findOne({ where: { id: decoded.id, refreshToken: refreshToken } });
        if (!user) {
            return res.status(401).json(this.response(401, { message: 'Invalid refresh token' }));
        }
        const newAccessToken = jsonwebtoken.sign({ id: user.get('id'), username: user.get('username') }, process.env.JWT_SECRET as string, { expiresIn: '15m' });
        res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000
        });
        return res.status(200).json(this.response(200, { message: 'Access token refreshed successfully' }));
    }
}

export default UsersController;