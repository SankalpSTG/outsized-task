import mongoose, { Connection } from "mongoose";

let mongoUri: string = process.env.MONGO_URI || "";

const connectionOptions: any = {
  bufferCommands: false,
};

let dbConnection: Connection | null = null;

const createConnection = async (
  url: string,
  options: any
): Promise<Connection> => {
  const connection = mongoose.createConnection();
  await connection.openUri(url, options);
  return connection;
};

export const getConnection = async (): Promise<Connection> => {
    if (dbConnection) return dbConnection
    dbConnection = await createConnection(mongoUri, connectionOptions)
    return dbConnection
};