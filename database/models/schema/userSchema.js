module.exports = (sequelize, DataTypes) => {
    return sequelize.define('User', {
        name: {
          type: DataTypes.STRING
        },
        picture: {
          type: DataTypes.STRING
        },
        daily_notifications: {
            type: DataTypes.BOOLEAN,
            defaultValue: true

          },
        is_deleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false

          }
      }, {
        tableName: "users"
    });
}