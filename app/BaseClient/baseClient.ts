import { Sequelize } from "sequelize";
import bcrypt from 'bcrypt';
import  { UserModel } from "../models";
import { Op } from "sequelize";

type ResponseType = Record<string,unknown>;

interface ApiResponse {
    status: number;
    data: ResponseType;
    message: string;
}

class BaseClient {
    protected _client: Sequelize | null;

    constructor(){
        this._client = null;
    }

    response = (status : number,data:ResponseType): ApiResponse =>{
        const response : ApiResponse = {
            status: status,
            data: data,
            message: status === 200 || status === 201 || status === 204 ? 'Success' :  'Error'
        };
        return response;
    }

    hashedPassword = async (password: string): Promise<string> => {
        return await bcrypt.hash(password, 10);
    }

    decryptPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
        return await bcrypt.compare(password, hashedPassword);
    }

    findUser = async (username?: string,email?: string,id?: string): Promise<UserModel | null> => {
        const conditions = [];
        if (id) conditions.push({ id });
        if (username) conditions.push({ username });
        if (email) conditions.push({ email });

        if (conditions.length === 0) return null;

        return await UserModel.findOne({
            where: {
                [Op.or]: conditions
            }
        });
    }
}

export default BaseClient;