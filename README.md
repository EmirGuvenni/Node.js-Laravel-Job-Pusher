# Node.js-Laravel-Job-Pusher

A library to make pushing Laravel jobs to the Redis easier.

# How does it work?

The library serializes the given parameters, adds the necessary attributes to make it a Laravel job and pushes it to the Horizon's Redis queue.

Optionally, you could only use the LaravelJob class to create a serialized job and send it with your own functions.

# Troubleshooting

- Your Laravel jobs must be stored in the `app/jobs/` directory.
- Your queue name should match with your Laravel project's queue name.

---

Please report bugs [here](https://github.com/EmirGuvenni/Node.js-Laravel-Job-Pusher/issues)
