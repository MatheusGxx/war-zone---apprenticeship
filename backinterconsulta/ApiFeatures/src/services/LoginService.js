import { 
   VerifyLogin,
   VerifyRegister, 
} from "../utils/zodVerify.js"
import { VefiryData } from '../utils/Functions/VerifyPersona.js'
import { getUserByEmail } from "../utils/Functions/VerifyEmailAuth.js"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { models } from "../../MongoDB/Schemas/Schemas.js"
import { Criptografia } from "../utils/Functions/Criptografia.js"
import axios from 'axios'
import slugfy from 'slugify'
import { ConvertingIdadee } from "../utils/Functions/Converting.js"

const secretKey = crypto.randomBytes(32).toString('hex')

export const Login = async (body, res) =>{
  const { email, senha, route } = body

  try{ 
    VerifyLogin.parse(body)
    console.log('Schema Validado')
  }catch(e){
    console.log(e)
  }

  const user = await getUserByEmail(email, route)

  if(!user){
    return res.status(401).json({error: 'Ops voce nao esta cadastrado =/'})
  }
  const ComparePassword =  bcrypt.compare(senha, user.senha)

  if(!ComparePassword){
    return res.status(401).json({error: 'Senha incorreta'})
  }

  const token = jwt.sign({userId: user._id}, secretKey, {expiresIn: '1h'})

  const ModelidUserLogged =  user._id
  
  switch (route) {
    case '/welcome/login-medico':
      const QueryMedico = await models.ModelRegisterMédico.findOne({ email: user.email})

      const NomeMedico = QueryMedico.NomeEspecialista
      const AreaAtuacao = QueryMedico.AreadeAtuacao
      const CRMM = QueryMedico.CRM
      const getFotoMedico = QueryMedico.Foto
      const FotoMedico = getFotoMedico ? getFotoMedico : null

      return res.status(200).json({ token, NomeMedico, AreaAtuacao, CRMM, ModelidUserLogged, FotoMedico })

    case '/welcome/login-paciente':
      const QueryPaciente = await models.ModelRegisterPaciente.findOne({ email: user.email})

      const NomePaciente = QueryPaciente.nome
      const DoencaPaciente = QueryPaciente.Doenca
      const getFotoPaciente = QueryPaciente.Foto
      const FotoPaciente = getFotoPaciente ? getFotoPaciente : null

      return res.status(200).json({ token, NomePaciente, DoencaPaciente, ModelidUserLogged, FotoPaciente })

    case '/welcome/login-unidade':

    const QueryUnidade = await models.ModelRegisterUnidadeSaude.findOne({ email: user.email})
    const NomeUnidade = QueryUnidade.nomeInstituicao
    const getFotoUnidade = QueryUnidade.Foto
    const FotoUnidade = getFotoUnidade ? getFotoUnidade : null

    return res.status(200).json({ token, NomeUnidade, ModelidUserLogged, FotoUnidade })
      
    default:
      console.log('Rota para enviar os dados no endpoint de valor invalida');
      return null
  }
}

export const Register = async (body, res) =>{
  const { nome, senha, email, telefone, route } = body

  try{
    VerifyRegister.parse(body)
    console.log('Schema Validado')
  }catch(e){
   console.log(e)
  }

  let error = null;

  switch (route) {

    case '/welcome/login-medico/cadastro-medico':

      if (!!await models.ModelRegisterMédico.findOne({ email }) || !!await models.ModelRegisterMédico.findOne({ telefone })) {
        error = 'Email ou telefone já estão em uso por outros Médicos';
      } else {
        const newPassword = await Criptografia(senha);
        const newMedico = new models.ModelRegisterMédico({
          nome,
          senha: newPassword,
          email,
          telefone,
        });

        const savedMedico = await newMedico.save()

        res.status(200).json({ _id: savedMedico._id });

        const IdentificadorMedico =  savedMedico._id

        const idMédico = {
          IdentificadorMedico,
          route
        } 
        
        //Production
        axios.post('http://back-a:8081/api/automatic-whatsapp', idMédico)
        //Development
        //axios.post('http://localhost:8081/api/automatic-whatsapp', idMédico)
      }
      break;

    case '/welcome/login-paciente/cadastro-paciente':
      if (!!await models.ModelRegisterPaciente.findOne({ email }) || !!await models.ModelRegisterPaciente.findOne({ telefone })) {
        error = 'Email ou telefone já estão em uso por outros Pacientes';
      } else {
        const newPassword = await Criptografia(senha);
        const newPaciente = new models.ModelRegisterPaciente({
          nome,
          senha: newPassword,
          email,
          telefone,
        })

       const savedPaciente = await newPaciente.save()

       res.status(200).json({ _id: savedPaciente._id });

       const IdentificadorPaciente =  savedPaciente._id

       const idPaciente = {
         IdentificadorPaciente,
         route
       }
       
       //Production
       axios.post('http://back-a:8081/api/automatic-whatsapp', idPaciente)
       //Development
       //axios.post('http://localhost:8081/api/automatic-whatsapp', idPaciente)

      }
      break;

    case '/welcome/login-unidade/cadastro-unidade':
      if (!!await models.ModelRegisterUnidadeSaude.findOne({ email }) || !!await models.ModelRegisterUnidadeSaude.findOne({ telefone })) {
        error = 'Email ou telefone já estão em uso por outra Unidade de Saude';
      } else {
        const newPassword = await Criptografia(senha);
        const newUnidade = new models.ModelRegisterUnidadeSaude({
          nome,
          senha: newPassword,
          email,
          telefone,
        });
        const savedUnidade = await newUnidade.save()

        res.status(200).json({ _id: savedUnidade._id })

        const IdentificadorUnidade =  savedUnidade._id

        const idUnidade = {
          IdentificadorUnidade,
          route,
        }
        
        //Production
        axios.post('http://back-a:8081/api/automatic-whatsapp', idUnidade)
        //Development
        //axios.post('http://localhost:8081/api/automatic-whatsapp', idUnidade)
      }
      break;

    default:
      error = 'Rota Invalida';
  }

  if (error) {
    return res.status(400).json({ error });
  }
}

