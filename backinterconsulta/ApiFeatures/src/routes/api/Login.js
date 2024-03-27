import { Router } from 'express'
import uploadPhotos from '../../utils/multerPhoto.js'
import { 
   Login,
   Register,
   RegisterEnd,
   ValidatorCodeEmail,
   UpdatePassword,
} from '../../services/LoginService.js'

const router = Router()

router.post('/login', async (req, res ) => {

   const body = {
      email: req.body.email,
      senha: req.body.senha,
      route: req.body.route
   }

   const response = res
   console.log(req.body)

   await Login(body, response)

})

router.post('/register', async (req, res ) => {

     const body ={
      nome: req.body.nome,
      senha: req.body.senha,
      email: req.body.email,
      telefone: req.body.telefone,
      route: req.body.route,
      doenca: req.body.doenca,
      typeDoctor: req.body.typeDoctor, 
      especialidade: req.body.especialidade,
      AreaAtuacao: req.body.AreaAtuacao,
      valorConsulta: req.body.valorConsulta,
      tituloEspecialista: req.body.tituloEspecialista
     }

     const response = res
     console.log(req.body)

    await Register(body, response)
})

router.post('/obrigado/:id', uploadPhotos.single("file") ,async (req, res ) => {

       console.log(req.body)
       console.log(req.params)
       console.log(req.file)
   
       const body = {
         FormacaoEspecialista: req.body.FormacaoEspecialista,
         AnoGraduacao: req.body.AnoGraduacao,
         PosGraduacao: req.body.PosGraduacao,
         DataNascimento: req.body.DataNascimento,
         CRM: req.body.CRM,
         UFCRM: req.body.UFCRM,
         InstituicaoResidencia: req.body.InstituicaoResidencia,
         RQE: req.body.RQE,
         Certificacao: req.body.Certificacao,
         ResumoProfissional: req.body.ResumoProfissional,
         FerramentasTerapeuticas: req.body. FerramentasTerapeuticas,
         NomeTitular: req.body.NomeTitular,
         NumeroConta: req.body.NumeroConta,
         NumeroAgencia: req.body.NumeroAgencia,
         Banco: req.body.Banco,
         ChavePix: req.body.ChavePix,
         CPNJMedico: req.body.CPNJMedico,
         CPFMedico: req.body.CPFMedico,
         RazaoSocialEmpresa: req.body.RazaoSocialEmpresa,
         NomeFantasia: req.body.NomeFantasia,
         EnderecoMedico: req.body.EnderecoMedico,
         Bairro: req.body.Bairro,
         Cidade: req.body.Cidade,
         Estado: req.body.Estado,
         CEPMedico: req.body.CEPMedico,
         EmailContador: req.body.EmailContador,
         TelefoneContador: req.body.TelefoneContador,
         Genero: req.body.Genero,
         Data: req.body.Data,
         Doenca: req.body.Doenca,
         TipoSanguineo: req.body.TipoSanguineo,
         EstadoCivil: req.body.EstadoCivil,
         Profissao: req.body.Profissao,
         CPF: req.body.CPF,
         CEP: req.body.CEP,
         EnderecoPaciente: req.body.EnderecoPaciente,
         CidadePaciente: req.body.CidadePaciente,
         EstadoPaciente: req.body.EstadoPaciente,
         Pais: req.body.Pais,
         CartaoSUS: req.body.CartaoSUS,
         NomeAcompanhante: req.body.NomeAcompanhante,
         TelefoneAcompanhante: req.body.TelefoneAcompanhante,
         EmailAcompanhante: req.body.EmailAcompanhante,
         EspecialidadePaciente: req.body.EspecialidadePaciente,
         Endereco: req.body.Endereco,
         nomeInstituicao: req.body.nomeInstituicao,
         CPNJ: req.body.CPNJ,
         EspecialidadeDesejada: req.body.EspecialidadeDesejada,
         route: req.body.route,
       }

       const params = {
         id: req.params.id
       }

       const file = req.file

       const PathFoto = file ? file.path : null
       const response = res
       await RegisterEnd(body, params, PathFoto, response)

})

router.post('/validator-code-email', 
      async(req, res) => {
         const { code, person } = req.body
         ValidatorCodeEmail(code, person, res)
        console.log(req.body)
      }
)

router.post('/update-password',
      async(req, res) => {
       const { id, newPassword, person } = req.body
       UpdatePassword(id, newPassword, person, res)
       console.log(req.body)
      }
)


export default router

