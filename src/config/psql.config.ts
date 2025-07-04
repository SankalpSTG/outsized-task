import { config } from "dotenv";
config()
import { DataSource } from "typeorm";
import { User } from "../entities/user.entity";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.PSQL_HOST!,
    port: parseInt(process.env.PSQL_PORT!),
    username: process.env.PSQL_USER_NAME!,
    password: process.env.PSQL_USER_PASSWORD!,
    database: process.env.PSQL_DATABASE,
    synchronize: false,
    ssl: {
        rejectUnauthorized: false
    },
    logging: true,
    entities: [User],
    subscribers: [],
    migrations: [],
})
