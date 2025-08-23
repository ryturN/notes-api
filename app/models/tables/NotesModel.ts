import type { NoteAttributes,NotesCreationAttributes } from "../interface/NoteAttribute";
import { DataTypes, Model, type Optional } from "sequelize";
import MySQLDatabase from "../../config/mysql";


export class NotesModel extends Model<NoteAttributes, NotesCreationAttributes> implements NoteAttributes {
    public id!: string;
    public user_id!: string;
    public checked?: boolean;
    public title!: string;
    public content?: string;
    public due?: Date;
    public created_at?: Date;
    public updated_at?: Date;
}

NotesModel.init(
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: "users",
                key: "id"
            },
            onDelete: "CASCADE",
        },
        checked: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        due: {
            type: DataTypes.DATE,
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
    },
    {
        sequelize: MySQLDatabase.config,
        tableName: "notes",
        timestamps: true,
        paranoid: false,
        underscored: false,
        freezeTableName: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
        
    }
);
