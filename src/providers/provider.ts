import { JSONProvider } from "./JsonProvider";
import { MongoProvider } from "./MongoProvider";

export type ProviderName = 'Mongo' | 'MSSQL' | 'ORACEL' | 'JSON';




export const DatabaseProviders = {
    Mongo: new MongoProvider(),
    MSSQL: null,
    ORACEL: null,
    JSON: new JSONProvider()
}