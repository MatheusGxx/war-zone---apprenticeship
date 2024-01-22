import Automatic from './Automatic.js'
import { Router } from 'express'

const router = Router()
router.use('/', Automatic)

export default router