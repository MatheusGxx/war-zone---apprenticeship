import { Router } from 'express'
import { getSafeId } from '../../services/SafeIdService.js'

const router = Router()

router.get('/authorize-safeid', async (req, res) => {
  const url = await getSafeId()
  res.location(url);
})

router.get('/get-code-safeid', async (req, res) => {
  const { code, state, error } = body

  console.log(req.params)
})

export default router
