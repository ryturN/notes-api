import MySQLDatabase from "../config/mysql";
import { UserModel } from "./tables/UserModels";
import { NotesModel } from "./tables/NotesModel";

export async function initializeDatabase(){
    try {    
        console.log("Initialize database")
        
        await MySQLDatabase.config.authenticate();
        try {     
            await UserModel.sync();
            console.log("User model synced")
        } catch (error) {
            console.error("Error syncing User model:", error)
        }
        try {
            await NotesModel.sync();
            console.log("Notes model synced")
        } catch (error) {
            console.error("Error syncing Notes model:", error)
        }
        return true
    } catch (error) {
        console.error("Error initializing database:", error)
        return false
    }
}