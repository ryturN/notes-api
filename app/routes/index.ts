import { Router } from "express";
import userRouter from "./user/user";
import notesRouter from "./notes/notes";
const index = Router();

index.use("/v1", userRouter);
index.use("/v1/notes", notesRouter);

export default index;
