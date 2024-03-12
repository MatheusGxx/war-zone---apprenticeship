import { Router } from 'express'
import api from '../routes/api/index.js'

// Create a new router object
const apiRouter = Router()

// Mount the '/api2' route on the router object
apiRouter.use('/api2', api)

// Export the router object
export default apiRouter
