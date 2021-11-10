import { RedisClient } from 'redis';

export default interface JobSenderOptions {
  jobName: string;
  jobData?: object;
  jobQueueName: string;
  redisConnection?: RedisClient;
}
