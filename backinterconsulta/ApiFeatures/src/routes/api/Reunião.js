import { Router } from "express";
import 
  { 
    CreatingDoctorLaudo,
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
   }
 from "../../services/ReuniãoService.js"

const router = Router()

router.post('/create-laudo-medico', 
    async (req,res) =>{
        const body = {
          idMedico: req.body.idMedico,
          IdentificadorConsultaPaciente: req.body.IdentificadorConsultaPaciente,
          Diagnostico: req.body.Diagnostico,
          TratamentoPrescrito: req.body.TratamentoPrescrito,
          MedicacaoPrescrita: req.body.MedicacaoPrescrita,
          FerramentaTerapeutica: req.body.FerramentaTerapeutica,
          ProgressoPaciente: req.body.ProgressoPaciente,
          RecomendacoesFuturas: req.body.RecomendacoesFuturas,
        }
        const response = res
        
        console.log(req.body)
        CreatingDoctorLaudo(body, response)
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
          Diagnostico: req.body.Diagnostico,
          Tratamento: req.body.Tratamento,
          Medicacao: req.body.Medicacao,
          FerramentasTerapeuticas: req.body.FerramentaTerapeutica,
          Progresso: req.body.Progresso,
          SolicitacaoMedicamentos: req.body.SolicitacaoMedicamentos,
          SolicitacaoMateriais: req.body.SolicitacaoMateriais,
          SolicitacaoExames: req.body.SolicitacaoExames,
          RecomendacoesFuturas: req.body.RecomendacoesFuturas,
          EstadoPaciente: req.body.EstadoPaciente,
          Solicitacao: req.body.Solicitacao,
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
      
      ValidatorDocuments(id,res)
      console.log(req.body)
      }
)
export default router