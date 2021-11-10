import LaravelJob from './LaravelJob';
import JobSenderOptions from './interfaces/JobSenderOptions';

export { LaravelJob };

/**
 * Serializes parameters of the given job and sends it to the Horizon queue.
 *
 * This function expects the job to be in the App/Jobs/ directory
 */
export default async function pushJob(
  options: JobSenderOptions,
): Promise<void> {
  const job: LaravelJob = new LaravelJob(options.jobName, options.jobData);
}
