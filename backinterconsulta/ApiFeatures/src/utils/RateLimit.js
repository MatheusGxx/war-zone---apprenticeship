import * as rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 2 minutes
  max: 1,
  message: 'You have exceeded the request limit. Please wait for a moment.',
  headers: true, // include rate limit headers in the response
});

export default limiter;
