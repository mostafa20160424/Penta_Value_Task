module.exports = (sequelize, DataTypes) => {
    return sequelize.define('NoteType', {
        name: {
          type: DataTypes.STRING
        },
        disable: {
          type: DataTypes.BOOLEAN,
          defaultValue: false
        },
        is_deleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false

          }
      }, {
        tableName: 'note_types'
      });
}