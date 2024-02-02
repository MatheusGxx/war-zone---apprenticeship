import { Router } from 'express'
import { getSafeId } from '../../services/SafeIdService'
const router = Router()

router.get('/authorize-safeid', async (req, res) => {
  const html = await getSafeId()
  res.send(html)
})

router.post('/get-code-safeid', async (req, res) => {
  const { code, state, error } = body

  console.log(req.body)
})

export default router
