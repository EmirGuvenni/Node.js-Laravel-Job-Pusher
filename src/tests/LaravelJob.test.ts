import { LaravelJob } from '..';

test('Successful job creation', () => {
  const jobName: string = 'TestJob';
  const jobData = {
    test: 'test',
    foo: 'bar',
  };

  const job = new LaravelJob(jobName, jobData);

  expect(job.displayName).toBe('App\\Jobs\\' + jobName);
  expect(job.data).toBeDefined();
});
