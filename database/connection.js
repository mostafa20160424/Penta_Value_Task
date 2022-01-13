const { Sequelize } = require('sequelize');

const ConnectToDB = () => {
    
    const sequelize = new Sequelize(
        process.env.DB_Name,
        process.env.DB_Username,
        process.env.DB_Password,
        {
            host: process.env.DB_Server,
            dialect:  'mysql' 
        }
        );
    
      try {
        sequelize.authenticate();
        console.log('Connection has been established successfully.');
         return sequelize
      } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1)
      }
      

}

module.exports = ConnectToDB