export const RegisterEnd = async (body, params, file, res) =>{

  
   const { 
    NomeConhecido, 
    TituloEspecialista, 
    FormacaoEspecialista, 
    AnoGraduacao, 
    PosGraduacao, 
    EspecialidadeMedica, 
    AreadeAtuacao, 
    CRM, 
    InstituicaoResidencia, 
    DataNascimento, 
    RQE, 
    Certificacao, 
    PrecoConsulta, 
    ResumoProfissional, 
    FerramentasTerapeuticas,
    Slug,
    NomeTitular,
    NumeroConta,
    NumeroAgencia,
    Banco,
    ChavePix,
    CPNJMedico,
    RazaoSocialEmpresa,
    NomeFantasia,
    EnderecoMedico,
    Bairro,
    Cidade,
    Estado,
    CEPMedico,
    EmailContador,
    TelefoneContador,
    Genero, 
    Data, 
    Doenca, 
    TipoSanguineo,
    EstadoCivil, 
    Profissao, 
    CPF, 
    CEP,
    EnderecoPaciente,
    CidadePaciente, 
    EstadoPaciente, 
    Pais, 
    CartaoSUS, 
    NomeAcompanhante, 
    TelefoneAcompanhante, 
    EmailAcompanhante,


    Endereco, 
    nomeInstituicao, 
    CPNJ, 
    EspecialidadeDesejada, 
    route } = body

   const { id } = params
   
  /*try{
  const dataMedico = { NomeConhecido, TituloEspecialista, FormacaoEspecialista,  AnoGraduacao, PosGraduacao, EspecialidadeMedica, AreadeAtuacao, CRM,  InstituicaoResidencia, DataNascimento, RQE, Certificacao, PrecoConsulta, ResumoProfissional,  FerramentasTerapeuticas, Slug, NomeTitular, NumeroConta, NumeroAgencia, Banco, ChavePix,  CPNJMedico, RazaoSocialEmpresa,NomeFantasia,  EnderecoMedico, Bairro,Cidade, Estado, CEPMedico, EmailContador,
  TelefoneContador,}

  const dataPaciente = { Genero, Data, Doenca, TipoSanguineo, EstadoCivil, Profissao, CPF, CEP,  EnderecoPaciente, CidadePaciente, EstadoPaciente, Pais, CartaoSUS, NomeAcompanhante, TelefoneAcompanhante, EmailAcompanhante, }

  const dataUnidade = { Endereco, nomeInstituicao, CPNJ, EspecialidadeDesejada }
   

   VefiryData(route, dataMedico, dataPaciente, dataUnidade )
   }catch(e){
    console.log(e)
   }*/
   
  let error = null

  switch(route){
    case '/welcome/login-medico/cadastro-medico/obrigado-medico':

      let Médico = await models.ModelRegisterMédico.findById(id)

      if(!Médico){
        return res.status(404).json({message: 'Médico nao esta cadastrado no banco de dados'})
      }
    
      if(Médico){

        const NomeEspecialista = TituloEspecialista + " " + NomeConhecido
        const NomeEspecialistaSemPonto = NomeEspecialista.replace('.', '')


        // ------------------------!! Slug Dinamico !!----------------------//

        const PurificationSlug = 
        slugfy(NomeEspecialistaSemPonto, 
          { 
            replacement: '-', remove: undefined, lower: true, strict: false, trim: true 
          })

        let EndSlug = PurificationSlug
  
        let QuerySlug = await models.ModelRegisterMédico.findOne({ Slug: EndSlug });
  
        if (QuerySlug) {

          let counter = 1

          while (QuerySlug) { // Enquanto existir o slug no DB o looping vai ocorrer
            EndSlug = `${PurificationSlug}-${counter}` // atribuindo o counter 1 no slug
            QuerySlug = await models.ModelRegisterMédico.findOne({ Slug: EndSlug }); // Verifica se o novo Slug com o contador já existe no DB. Se existir o counter++ percorre todos os numeros de slugs cadastrados no db e adiciona um numero novo com um valor adicional +1 no novo Slug.
            counter++
          }
        }

           // ------------------------!! Slug Dinamico !!----------------------//

        try{

          Médico.NomeEspecialista = NomeEspecialista
          Médico.NomeConhecido = NomeConhecido
          Médico.TituloEspecialista = TituloEspecialista
          Médico.FormacaoEspecialista = FormacaoEspecialista
          Médico.AnoGraduacao = AnoGraduacao
          Médico.QuantidadeTempoAnoGraduacao = ConvertingIdadee(AnoGraduacao)
          Médico.PosGraduacao = PosGraduacao
          Médico.AreadeAtuacao = AreadeAtuacao
          Médico.EspecialidadeMedica = EspecialidadeMedica
          Médico.CRM = CRM
          Médico.InstituicaoResidencia = InstituicaoResidencia
          Médico.DataNascimento = DataNascimento 
          Médico.Idade = ConvertingIdadee(DataNascimento)
          Médico.RQE = RQE
          Médico.Certificacao = Certificacao
          Médico.PrecoConsulta = PrecoConsulta
          Médico.ResumoProfissional = ResumoProfissional
          Médico.FerramentasTerapeuticas =  FerramentasTerapeuticas
          Médico.Slug = EndSlug
          Médico.NomeTitular = NomeTitular
          Médico.NumeroConta = NumeroConta
          Médico.NumeroAgencia = NumeroAgencia
          Médico.Banco = Banco
          Médico.ChavePix = ChavePix
          Médico.CPNJMedico = CPNJMedico,
          Médico.RazaoSocialEmpresa = RazaoSocialEmpresa,
          Médico.NomeFantasia = NomeFantasia
          Médico.EnderecoMedico = EnderecoMedico,
          Médico.Bairro = Bairro,
          Médico.Cidade = Cidade,
          Médico.Estado = Estado,
          Médico.CEPMedico = CEPMedico,
          Médico.EmailContador = EmailContador,
          Médico.TelefoneContador = TelefoneContador,
          Médico.Foto = file
        
          await Médico.save();

          const token = jwt.sign({userId: Médico._id}, secretKey, {expiresIn: '1h'})


          const NomeMedico = Médico.NomeEspecialista
          const AreaAtuacao = Médico.AreadeAtuacao
          const CRMM = Médico.CRM
          const getFotoMedico = Médico.Foto
          const FotoMedico = getFotoMedico ? getFotoMedico : null
        
          res.status(200).
          json({ token, 
                 NomeMedico, 
                 AreaAtuacao,
                 CRMM,
                 FotoMedico
               })
          
          const IdentificadorObrigadoMedico =  Médico._id

          const dataMedico = {
            IdentificadorObrigadoMedico,
            route
          }
          
          //Production
          axios.post('http://back-a:8081/api/automatic-whatsapp', dataMedico)
          //Development
          //axios.post('http://localhost:8081/api/automatic-whatsapp', dataMedico)
        
          }catch(err){
            console.log(err)
          }
       
      }else{
        error = 'Erro ao tentar salvar os dados finais do Médico'
      }
      break
      case '/welcome/login-paciente/cadastro-paciente/obrigado-paciente':
        case '/especialistas-disponiveis':
        

      let Paciente = await models.ModelRegisterPaciente.findById(id)

      if(!Paciente){
        res.status(404).json({message: 'Paciente nao esta cadastrado no banco de dados =/'})
      }
  
       if(Paciente){

        if(CPF){
          try{
            Paciente.Genero = Genero
            Paciente.Data = Data
            Paciente.CPF = CPF
            Paciente.CEP = CEP
            Paciente.TipoSanguineo = TipoSanguineo
            Paciente.EstadoCivil = EstadoCivil
            Paciente.Profissao = Profissao
            Paciente.Foto = file
            Paciente.Idade = ConvertingIdadee(Data)
            Paciente.EnderecoPaciente = Endereco,
            Paciente.CidadePaciente = Cidade,
            Paciente.EstadoPaciente = Estado,
            Paciente.Pais = Pais,
            Paciente.CartaoSUS = CartaoSUS
            Paciente.NomeAcompanhante = NomeAcompanhante
            Paciente.TelefoneAcompanhante = TelefoneAcompanhante
            Paciente.EmailAcompanhante = EmailAcompanhante
            Paciente.save()

            const NomePaciente = Paciente.nome
            const PacienteDoenca = Paciente.Doenca
            const getFotoPaciente = Paciente.Foto ? Paciente.Foto : null
            const FotoPaciente = getFotoPaciente
            const token = jwt.sign({userId: Paciente._id}, secretKey, {expiresIn: '1h'})
            
            res.status(200)
            .json({ 
                    token,
                    NomePaciente, 
                    PacienteDoenca,
                    FotoPaciente
                  })

        }catch(err){
            console.log(err)
          }
          
        }else{
          try{
            Paciente.Doenca = Doenca
            Paciente.GifDoenca = `icons-doencas/${Doenca}.gif`
            await Paciente.save()

            const token = jwt.sign({userId: Paciente._id}, secretKey, {expiresIn: '1h'})

            const NomePaciente = Paciente.nome
            const PacienteDoenca = Paciente.Doenca
          
            res.status(200)
            .json({ 
                    token,
                    NomePaciente, 
                    PacienteDoenca,
                  })

            const IdentificadorObrigadoPaciente =  Paciente._id

            const dataPaciente = {
              IdentificadorObrigadoPaciente,
              route
            }
 
            //Production
             axios.post('http://back-a:8081/api/automatic-whatsapp', dataPaciente)
            //Development
            //axios.post('http://localhost:8081/api/automatic-whatsapp', dataPaciente)
        }catch(error){
          throw new Error(error)
        }
      }
      
      }else{
        error = 'Erro ao tentar salvar os dados finais do Paciente'
      }
      break
    case '/welcome/login-unidade/cadastro-unidade/obrigado-unidade':

      let Unidade = await models.ModelRegisterUnidadeSaude.findById(id)

      if(!Unidade){
          res.status(404).json({message: 'Paciente nao esta cadastrado no banco de dados =/'})
       }
      if(Unidade){

        try{
        
        Unidade.Endereco = Endereco
        Unidade.nomeInstituicao = nomeInstituicao
        Unidade.CPNJ = CPNJ
        Unidade.EspecialidadeDesejada = EspecialidadeDesejada
        Unidade.Foto = file

        await Unidade.save()
             
        const token = jwt.sign({userId: Unidade._id}, secretKey, {expiresIn: '1h'})

        const NomeUnidade = Unidade.nomeInstituicao
        const getFotoUnidade = Unidade.Foto
        const FotoUnidade = getFotoUnidade ? getFotoUnidade : null
        
        res.status(200)
        .json({
              token, 
              NomeUnidade,
              FotoUnidade
             })

        const IdentificadorObrigadoUnidade =  Unidade._id

        const dataUnidade = {
          IdentificadorObrigadoUnidade,
          route
        }
        
        //Production
         axios.post('http://back-a:8081/api/automatic-whatsapp', dataUnidade)
        //Development
        //axios.post('http://localhost:8081/api/automatic-whatsapp', dataUnidade)

        }catch(err){
          console.log(err)
        }
      }else{
        error = 'Erro ao tentar salvar os dados finais da Unidade de Saude'
      }
      break
    default:
      return res.status(404).json({message: 'Rota Invalida'})

  }

  if(error){
    return res.status(400).json({ error })
  }
}

export const getListDoencasDoctor = async (body, res) => {
  const { id , Especialidade } = body
  
    try{
      const getDoctor = await models.ModelRegisterMédico.findById(id)

      if(!getDoctor){
        return res.status(400).json({ message: 'Médico nao cadastrado no Interconsulta'})
      }
    
      const QueryEspecialidadeList = await models.List.findOne({ Especialidade: Especialidade })
    
      getDoctor.DoencasAndSintomas = QueryEspecialidadeList.DoencasESintomas
      const ImageEspecialidade = `icons/${Especialidade}.png`
    
      getDoctor.FotoEspecialidade = ImageEspecialidade
    
      getDoctor.save()
  
    }catch(error){
      console.log(error)
    }
}
