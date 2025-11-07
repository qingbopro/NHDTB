import dotenv from "dotenv";

dotenv.config({
	path: "../../apps/server/.env",
});

import { drizzle } from "drizzle-orm/mysql2";

export const db = drizzle({
	connection: {
		uri: process.env.DATABASE_URL,
	},
});
