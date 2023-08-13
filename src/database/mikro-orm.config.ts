import { Options } from "@mikro-orm/core";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";
import { join } from "path";

const config : Options = {
    type: 'postgresql',
    timezone: '+07:00',
    port: parseInt(process.env.DB_PORT!),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    dbName: process.env.DB_NAME,
    entities: ['dist/**/*.entity.js'],
    entitiesTs: ['src/**/*.entity.ts'],
    metadataProvider: TsMorphMetadataProvider,
    migrations: {
      path: 'dist/database/migrations',
      pathTs: 'src/database/migrations',
    },
    seeder:{
      path: 'dist/database/seeders',
      pathTs: 'src/database/seeders'
    }
};

export default config;