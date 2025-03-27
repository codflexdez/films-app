import { Sequelize } from 'sequelize';
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB as string,  
  process.env.USER as string, 
  process.env.PASSWORD as string,                         
  {
    host: process.env.HOST,
    port: parseInt(process.env.SQL_PORT as string, 10), // Convert port to integer
    dialect: process.env.DIALECT as 'mssql', // Set dialect to mssql
    dialectOptions: {
      options: {
        encrypt: false, // Optional: Set to false for local development
        trustedConnection: true,  // Use Windows Authentication
      },
    },
    logging: false,  // Optional: Disable SQL query logging
  }
);


export default sequelize;
