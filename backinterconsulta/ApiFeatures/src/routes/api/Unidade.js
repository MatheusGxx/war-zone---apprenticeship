import { Router } from 'express'
import uploadPlanilha from '../../utils/multerPlanilha.js'

const router = Router()

import { GetPlanilha, getWaitList } from '../../services/UnidadeService.js'

router.get('/get-planilha', async (req, res) => {
  try {
    const result = await GetPlanilha()
    res.json(result)
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching the planilha' })
  }
})

router.post('/get-wait-list', async (req, res) => {
  try {
    const result = await getWaitList()
    res.json(result)

    if (req.body) {
      console.log(req.body)
    } else {
      console.log('No req.body object provided')
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching the wait list' })
  }
})

export default router
