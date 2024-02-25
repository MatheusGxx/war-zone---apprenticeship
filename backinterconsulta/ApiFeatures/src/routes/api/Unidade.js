import { Router } from 'express'
import uploadPlanilha from '../../utils/multerPlanilha.js'

const router = Router()

import {
  GetPlanilha,
  ProcessPlanilha
} from '../../services/UnidadeService.js'

router.get('/get-planilha', async(req, res) =>{

  const response = res
  GetPlanilha(response)
})


router.post('/process-planilha/:id', uploadPlanilha.single('file'), async (req, res) => {
  console.log(req.params.id);
  console.log(req.body);
  console.log(req.file);

  const body = {
    AreadeAtuacao: req.body.AreadeAtuacao,
    inicio: req.body.inicio,
    fim: req.body.fim,
    total: req.body.total,
    consulta: req.body.consulta,
  };

  const response = res;
  const params = {
    id: req.params.id,
  };
  const file = req.file;
  const PathPlanilha = file.path;
  const Filename = file.filename

  ProcessPlanilha(body, response, params, PathPlanilha, Filename)
})

export default router