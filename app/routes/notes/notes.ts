import NoteController from '../../controller/notes/notes'
import { Router } from 'express'
import authMiddleware,{flexibleAuth} from '../../middleware/token'

const notesRouter = Router();
const noteController = new NoteController();

notesRouter.post('/create', flexibleAuth, noteController.createNote.bind(noteController));
notesRouter.get('/get', flexibleAuth, noteController.getNotes.bind(noteController));
notesRouter.get('/get/:id', flexibleAuth, noteController.getNotesById.bind(noteController));
notesRouter.put('/update/:id', flexibleAuth, noteController.updateNote.bind(noteController));
notesRouter.delete('/delete/:id', flexibleAuth, noteController.deleteNote.bind(noteController));

export default notesRouter;