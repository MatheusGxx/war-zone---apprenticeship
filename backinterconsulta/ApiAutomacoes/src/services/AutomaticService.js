import { getClient, CreateInstance, EnviarMensagem, BulkMassage } from "../utils/Functions/Whatsapp.js";
import { models } from '../../MongoDB/Schemas/Schemas.js'
import { EmailQueue } from "../utils/Queues.js"
import { WhatsappQueue } from "../utils/Queues.js"
import { ResumoQueue } from '../utils/Queues.js' 

export const AutomaticWhatsapp = async (body, res) => {
  const { 
     IdentificadorMedico,
     IdentificadorPaciente,
     IdentificadorUnidade,
     IdentificadorObrigadoMedico,
     IdentificadorObrigadoPaciente, 
     IdentificadorObrigadoUnidade,
     IdentificadorUnidadeSaudeRoute,
     IdentificadorPacientePublico,
     IdentificadorPacienteParticular,
     TelefoneMedicoAgendamento,
     EmailMedico,
     NomeMedico,
     NomePaciente,
     DataAgendamento,
     InicioAgendamento,
     FimAgendamento,
     EmailPacienteAceitouConsulta,
     NomeMedicoAceitouConsulta,
     NumeroPacienteAceitouConsulta,
     NomePacienteAceitouConsulta,
     DataAceitouConsulta,
     InicioAceitouConsulta,
     FimAceitouConsulta,
     EmailPacienteRejeitouConsulta,
     NomeMedicoRejeitouConsulta,
     NumeroPacienteRejeitouConsulta,
     NomePacienteRejeitouConsulta,
     DataRejeitouConsulta,
     InicioRejeitouConsulta,
     FimRejeitouConsulta,
     DoencaRejeitouConsulta,
     EmailMedicoExclusao,
     NumeroMedicoExclusao,
     NomeMedicoExclusao,
     NomePacienteExclusao,
     DataExclusaoPaciente,
     InicioExlusaoPaciente,
     FimExclusaoPaciente,
     FichaPaciente,
     Diagnostico,
     Tratamento,
     FerramentasTerapeuticas,
     Progresso,
     SolicitacaoMateriais,
     RecomendacoesFuturas,
     EstadoPaciente,
     ReceitaSimples,
     ReceitaControlada,
     Atestado,
     Exame,
     result,
     route 
  } = body

  try {

    
   // let SecretariaIAOpen = false

    if (!getClient()) {
    await CreateInstance();
    }

    //if (!SecretariaIAOpen) {
    //SecretariaIA(getClient());
    //SecretariaIAOpen = true
//}

    switch (route) {  
         /* -----------------------  Cadastro Inicial  --------------------------- */
      
      case '/welcome/login-medico/cadastro-medico':
        const dataMedico = await models.ModelRegisterMédico.findById(IdentificadorMedico)

        const UrlMedico = `https://interconsulta.org/welcome/login-medico/cadastro-medico/obrigado-medico?id=${dataMedico._id}`

        const messageMedico = `Ola Dr(a) ${dataMedico.nome}, Nos do interconsulta ficamos felizes por você se cadastrar na nossa plataforma. Para finalizar o seu cadastro e ter acesso aos nossos casos clínicos, clique no link abaixo:\n${UrlMedico}`
        const EmailDoctor = dataMedico.email
        const NomeMedicoL = dataMedico.nome

        await WhatsappQueue.add('Whatsapp Fila', {
          numero:`${dataMedico.telefone}`,
          mensagem: messageMedico
        })

        await EmailQueue.add('Email Fila',
        {
          to: EmailDoctor, 
          subject: `Ola Dr(a) ${NomeMedicoL} Seja bem vindo`,
          message: messageMedico
        })
        
        break

      case '/welcome/login-paciente/cadastro-paciente':
        const dataPaciente = await models.ModelRegisterPaciente.findById(IdentificadorPaciente)
    
        const urlPaciente = `https://interconsulta.org/welcome/login-paciente/cadastro-paciente/obrigado-paciente?id=${dataPaciente._id}`

        const messagePaciente = `Ola Paciente ${dataPaciente.nome}, Nos do interconsulta ficamos felizes por você se cadastrar na nossa plataforma. Para finalizar o seu cadastro e ter acesso aos nossos especialistas para tratar a sua dor, clique no link abaixo:\n${urlPaciente}`

        await WhatsappQueue.add('Whatsapp Fila', {
          numero:`${dataPaciente.telefone}`,
          mensagem: messagePaciente
        })

        await EmailQueue.add('Email Fila',
        {
          to: `${dataPaciente.email}`, 
          subject: `Ola Paciente ${dataPaciente.nome} Seja bem vindo`,
          message: messagePaciente
        })
        
      
        break;

      case '/welcome/login-unidade/cadastro-unidade':
        const dataUnidade = await models.ModelRegisterUnidadeSaude.findById(IdentificadorUnidade)
     
        const urlUnidade = `https://interconsulta.org/welcome/login-unidade/cadastro-unidade/obrigado-unidade?id=${dataUnidade._id}`

        const messageUnidade = `Ola Unidade de Saude ${dataUnidade.nome}, Nos do interconsulta ficamos felizes por você se cadastrar na nossa plataforma. Para finalizar o seu cadastro e ter acesso aos nossos especialistas para resolver todos os seus casos clinicos, clique no link abaixo:\n${urlUnidade}`

        await WhatsappQueue.add('Whatsapp Fila', {
          numero:`${dataUnidade.telefone}`,
          mensagem: messageUnidade
        })

        await EmailQueue.add('Email Fila',
        {
          to: `${dataUnidade.email}`, 
          subject: `Ola Dr(a) ${dataUnidade.nome} Seja bem vindo`,
          message: messageUnidade
        })
        
        break

     /* -----------------------  Cadastro Final  --------------------------- */
     
      case '/welcome/login-medico/cadastro-medico/obrigado-medico':
         const dataObrigadoMedico = await models.ModelRegisterMédico.findById(IdentificadorObrigadoMedico)

         const UrlObrigadoMédico = `https://interconsulta.org/casos-clinicos`
   
         const messageObrigadoMedico = `Parabens ${dataObrigadoMedico.NomeEspecialista} agora voce é Oficialmente ${dataObrigadoMedico.EspecialidadeMedica} do #Interconsulta e ja pode atender todos os nossos casos clinicos disponiveis, clicando no Link Abaixo!\n${UrlObrigadoMédico}`
 
         await WhatsappQueue.add('Whatsapp Fila', {
          numero:`${dataObrigadoMedico.telefone}`,
          mensagem: messageObrigadoMedico
        })

        await EmailQueue.add('Email Fila',
        {
          to: `${dataObrigadoMedico.email}`, 
          subject: `Parabens ${dataObrigadoMedico.NomeEspecialista}`,
          message: messageObrigadoMedico
        })
        
    
       break

      case '/welcome/login-paciente/cadastro-paciente/obrigado-paciente':
         const dataObrigadoPaciente = await models.ModelRegisterPaciente.findById(IdentificadorObrigadoPaciente)

         const UrlObrigadoPaciente = `https://interconsulta.org/especialistas-disponiveis`;

   
         const messageObrigadoPaciente = `Parabens ${dataObrigadoPaciente.nome} agora voce se tornou um paciente do #interconsulta e pode escolher qualquer um de nossos especialistas para apresentar resolver ${dataObrigadoPaciente.Doenca}, basta apenas clicar no link Abaixo!\n${UrlObrigadoPaciente}`
 
         await WhatsappQueue.add('Whatsapp Fila', {
          numero:`${dataObrigadoPaciente.telefone}`,
          mensagem: messageObrigadoPaciente
        })

        await EmailQueue.add('Email Fila',
        {
          to: `${dataObrigadoPaciente.email}`, 
          subject: `Parabens ${dataObrigadoPaciente.nome}`,
          message: messageObrigadoPaciente
        })
        
    
    
       break

      case '/welcome/login-unidade/cadastro-unidade/obrigado-unidade':
         const dataObrigadoUnidade = await models.ModelRegisterUnidadeSaude.findById(IdentificadorObrigadoUnidade)

         const urlObrigadoUnidade = `https://interconsulta.org/unidade-especialista`
   
         const messageObrigadoUnidade = `Parabens ${dataObrigadoUnidade.nome} agora voce se tornou uma oficialmente uma Unidade de Saude do #Interconsulta para subir todos os seus casos clinicos e achar os especialistas para atende-los clique no Link abaixo!\n${urlObrigadoUnidade}`
 
         await WhatsappQueue.add('Whatsapp Fila', {
          numero:`${dataObrigadoUnidade.telefone}`,
          mensagem: messageObrigadoUnidade
        })

        await EmailQueue.add('Email Fila',
        {
          to: `${dataObrigadoMedico.email}`, 
          subject: `Parabens ${dataObrigadoUnidade.nomeInstituicao}`,
          message: messageObrigadoUnidade
        })
        
       break
       /////////////////// Unidade de Saude /////////////// 
       /*case '/unidade-especialista':
      
       const dataPlataformUnidade = await models.ModelRegisterMédico.find({ _id: { $in:  IdentificadorUnidadeSaudeRoute} });

        const getTelefoneDoctor = dataPlataformUnidade.map((data) => {
          return data.telefone
        })
        console.log(`Telefone dos médicos: ${getTelefoneDoctor}`)

        BulkMassage(getTelefoneDoctor, `Ola Doutor Temos novos casos clinicos quentinhos saindo do forno para voce, para ter acesso a eles acesse agora ${`https://interconsulta.org/casos-clinicos`}`, res)
        break*/



        //Sangue Compativel Paciente
        //case '/especialistas-disponiveis':

        //const getPacientesPublicos = await models.ModelCasosClinicos.find({ 
          //'Historico.Telefone': {$in: IdentificadorPacientePublico}
        //})

        //const getNamesPacientesPublicos = getPacientesPublicos.NomePaciente

        //const getPacienteParticular = await models.ModelRegisterPaciente.findById( IdentificadorPacienteParticular)

        //const getNamesPaciente = getPacienteParticular.nome
        
        //BulkMassage(IdentificadorPacientePublico, `Ola\n${getNamesPaciente} esta precisando da sua doaçao.\nCaso esteja disponivel #SalveMaisUm!\nAgende sua doaçao em Link Homocentro:`, res)
        //break

        case '/especialistas-disponiveis-agendamento':

        await WhatsappQueue.add('Whatsapp Fila', {
          numero:`${TelefoneMedicoAgendamento}`,
          mensagem: `Ola ${NomeMedico}, o Paciente, ${NomePaciente} agendou uma consulta com voce\nna Data de ${DataAgendamento} as ${InicioAgendamento} a ${FimAgendamento} Entre no Link abaixo para confirmar a sua consulta:\nwww.interconsulta.org/agenda`
        })

        await EmailQueue.add('Email Fila',
        {
          to: `${EmailMedico}`, 
          subject: `${NomeMedico} voce tem uma nova consulta marcada!`,
          message:`Ola ${NomeMedico}, o Paciente, ${NomePaciente} agendou uma consulta com voce\nna Data de ${DataAgendamento} as ${InicioAgendamento} a ${FimAgendamento} Entre no Link abaixo para confirmar a sua consulta:\nwww.interconsulta.org/agenda`
        })
        
        break

        case '/confirmaçao-consulta-medico':

        await WhatsappQueue.add('Whatsapp Fila', {
          numero:`${NumeroPacienteAceitouConsulta}`,
          mensagem:`${NomeMedicoAceitouConsulta} Informa: Ola ${NomePacienteAceitouConsulta} acabei de aceitar a consulta\nda Data de: ${DataAceitouConsulta} que começa das ${InicioAceitouConsulta} a ${FimAceitouConsulta}\nentre agora na sua agenda para acessar o Link da consulta:\nwww.interconsulta.org/agenda`
        })

        await EmailQueue.add('Email Fila',
        {
          to: `${EmailPacienteAceitouConsulta}`, 
          subject: `Ola Paciente ${NomeMedicoAceitouConsulta}, o médico aceitou a sua consulta`,
          message:`${NomeMedicoAceitouConsulta} Informa: Ola ${NomePacienteAceitouConsulta} acabei de aceitar a consulta\nda Data de: ${DataAceitouConsulta} que começa das ${InicioAceitouConsulta} a ${FimAceitouConsulta}\nentre agora na sua agenda para acessar o Link da consulta:\nwww.interconsulta.org/agenda`
        })

        break
        case '/rejeicao-consulta-medico':

        await WhatsappQueue.add('Whatsapp Fila', {
          numero:`${NumeroPacienteRejeitouConsulta}`,
          mensagem:`${NomeMedicoRejeitouConsulta} Informa: Ola ${NomePacienteRejeitouConsulta}, infelizmente tive que cancelar a nossa consulta\nda Data de: ${DataRejeitouConsulta} que começa das ${InicioRejeitouConsulta} a ${FimRejeitouConsulta}\nmas nao desanime voce pode marcar outra consulta comigo em outro horario agora mesmo! entre no link abaixo e agende de novo comigo agora mesmo!\nwww.interconsulta.org/especialistas-disponiveis`
        })

        await EmailQueue.add('Email Fila',
        {
          to: `${EmailPacienteRejeitouConsulta}`, 
          subject:`Ola Paciente ${NomePacienteRejeitouConsulta}, infelizmente o médico cancelou a sua consulta`,
          message:`${NomeMedicoRejeitouConsulta} Informa: Ola ${NomePacienteRejeitouConsulta}, infelizmente tive que cancelar a nossa consulta\nda Data de: ${DataRejeitouConsulta} que começa das ${InicioRejeitouConsulta} a ${FimRejeitouConsulta}\nmas nao desanime voce pode marcar outra consulta comigo em outro horario agora mesmo! entre no link abaixo e agende de novo como agora mesmo!\nwww.interconsulta.org/especialistas-disponiveis`
        })

        break

        case '/exclusion-consulta-paciente':

        await WhatsappQueue.add('Whatsapp Fila', {
          numero:`${NumeroMedicoExclusao}`,
          mensagem: `Ola ${NomeMedicoExclusao}, Passando pra te avisar que o Paciente ${NomePacienteExclusao} cancelou a consulta da Data: ${DataExclusaoPaciente} das ${InicioExlusaoPaciente} a ${FimExclusaoPaciente} de voces.`
        })

        await EmailQueue.add('Email Fila',
        {
          to: `${EmailMedicoExclusao}`, 
          subject: `Ola ${NomeMedicoExclusao}, o Paciente cancelou a sua consulta =/`,
          message: `Ola ${NomeMedicoExclusao}, Passando pra te avisar que o Paciente ${NomePacienteExclusao} cancelou a consulta da Data: ${DataExclusaoPaciente} das ${InicioExlusaoPaciente} a ${FimExclusaoPaciente} de voces.`
        })

        break

       case '/resumo-casos-clinicos':
         await ResumoQueue.add('Resumo', {
          FichaPaciente,
          Diagnostico,
          Tratamento,
          FerramentasTerapeuticas,
          Progresso,
          SolicitacaoMateriais,
          RecomendacoesFuturas,
          EstadoPaciente,
          ReceitaSimples,
          ReceitaControlada,
          Atestado,
          Exame,
          result
         })
        break

      default:
         res.status(404).json({ message: 'Rota Invalida'})
        break;
    }

  } catch (e) {
    console.log(e)
  }
};
