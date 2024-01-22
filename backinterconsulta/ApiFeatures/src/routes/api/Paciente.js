import { Router } from 'express'
const router = Router()

import {
  GetDoença,
  EspecialidadesDisponiveis,
  getEspecialista,
  GetRecomendacoesEspecialistas,
  GetPaciente,
  getBlood,
  getMedicoStatus,
  UpdateOnlineDoctor,
  GetDataSintomasAndDoenca,
  VerifyDataPatient,
} from '../../services/PacienteService.js'

router.post('/get-doenca', async( req, res) => {
  
  console.log(req.query)
  
  const doenca = req.query.doenca
  const response = res

  await GetDoença(doenca, response)
})

router.post('/especialidades', async (req, res ) => {

  console.log(req.body)
  const body ={
    doenca: req.body.doenca,
    id: req.body.id
  }
  const response = res

  await EspecialidadesDisponiveis(body, response)
})

router.get('/get-especialista/:slug', async (req,res ) => {

  const body = {
    slugIdentificador: req.params.slug
  }  
  const response = res

  getEspecialista(body, response)

})


router.get('/get-recomendacoes/:slug', async (req, res) => {

  const body = {
    slugIdentificador: req.params.slug
  }

  const response = res
  
  GetRecomendacoesEspecialistas(body, response)

})

router.get('/get-paciente/:id', async(req,res ) =>{
    
  const body = {
    id: req.params.id
  }
  console.log(req.params)

  const response = res

  GetPaciente(body, response)
})

router.post('/get-blood/:id', async (req, res) => {
  
  const params = {
    id: req.params.id
  }

  const response = res
  console.log(`ID do Paciente para pegar o Tipo Sanguineo que combina com ele ${req.params.id}`)

  getBlood(params, response)
})

router.get('/verify-status',
      async (req, res) => {
        const { id } = req.query;
        getMedicoStatus(id, res);
        console.log(req.query)
      }
)

router.post('/atualized-status',
       async(req, res) =>{
        const body = {
          id: req.body.id,
          status: req.body.status
        }
        UpdateOnlineDoctor(body,res)        
        console.log(req.body)
       }
)

router.post('/get-sintomas-doencas', 
       async(req, res) =>{
        GetDataSintomasAndDoenca(res)
       }
)

router.post('/verify-data-patient',
       async(req, res) => {

       const body = {
        id: req.body.id
       }
       
        VerifyDataPatient(body, res)

        console.log(`ID do Paciente, ${req.body.id}`)
       }
)

export default router