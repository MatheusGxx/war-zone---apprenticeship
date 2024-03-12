import { Router } from 'express'
const router = Router()

import {
  getInfosMedico,
  GetSlug,
  RegisterHorarios,
  getHorarios,
  deleteHorarios,
  VerifyMedico,
  getCasosClinicos,
  DeleteIntervalo
}  from '../../services/MedicoSerivce.js'
import uploadIcons from '../../utils/multerIcons.js'

router.post('/info-medico/:id', async (req,res) =>{
     
  const params = {
    id: req.params.id
  }

  console.log(`ID para pegar todas as informaçoes do médico ${req.params.id}`)

  const response = res

  getInfosMedico(params,response)
})


router.post('/get-slug/:id', async(req, res) =>{
  const params ={
    id: req.params.id
  }

  const response = res
  console.log(`ID para pegar o Slug do Médico: ${req.params.id}`)

  GetSlug(params,response)
})

router.post('/register-horarios/:id', async (req, res ) =>{

  const body ={
    data: req.body.data,
    inicio: req.body.inicio,
    fim: req.body.fim,
    Escolhido: req.body.Escolhido,
    TempoConsulta: req.body.TempoConsulta
  }
  
  const params = {
    id: req.params.id
  }

  const response = res

  console.log(`ID de reconhecimento do médico recebido com sucesso para salvar Horario preenchido: ${req.params.id}`)

  console.log(`Informaçoes necessarios para cadastro de Horarios recebidas com sucesso: ${req.body.data}, ${req.body.inicio}, ${req.body.fim}`)

  RegisterHorarios(body, response, params)
})


router.get('/get-horarios/:id', async (req, res) =>{
    
  const params = {
    id: req.params.id
  }

  const response = res

  console.log(`ID para pegar a lista de Horarios cadastradas do médico : ${req.params.id}`)

  getHorarios(params, response)
})


router.delete('/delete-horarios/:id/:idH', async (req,res) =>{
  const params = {
    id: req.params.id,
    idH: req.body.idH
  }

  console.log(`ID do médico: ${req.params.id}, ID do Horario para exclusão: ${req.params.idH}`)

  const response = res
   
  deleteHorarios(params,response)

})

router.post('/verify-medico/:id', async (req,res) => {
    const params ={
      id: req.params.id
    }

    const response = res
    console.log(`ID para verificar se o medico tem Horario ja cadastrado: ${req.params.id}`)

    VerifyMedico(params,response)
})

router.post('/get-casos-clinicos/:id', uploadIcons.single('file'), async (req,res) =>{

  const params = {
    id: req.params.id
  }
  
  console.log(`ID para pegar os casos clinicos da area de atuaçao do médico ${req.params.id}`)
  const response = res
   
  getCasosClinicos(params, response)

})


router.delete('/delete-intervalo/:id/:idHorarioo',
       async(req, res) =>{

        const params = {
          id: req.params.id,
          idHorarioo: req.params.idHorarioo
        };
      
        DeleteIntervalo(params, res)
        console.log(req.params.id, req.params.idHorarioo)
       }  
)


export default router