const { DataTypes } = require('sequelize');

module.exports = sequelize => {
    
    const User = require("./schema/userSchema")(sequelize, DataTypes)
    const Note = require("./schema/noteSchema")(sequelize, DataTypes)
    const NoteType = require("./schema/typeSchema")(sequelize, DataTypes)

    User.hasMany(Note)
    Note.belongsTo(User)

    NoteType.hasOne(Note)

    Note.belongsTo(NoteType)

    return {User, Note, NoteType}
}