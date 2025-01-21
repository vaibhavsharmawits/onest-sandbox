import Redis, { RedisOptions } from "ioredis";

const redisOptions: RedisOptions = {
	host: process.env.REDIS_HOST || "localhost",
	port: (process.env.REDIS_PORT || 6379) as number,
	// username: process.env.REDIS_USERNAME,
	// password: process.env.REDIS_PASSWORD,
	maxRetriesPerRequest: (process.env.REDIS_MAX_RETRIES || 100) as number,
};

export type TransactionType = {
	request: object;
	response?: object
};



export const redis = new Redis(redisOptions);
