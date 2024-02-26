import api from '../routes/api/index.js'
import { Router } from 'express'

const router = Router()

router.use('/api2', api)

export default router