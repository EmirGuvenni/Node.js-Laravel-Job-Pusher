// @ts-ignore: ignore the missing type declarations
import php from 'php-serialization';
import { v4 as uuidv4 } from 'uuid';
import { RedisClient } from 'redis';

/**
 * The job must be in the App/Jobs directory.
 */
export class LaravelJob {
  public uuid: string;
  public displayName: string;
  public job: string;
  public maxTries: number | null;
  public maxExceptions: number | null;
  public failOnTimeout: boolean;
  public backoff: number | null;
  public timeout: number | null;
  public retryUntil: number | null;
  public data: {
    commandName: string;
    command: string;
  };
  // tslint:disable-next-line | This line needs to be snake case for the serialized job to work
  public telescope_uuid: string;
  public id: string;
  public attempts: number;
  public type: string;
  public tags: string[];
  public pushedAt: number;

  constructor(jobName: string, jobData?: object) {
    if (jobName.match(/[\/\\]/))
      throw new Error('Job name cannot contain slashes or backslashes');

    /**
     * Create the command payload
     */
    const command = new php.Class(`App\\Jobs\\${jobName}`);

    command.__addAttr__('job', 'string', null, 'null');
    command.__addAttr__('connect', 'string', null, 'null');
    command.__addAttr__('queue', 'string', null, 'null');
    command.__addAttr__('chainConnection', 'string', null, 'null');
    command.__addAttr__('chainQueue', 'string', null, 'null');
    command.__addAttr__('chainCatchCallbacks', 'string', null, 'null');
    command.__addAttr__('delay', 'string', null, 'null');
    command.__addAttr__('afterCommit', 'string', null, 'null');
    command.__addAttr__('middleware', 'string', new php.Class(), 'array');
    command.__addAttr__('chained', 'string', new php.Class(), 'array');

    // Add the job data to the command
    if (jobData) {
      Object.entries(jobData).forEach(([key, value]) => {
        command.__addAttr__(key, 'string', value, typeof value);
      });
    }

    const randomUUID: string = uuidv4();

    /**
     * Create the job payload
     */
    this.uuid = randomUUID;
    this.displayName = `App\\Jobs\\${jobName}`;
    this.job = 'Illuminate\\Queue\\CallQueuedHandler@call';
    this.maxTries = null;
    this.maxExceptions = null;
    this.failOnTimeout = false;
    this.backoff = null;
    this.timeout = null;
    this.retryUntil = null;
    this.data = {
      commandName: `App\\Jobs\\${jobName}`,
      command: php.serialize(command, 'object'),
    };
    this.telescope_uuid = uuidv4();
    this.id = randomUUID;
    this.attempts = 0;
    this.type = 'job';
    this.tags = [];
    this.pushedAt = new Date().getTime();
  }
}

interface JobSenderOptions {
  jobName: string;
  jobData?: object;
  jobQueueName: string;
  redisConnection: RedisClient;
}

/**
 * Serializes parameters of the given job and sends it to the Horizon queue.
 *
 * This function expects the job to be in the App/Jobs/ directory
 */
export default function pushJob(options: JobSenderOptions): void | Error {
  if (!options.jobQueueName) throw Error('Job queue name is required.');
  else if (!options.jobName) throw Error('Job name is required.');
  else if (!options.redisConnection)
    throw Error(
      'Redis connection is required for this method. You could use the LaravelJob class if you want the serialized job instead.',
    );

  const job: LaravelJob = new LaravelJob(options.jobName, options.jobData);

  options.redisConnection.rpush(
    options.jobQueueName,
    JSON.stringify(job),
    (err: Error | null) => {
      if (err) throw err;
    },
  );
}
