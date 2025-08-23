import { UserModel } from './UserModels'
import { NotesModel } from './NotesModel'


UserModel.hasMany(NotesModel, {
    foreignKey: "user_id",
    as: "notes",
    onDelete: "CASCADE",
});

NotesModel.belongsTo(UserModel, {
    foreignKey: "user_id",
    as: "user",
    onDelete: "CASCADE",
});


export { UserModel, NotesModel };