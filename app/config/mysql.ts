import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

class MySQLDatabase {
  public config: Sequelize;

  constructor() {
    const dbName = process.env.MYSQL_DB_NAME || "notes_db";
    const dbUser = process.env.MYSQL_DB_USER || "root";
    const dbPassword = process.env.MYSQL_DB_PASSWORD || "root";
    const dbHost = process.env.MYSQL_DB_HOST || "localhost";
    const dbPort = process.env.MYSQL_DB_PORT || 3306;

    this.config = new Sequelize(dbName, dbUser, dbPassword, {
      host: dbHost,
      port: Number(dbPort),
      dialect: "mysql",
      logging: false,
    });
  }
}

export default new MySQLDatabase();