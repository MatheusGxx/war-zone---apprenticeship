import api from '../routes/api/index.js'
import { Router } from 'express'

const router = Router()

router.use('/api', api)

export default router