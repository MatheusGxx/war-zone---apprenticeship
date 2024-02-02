import { Router } from 'express'
import { getSafeId } from '../../services/SafeIdService.js'

const router = Router()

router.get('/authorize-safeid',
    async (req, res) => {
      const url = await getSafeId()
      console.log(url);
      return res.json({ url })
})

router.get('/get-code-safeid'), 
   async (req, res) => {
    const { code, state, error } = req.query
    console.log(code)
}

export default router
