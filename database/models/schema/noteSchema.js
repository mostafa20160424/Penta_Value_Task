module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Note', {
        title: {
          type: DataTypes.STRING
        },
        message: {
          type: DataTypes.STRING
        },
        files:{
            type: DataTypes.TEXT
        },
        is_deleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
          }
      }, {
          tableName: "notes"
      });
}