import { Router } from "express"
import {
  SavedConsultaPacienteParticular,
  SavedConsultaUnidadeSaude,
  getAgendamentos,
  UpdateConsulta,
  GetPaciente,
  DeleteCasoClinico,
  GenerateLink,
  ValidatorURL,
  DeleteCasoClinicoPacienteParticular,
  getLaudo,
  getDataMedico,
  getPhotoPatient,
  TraduçaoAudioParaTexto,
  PaymentDoctor
} from '../../services/AgendaService.js'

import uploadAudios from "../../utils/multerVoice.js"

const router = Router()

router.post('/agendamento-paciente-particular', 
  async (req, res) => {
    const body = {
      IDPaciente: req.body.IDPaciente,
      IDMedico:  req.body.IDMedico,
      Caso: req.body.Caso,
      Data: req.body.Data,
      Inicio: req.body.Inicio,
      Fim: req.body.Fim,
      Solicitante: req.body.Solicitante,
      Solicitado: req.body.Solicitado,
      Status: req.body.Status,
      HorarioSelecionado: req.body.HorarioSelecionado,
      Escolhido: req.body.Escolhido,
      idHorario: req.body.idHorario,
      TempoConsulta: req.body.TempoConsulta,
      Resumo: req.body.Resumo,
      DocumentosSolicitadosPaciente: req.body.DocumentosSolicitadosPaciente
    }
    console.log(req.body)

    SavedConsultaPacienteParticular(body, res)
   }
)

router.post('/agendamento-unidade-de-saude',
   async (req,res) => {
    const body = {
      IDMedicos: req.body.IDMedicos,
      IDUnidade: req.body.IDUnidade,
      Solicitante: req.body.Solicitante,
      Casos: req.body.Casos,
      Status: req.body.Status,
      //Automaçao
      IdentificadorUnidadeSaudeRoute: req.body.IdentificadorUnidadeSaudeRoute,
      route: req.body.route
    }

    console.log(req.body)

    SavedConsultaUnidadeSaude(body, res)
   }
)

router.get('/get-consultas/:id',
  async (req,res) => {
    const params = {
      id: req.params.id
    }

    console.log(req.params)

    getAgendamentos(params, res)
    }
)

router.post('/update-consulta',
  async(req, res) => {
    const body = {
      id: req.body.id,
      status: req.body.status,
      idMedico: req.body.idMedico,
      idPacienteParticular: req.body.idPacienteParticular,
      CPFPacientePublico: req.body.CPFPacientePublico,
      NomePacientePublico: req.body.NomePacientePublico,
      Data: req.body.Data,
      Inicio: req.body.Inicio,
      Fim: req.body.Fim,
      Solicitante: req.body.Solicitante
    }

    console.log(req.body)

    UpdateConsulta(body,res) 
  }
)


router.post('/get-paciente-particular/:id',
  async (req,res) => {
    const params = {
      id:req.params.id
    }
  
    console.log(req.params)

    GetPaciente(params,res)
  }
)


router.delete('/delete-caso-clinico', 
     async (req,res) => {
      const body ={
        idCasoClinico: req.body.idCasoClinico,
        IdentificadorCaso: req.body.IdentificadorCaso,
        CPFPaciente: req.body.CPFPaciente,
        Solicitante: req.body.Solicitante,
        idMedico: req.body.idMedico,
        status: req.body.status,
        Data: req.body.Data,
        Inicio: req.body.Inicio,
        Fim: req.body.Fim,
        idHorario: req.body.idHorario,
        HorarioSelecionado: req.body.HorarioSelecionado,  
      }

      console.log(req.body)
      DeleteCasoClinico(body, res)
    }
)

router.delete('/delete-caso-clinico-paciente-particular',
       async(req, res) =>{
        const body ={
          id: req.body.id,
          Solicitante: req.body.Solicitante,
          idPaciente: req.body.idPaciente,
          Data: req.body.Data,
          Inicio: req.body.Inicio,
          Fim: req.body.Fim,
          idHorario: req.body.idHorario,
          HorarioSelecionado: req.body.HorarioSelecionado
        }
        console.log(req.body)
        DeleteCasoClinicoPacienteParticular(body, res)
       }
)

router.post('/generate-link',
     async (req,res) => {
       const body = {
        IdentificadorConsultaParticular: req.body.IdentificadorConsultaParticular,
       }

       console.log(req.body)
       GenerateLink(body, res)
     }
)

router.get('/validator-link/:id',
        async(req,res) => {
          const params = {
            ParamsLink: req.params.id,
            id: req.body.id
          }
          console.log(req.params.id)
          ValidatorURL(params, res)
        }
)


router.post('/get-laudo',
       async(req, res) =>{
        const body = {
          id: req.body.id,
          IdentificadorConsulta: req.body.IdentificadorConsulta
        }
        getLaudo(body, res)
        console.log(req.body)
       }
)


router.post('/get-data-doctor',
       async(req, res) =>{
        const body = {
          idMedico: req.body.idMedico
        }
        getDataMedico(body, res)
        console.log(`ID for get photo doctor: ${req.body.idMedico}`)
       }
)


router.post('/foto-paciente',
       async(req, res) => {

        const body = {
          id: req.body.id
        }
        getPhotoPatient(body, res)
       
        console.log(`ID para pegar a Foto do Paciente: ${req.body.id}`)
       }
)

router.post('/audio-to-text-translation', uploadAudios.single('audio'),
       async(req,res) =>{

        const file = req.file

        const pathAudio = file.path

        TraduçaoAudioParaTexto(pathAudio, res)
        
        console.log(req.file)
       }
)

router.post('/payment',
    async(req,res) => {
      const body = {
        id:req.body.id,
        ValorConsulta:req.body.ValorConsulta,
        TypePayment: req.body.TypePayment,
        TransictionCardID: req.body.TransictionCardID
      }
      
      PaymentDoctor(body, res)
      console.log(req.body)
   }
)

export default router