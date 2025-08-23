import type { Optional } from "sequelize";

export interface NoteAttributes {
    id: string;
    user_id: string;
    checked?: boolean;
    title: string;
    content?: string;
    due?: Date;
    created_at?: Date;
    updated_at?: Date;
}

export interface NotesCreationAttributes extends Optional<NoteAttributes, 'id' | 'user_id' | 'checked' | 'title' | 'content' | 'due' | 'created_at' | 'updated_at'> {}
