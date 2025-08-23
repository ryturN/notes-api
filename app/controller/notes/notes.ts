import { NotesModel,UserModel } from "../../models";
import BaseClient from "../../BaseClient/baseClient";
import type { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { Op } from "sequelize";

class NotesController extends BaseClient {
    constructor() {
        super();
    }

    async createNote(req: Request, res: Response) {
        try {
            const { title, content, due } = req.body;
            const user_id = req.user?.id;
            if (!title || !content || !due) {
                return res.status(400).json(this.response(400, { message: "Title, content, and due date are required" }));
            }
            const newNote = await NotesModel.create({
                id: uuidv4(),
                user_id : user_id,
                title: title,
                content: content,
                due: due
            });
            return res.status(201).json(this.response(201, { id: newNote.id, message: "Note created successfully" }));
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            return res.status(500).json(this.response(500, { error: errorMessage }));
        }
    }

    async getNotes(req: Request, res: Response) {
        try {
            const user_id = req.user?.id;
            const include = [{ model: UserModel, as: "user", attributes: ["id", "username","image_url"] }];
            const notes = await NotesModel.findAll({ where: { user_id }, include });
            return res.status(200).json(this.response(200, { notes }));
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            return res.status(500).json(this.response(500, { error: errorMessage }));
        }
    }

    async updateNote(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { title, content } = req.body;
            const note = await NotesModel.findOne({ where: { id } });
            if (!note) {
                return res.status(404).json(this.response(404, { message: "Note not found" }));
            }
            await note.update({ title, content });
            return res.status(200).json(this.response(200, { message: "Note updated successfully" }));
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            return res.status(500).json(this.response(500, { error: errorMessage }));
        }
    }

    async deleteNote(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const user_id = req.user?.id;
            const note = await NotesModel.findOne({ where: { id, user_id } });
            if (!note) {
                return res.status(404).json(this.response(404, { message: "Note not found" }));
            }
            await note.destroy();
            return res.status(200).json(this.response(200, { message: "Note deleted successfully" }));
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            return res.status(500).json(this.response(500, { error: errorMessage }));
        }
    }

    async getNotesById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const user_id = req.user?.id;
            const include = [{ model: UserModel, as: "user", attributes: ["id", "username","image_url"] }];
            const note = await NotesModel.findOne({ where: 
                { [Op.and]: [{ id }, { user_id }] }, include });
            if (!note) {
                return res.status(404).json(this.response(404, { message: "Note not found" }));
            }
            return res.status(200).json(this.response(200, { note }));
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            return res.status(500).json(this.response(500, { error: errorMessage }));
        }
    }
}

export default NotesController;