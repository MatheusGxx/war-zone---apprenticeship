const redisConfig = {
  host: 'redis',
  port: 6379,
};

export default {
  redisRead: { ...redisConfig },
  redisWrite: { ...redisConfig },
};
