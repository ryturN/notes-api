import type { UserAttributes,UserCreationAttributes } from "../interface/UserInterAttributes";
import { DataTypes, Model } from "sequelize";
import MySQLDatabase from "../../config/mysql";
import { password } from "bun";


export class UserModel extends Model<UserAttributes,UserCreationAttributes> implements UserAttributes {
    public id!: string;
    public username!: string;
    public email?: string;
    public password?: string;
    public refreshToken?: string;
    public age?: number;
    public verified?: boolean;
    public image_url?: string;
    public point?: number;
    public created_at?: Date;
    public updated_at?: Date;
    public verified_at?: Date;
}

UserModel.init(
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        refreshToken: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        age: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        verified: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        image_url: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        verified_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        sequelize: MySQLDatabase.config,
        tableName: "users",
        timestamps: true,
        paranoid: false,
        underscored: false,
        freezeTableName: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
        hooks: {
            beforeCreate: async (user: UserModel) => {
                if (user.password) {
                    user.password = await password.hash(user.password);
                }
            },
            beforeUpdate: async (user: UserModel) => {
                if (user.changed('password') && user.password) {
                    user.password = await password.hash(user.password);
                }
            }
        },
    }
);

UserModel.sync().then(()=>{
    console.log("UserModel table synced");
})

