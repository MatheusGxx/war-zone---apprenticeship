import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 2 * 60 * 1000,
  max: 1,
  message: 'Você ultrapassou o limite de requisições. Aguarde um momento.',
  standardHeaders: true,
  legacyHeaders: false,
})


export default limiter 