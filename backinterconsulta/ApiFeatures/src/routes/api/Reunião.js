import { Router } from "express";
import 
  { 
    CreatingDocumentsDoctor,
    getConsulta,
    getHistoricoPacientee,
    VerifyClickEndReuniao,
    SavedConsultaMedico,
    SavedConsultaEndPaciente,
    DoctorAvaliations,
    CalculingAvaliationsDoctor,
    getDataPatient,
    ConclusionConsultaDeleteHorario,
    getConsultaParticularDoctor,
    getHorariosProximos,
    getDataDoctor,
    SavedReceitaSimples,
    getReceitaSimples,
    DeleteReceitaSimples,
    SavedReceitaControlada,
    getReceitaControlada,
    DeleteReceitaControlada,
    SaveAtestado,
    getAtestado,
    DeleteAtestado,
    SaveExamesSolicitadosDoctor,
    getExames,
    DeleteExamesSolicitadosDoctor,
    editExames,
    VerifyDocuments,
    ValidatorDocuments, 
    AtualizedDocuments,
    sendDocumentsPatient,
    getDataPatientEndRoom,
    PatientCameinRoom,
   }
 from "../../services/ReuniãoService.js"
import uploadSignedDocuments from '../../utils/multerSignDocument.js'
import axios from 'axios'
const router = Router()

router.post('/create-documents-doctor', 
    async (req,res) =>{
        const body = {
          idMedico: req.body.idMedico,
          IdentificadorConsultaPaciente: req.body.IdentificadorConsultaPaciente
        }
        const response = res
        
        console.log(req.body)
        CreatingDocumentsDoctor(body, response)
  }
)


router.post('/get-consulta',
    async(req,res) =>{
      const body = {
        IdentificadorConsulta: req.body.IdentificadorConsulta
      }

      getConsulta(body,res)
      console.log(req.body)
    }
)

router.post('/get-historic-patient',
      async(req,res) =>{
        const body = {
          CPF: req.body.CPF
        }
        
        console.log(req.body)
        getHistoricoPacientee(body, res)
      }
)

router.post('/verify-conclusion-room',
       async(req,res) => {

        const body = {
          IdentificadorConsulta: req.body.IdentificadorConsulta,
          id: req.body.id
        }
        VerifyClickEndReuniao(body, res)
        console.log(req.body)
       }
)


router.post('/conclusion-room-medico',
       async(req,res) => {

        const body = {
          id: req.body.id,
          IdentificadorConsulta: req.body.IdentificadorConsulta,
          FichaPaciente: req.body.FichaPaciente,
          Diagnostico: req.body.Diagnostico,
          Tratamento: req.body.Tratamento,
          FerramentasTerapeuticas: req.body.FerramentaTerapeutica,
          Progresso: req.body.Progresso,
          SolicitacaoMateriais: req.body.SolicitacaoMateriais,
          RecomendacoesFuturas: req.body.RecomendacoesFuturas,
          EstadoPaciente: req.body.EstadoPaciente,
          CRMMedicoAtendeu: req.body.CRMMedicoAtendeu,
          DataInsercao: req.body.DataInsercao
        }
       
        SavedConsultaMedico(body, res)
        console.log(req.body)
       }
)

router.post('/conclusion-room-patient',
       async(req,res) => {

        const body = {
          id: req.body.id,
          IdentificadorConsulta: req.body.IdentificadorConsulta
        }
       
        SavedConsultaEndPaciente(body, res)
        console.log(req.body)
       }
)

router.post('/get-medico-avaliations',
       async(req, res) =>{
        const body ={
          IdentificadorConsulta: req.body.IdentificadorConsulta
        }
        DoctorAvaliations(body, res)

        console.log(req.body)
       }
)


router.post('/avaliation-doctor', 
       async(req,res) =>{
        const body = {
          id:req.body.id,
          avaliacao: req.body.avaliacao,
          avaliacaoText: req.body.avaliacaoText,
          FotoPaciente: req.body.FotoPaciente,
          NomePaciente: req.body.NomePaciente
        }
        CalculingAvaliationsDoctor(body,res)
        console.log(req.body)
       }
)


router.post('/get-data-patient', 
           async(req, res) =>{
            const body = {
              idPaciente: req.body.idPaciente
            }
            getDataPatient(body, res)
            console.log(req.body)
           }
)

router.post('/conclusion-consulta-delete-horario',
       async(req, res) =>{
        const body = {
          idConsultaParticular: req.body.idConsultaParticular
        }
        ConclusionConsultaDeleteHorario(body, res)

        console.log(req.body)
       }
)

router.post('/get-consulta-particular-doctor',
       async(req,res) =>{

        const body = {
          idConsultaParticular: req.body.idConsultaParticular
        }

        getConsultaParticularDoctor(body, res)

        console.log(req.body)
       }
)

router.post('/get-horarios-proximos',
       async(req,res) => {
        const body = {
          idMedico: req.body.idMedico
        }
        getHorariosProximos(body, res)
        console.log(req.body)
       }
)

router.post('/get-data-doctor-room',
      async(req, res) => {
        const body ={
          id: req.body.id
        }
        getDataDoctor(body,res)
        console.log(req.body)
      }
)

router.post('/saved-receita-simples', 
     async(req, res) => {
      const { id, receitaSimples } = req.body
      SavedReceitaSimples(id, receitaSimples, res)
      console.log(req.body)
     }
)

router.get('/get-receita-simples/:id', 
      async(req, res) =>{
        const { id } = req.params
        getReceitaSimples(id,res)
        console.log(req.params)
      }
)

router.delete('/delete-receita-simples/:idConsulta/:idReceitaS',
      async(req,res) =>{
        const { idConsulta, idReceitaS } = req.params
        
        DeleteReceitaSimples(idConsulta,idReceitaS, res)
        console.log(req.params)
      }
)

router.post('/saved-receita-controlada', 
     async(req, res) => {
      const { id, receitaControlada } = req.body
      SavedReceitaControlada(id, receitaControlada, res)
      console.log(req.body)
     }
)

router.get('/get-receita-controlada/:id', 
      async(req, res) =>{
        const { id } = req.params
        getReceitaControlada(id,res)
        console.log(req.params)
      }
)

router.delete('/delete-receita-controlada/:idConsulta/:idReceitaC',
      async(req,res) =>{
        const { idConsulta, idReceitaC } = req.params  
        DeleteReceitaControlada(idConsulta,idReceitaC, res)
        console.log(req.params)
      }
)

router.post('/saved-atestado', 
    async(req, res) => {
      const { id, diasAfastamento, CID } = req.body
      SaveAtestado(id, diasAfastamento, CID, res)
      console.log(req.body)
     }
)

router.get('/get-atestado/:id', 
      async(req, res) => {
        const { id } = req.params
        getAtestado(id,res)
        console.log(req.params)
      }
)

router.delete('/delete-atestado/:idConsulta/:idAtestado',
      async(req,res) =>{
        const { idConsulta, idAtestado } = req.params
        DeleteAtestado(idConsulta, idAtestado, res)
        console.log(req.params)
      }
)

router.post('/saved-exame', 
     async(req, res) => {
      const { id, exame } = req.body
      SaveExamesSolicitadosDoctor(id, exame, res)
      console.log(req.body)
     }
)

router.get('/get-exame/:id', 
      async(req, res) =>{
        const { id } = req.params
        getExames(id,res)
        console.log(req.params)
      }
)

router.put('/edit-exame/:idExame/:newExame',
       async(req,res) => {
        const { idExame, newExame } = req.params

        editExames(idExame, newExame, res)
        console.log(req.params)
       }
)

router.delete('/delete-exame/:idConsulta/:idExame',
      async(req,res) =>{
        const { idConsulta, idExame } = req.params
        
        DeleteExamesSolicitadosDoctor(idConsulta,idExame, res)
        console.log(req.params)
      }
)


router.post('/verify-documents',
      async(req, res) => {
        const { id } = req.body

        VerifyDocuments(id,res)
        
        console.log(req.body)
      }
)

router.post('/validator-documents',
      async(req, res) => {

      const { id } = req.body
      
      ValidatorDocuments(id, res)
      console.log(req.body)
      }
)

router.post('/atualized-documents',
       async(req, res) => {
         const { receitaSimples, receitaControlada, atestado, IdentificadorConsulta, exame } = req.body

         AtualizedDocuments(receitaSimples, receitaControlada, atestado, exame, IdentificadorConsulta, res)
         console.log(req.body)
       }
)

router.post('/data-patient', 
       async(req,res) => {
        const { id } = req.body
        getDataPatientEndRoom(id, res)
        console.log(req.body)
       }
)

router.post('/send-documents-patient', uploadSignedDocuments.any(), 
       async(req,res) => {

        console.log(req.body)
        console.log(req.files)

        const files = req.files

        const PathDocumentSign = files.map((data) => data.path)
        console.log(PathDocumentSign)

        const { id } = req.body
        sendDocumentsPatient(id, res, PathDocumentSign)
       }
)

router.post('/patient-came-in-room',
       async(req, res) => {
        const { id } = req.body 
        PatientCameinRoom(id, res)
        console.log(req.body)
       }
)

export default router