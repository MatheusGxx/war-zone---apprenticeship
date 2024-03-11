import { getClient, CreateInstance } from "../utils/Functions/Whatsapp.js";
import { models } from '../../MongoDB/Schemas/Schemas.js'
import { EmailQueue, WhatsappQueue, ResumoQueue, SendDocumentsQueue, BulkMessageQueueConfirmation } from "../utils/Queues.js"

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
     NomePacienteWarningDoctorNotHorarios,
     idMedicoWarningDoctorNotHorarios,
     route,
     
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

        await WhatsappQueue.add('Whatsapp', {
          numero:`${dataMedico.telefone}`,
          mensagem: messageMedico
        })

        await EmailQueue.add('Email',
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

        await WhatsappQueue.add('Whatsapp', {
          numero:`${dataPaciente.telefone}`,
          mensagem: messagePaciente
        })

        await EmailQueue.add('Email',
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

        await WhatsappQueue.add('Whatsapp', {
          numero:`${dataUnidade.telefone}`,
          mensagem: messageUnidade
        })

        await EmailQueue.add('Email',
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
 
         await WhatsappQueue.add('Whatsapp', {
          numero:`${dataObrigadoMedico.telefone}`,
          mensagem: messageObrigadoMedico
        })

        await EmailQueue.add('Email',
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
 
         await WhatsappQueue.add('Whatsapp', {
          numero:`${dataObrigadoPaciente.telefone}`,
          mensagem: messageObrigadoPaciente
        })

        await EmailQueue.add('Email',
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
 
         await WhatsappQueue.add('Whatsapp', {
          numero:`${dataObrigadoUnidade.telefone}`,
          mensagem: messageObrigadoUnidade
        })

        await EmailQueue.add('Email',
        {
          to: `${dataObrigadoUnidade.email}`, 
          subject: `Parabens ${dataObrigadoUnidade.nomeInstituicao}`,
          message: messageObrigadoUnidade
        })
        
       break
       
        case '/especialistas-disponiveis-agendamento':

        await WhatsappQueue.add('Whatsapp', {
          numero:`${TelefoneMedicoAgendamento}`,
          mensagem: `Ola ${NomeMedico}, o Paciente, ${NomePaciente} agendou uma consulta com voce\nna Data de ${DataAgendamento} as ${InicioAgendamento} a ${FimAgendamento} Entre no Link abaixo para confirmar a sua consulta:\nwww.interconsulta.org/agenda`
        })

        await EmailQueue.add('Email',
        {
          to: `${EmailMedico}`, 
          subject: `${NomeMedico} voce tem uma nova consulta marcada!`,
          message:`Ola ${NomeMedico}, o Paciente, ${NomePaciente} agendou uma consulta com voce\nna Data de ${DataAgendamento} as ${InicioAgendamento} a ${FimAgendamento} Entre no Link abaixo para confirmar a sua consulta:\nwww.interconsulta.org/agenda`
        })
        
        break

        case '/confirmaçao-consulta-medico':

        await WhatsappQueue.add('Whatsapp', {
          numero:`${NumeroPacienteAceitouConsulta}`,
          mensagem:`${NomeMedicoAceitouConsulta} Informa: Ola ${NomePacienteAceitouConsulta} acabei de aceitar a consulta\nda Data de: ${DataAceitouConsulta} que começa das ${InicioAceitouConsulta} a ${FimAceitouConsulta}\nentre agora na sua agenda para acessar o Link da consulta:\nwww.interconsulta.org/agenda`
        })

        await EmailQueue.add('Email',
        {
          to: `${EmailPacienteAceitouConsulta}`, 
          subject: `Ola Paciente ${NomeMedicoAceitouConsulta}, o médico aceitou a sua consulta`,
          message:`${NomeMedicoAceitouConsulta} Informa: Ola ${NomePacienteAceitouConsulta} acabei de aceitar a consulta\nda Data de: ${DataAceitouConsulta} que começa das ${InicioAceitouConsulta} a ${FimAceitouConsulta}\nentre agora na sua agenda para acessar o Link da consulta:\nwww.interconsulta.org/agenda`
        })

        break
        case '/rejeicao-consulta-medico':

        await WhatsappQueue.add('Whatsapp', {
          numero:`${NumeroPacienteRejeitouConsulta}`,
          mensagem:`${NomeMedicoRejeitouConsulta} Informa: Ola ${NomePacienteRejeitouConsulta}, infelizmente tive que cancelar a nossa consulta\nda Data de: ${DataRejeitouConsulta} que começa das ${InicioRejeitouConsulta} a ${FimRejeitouConsulta}\nmas nao desanime voce pode marcar outra consulta comigo em outro horario agora mesmo! entre no link abaixo e agende de novo comigo agora mesmo!\nwww.interconsulta.org/especialistas-disponiveis`
        })

        await EmailQueue.add('Email',
        {
          to: `${EmailPacienteRejeitouConsulta}`, 
          subject:`Ola Paciente ${NomePacienteRejeitouConsulta}, infelizmente o médico cancelou a sua consulta`,
          message:`${NomeMedicoRejeitouConsulta} Informa: Ola ${NomePacienteRejeitouConsulta}, infelizmente tive que cancelar a nossa consulta\nda Data de: ${DataRejeitouConsulta} que começa das ${InicioRejeitouConsulta} a ${FimRejeitouConsulta}\nmas nao desanime voce pode marcar outra consulta comigo em outro horario agora mesmo! entre no link abaixo e agende de novo como agora mesmo!\nwww.interconsulta.org/especialistas-disponiveis`
        })

        break

        case '/exclusion-consulta-paciente':

        await WhatsappQueue.add('Whatsapp', {
          numero:`${NumeroMedicoExclusao}`,
          mensagem: `Ola ${NomeMedicoExclusao}, Passando pra te avisar que o Paciente ${NomePacienteExclusao} cancelou a consulta da Data: ${DataExclusaoPaciente} das ${InicioExlusaoPaciente} a ${FimExclusaoPaciente} de voces.`
        })

        await EmailQueue.add('Email',
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
}


export const sendDocumentsPatient = async (id, res, files) => {
  try{
    const getDataPaciente = await models.ModelRegisterPaciente.findOne(
      { 'ConsultasSolicitadasPacientes._id': id },
    )
     
    const NomePaciente = getDataPaciente.nome
    const NumeroPaciente = getDataPaciente.telefone
    const EmailPatient = getDataPaciente.email
    const UltimaConsulta = getDataPaciente.ConsultasSolicitadasPacientes[getDataPaciente.ConsultasSolicitadasPacientes.length -1]
    const NomeMedico = UltimaConsulta.Solicitado

     await SendDocumentsQueue.add('Envio de Documentos', {
          PathsFiles: files,
          NumberPatient: NumeroPaciente,
          MensagemPaciente: `Ola ${NomePaciente} Segue, seus documentos referente a consulta com ${NomeMedico}`,
          EmailPatient: EmailPatient,
     })

     res.status(200).json({ message: 'Documentos gerados com sucesso.' })

  }catch(error){
    return res.status(500).json({ message: 'Erro Internal Server'})
  }
}




export const SavedConsultaUnidadeSaude = async (body, res) => {
  const { IDSMedicos, IDUnidade ,Solicitante, Casos, Status, CPFPacientes, DataInicioConsolidado , DataFimConsolidado, PacientesQueSuportamos, NomeUnidade } = body
   
   try {

     const getUnidade = await models.ModelRegisterUnidadeSaude.findById(IDUnidade)

     const getMedicos = await models.ModelRegisterMédico.find({
       _id: { $in:  IDSMedicos },
     })

      const getPacientes = await models.ModelCasosClinicos.find({ CPF: { $in: CPFPacientes }})
        
      const DataPatient = getPacientes.map((data) => ({
       Email: data.Email,
       NomePaciente: data.NomePaciente,
       CPFPaciente: data.CPF,
      }))

  
      const NumberPatients = getPacientes.length

     for (const medico of getMedicos) {
       const ConsultaUnidadedeSaude = {
         Data: '',
         Inicio: '',
         Fim: '',
         Solicitante: '',  
         EmailSolicitante: '',
         NumeroSolicitante:  '',
         Solicitado: '',
         EspecialidadeSolicitado: '',
         NomeUnidadeSolicitante: getUnidade.nomeInstituicao,
         FotoUnidadeSolicitante: getUnidade.Foto,
         Casos: [],
         Status: Status,
       }

       const QuantidadeCasosClinicos = Casos[0].QuantidadeCasosClinicos
   
       //const totalIntervalos = medico.Horarios.reduce((total, horario) => total + horario.IntervaloAtendimentos.length, 0)
       //const FaltamIntervalos = QuantidadeCasosClinicos - totalIntervalos;
   
       //if (FaltamIntervalos > 0) {
         //const novoHorario = await criarNoCvoHorario(medico, FaltamIntervalos);
         //medico.Horarios.push(novoHorario)
         //await medico.save()

         // Looping para multiplos Horarios Automaticos 

           
       let casosDistribuidos = 0
   
       for (const horario of medico.Horarios) {
         const intervalosAtendimentos = horario.IntervaloAtendimentos.map((data) => data.Intervalo)
         for (const intervalo of intervalosAtendimentos) {
           if (casosDistribuidos < QuantidadeCasosClinicos) {
             let novaConsulta = { ...ConsultaUnidadedeSaude }
             const intervaloParts = intervalo.split(" - ")

             novaConsulta.Inicio = intervaloParts[0]
             novaConsulta.Fim = intervaloParts[1]
             novaConsulta.Data = horario.data
   
             novaConsulta.Casos = Casos[casosDistribuidos]
             novaConsulta.Solicitante = Casos[casosDistribuidos].NomePaciente
             novaConsulta.EmailSolicitante = Casos[casosDistribuidos].Email
             novaConsulta.NumeroSolicitante = Casos[casosDistribuidos].Telefone
             novaConsulta.Solicitado = medico.NomeEspecialista
             novaConsulta.EspecialidadeSolicitado = medico.EspecialidadeMedica // Aqui temos que colocar a propriedade de Solicitante dentro do array de Casos

             medico.ConsultasUnidadedeSaude.push({ ...novaConsulta })
             casosDistribuidos++

             //Depois que o Looping terminar termos que pegar a let casosDistruidos o valor dela de quantas vezes ela passou no looping e subtrair pela Quanitdade de casos clinicos
           }
         }
       }
       
       const casosNaoDistribuidos = QuantidadeCasosClinicos - casosDistribuidos;
       const casosNaoDistribuidosLista = []

       if (casosNaoDistribuidos > 0) {
           console.log(`Ainda há ${casosNaoDistribuidos} casos clínicos não distribuídos.`)

           for (let i = casosDistribuidos; i < QuantidadeCasosClinicos; i++) {
             const caso = Casos[i]
             casosNaoDistribuidosLista.push({
                 CPF: caso.CPF,
                 NomePaciente: caso.NomePaciente,
                 Doenca: caso.Doenca
             })
         }
       }

     await models.ModelWaitList.create({ ListDeEspera: casosNaoDistribuidosLista });

     await medico.save()

     if(NumberPatients <= PacientesQueSuportamos){ // Pacientes que suportamos é maior que o numero de pacientes da Planilha
        const PacientesTotais = DataPatient

        const DataInicioConsolidadoDate = new Date(DataInicioConsolidado)
        const DataFimConsolidadoDate = new Date(DataFimConsolidado)
        
        const getPacientesTotaisAgendaMédica = await models.ModelRegisterMédico.find({
          'ConsultasUnidadedeSaude.Casos.CPF': { $in: PacientesTotais.map((data) => data.CPFPaciente) },
        }, {'ConsultasUnidadedeSaude': 1})
        
        const Datas = getPacientesTotaisAgendaMédica.flatMap((data) =>
          data.ConsultasUnidadedeSaude.flatMap(data => data.Data)
        )
        
        const datasNoIntervalo = Datas.filter(data => {
          const dataConsulta = new Date(data)
          return dataConsulta >= DataInicioConsolidadoDate && dataConsulta <= DataFimConsolidadoDate
        })

        models.ModelRegisterMédico.findOne({ 'ConsultasUnidadedeSaude.Casos.CPF': { $in: PacientesTotais.map((data) => data.CPFPaciente)} })
        .then(async medico => {
          if (!medico) {
            console.log('Médico não encontrado')
            return
          }
      
          const consultas = medico.ConsultasUnidadedeSaude.filter(consulta => {
            return datasNoIntervalo.includes(consulta.Data)
          })
          
          const NomeUnidade = getUnidade.nomeInstituicao
          const EndereçoUnidade = getUnidade.Endereco
          await BulkMessageQueueConfirmation.add('BulkMessageNotification', {
             consultas, 
             NomeUnidade,
             EndereçoUnidade
          }) 

        })
        .catch(err => {
          console.error('Erro ao buscar médico:', err)
        })
        
  

      }else if(PacientesQueSuportamos < NumberPatients){ // Tem mais pacientes na planilha do que a nossa capacidade de Atendimento
        const PacientesLimitados = DataPatient.slice(0, PacientesQueSuportamos)

        const DataInicioConsolidadoDate = new Date(DataInicioConsolidado)
        const DataFimConsolidadoDate = new Date(DataFimConsolidado)
        
        const getPacientesTotaisAgendaMédica = await models.ModelRegisterMédico.find({
          'ConsultasUnidadedeSaude.Casos.CPF': { $in: PacientesLimitados.map((data) => data.CPFPaciente) },
        }, {'ConsultasUnidadedeSaude': 1})
        
        const Datas = getPacientesTotaisAgendaMédica.flatMap((data) =>
          data.ConsultasUnidadedeSaude.flatMap(data => data.Data)
        )
        
        const datasNoIntervalo = Datas.filter(data => {
          const dataConsulta = new Date(data)
          return dataConsulta >= DataInicioConsolidadoDate && dataConsulta <= DataFimConsolidadoDate
        })

        models.ModelRegisterMédico.findOne({ 'ConsultasUnidadedeSaude.Casos.CPF': { $in: PacientesLimitados.map((data) => data.CPFPaciente)} })
        .then(async medico => {
          if (!medico) {
            console.log('Médico não encontrado')
            return
          }
      
          const consultas = medico.ConsultasUnidadedeSaude.filter(consulta => {
            return datasNoIntervalo.includes(consulta.Data)
          })
          
          const NomeUnidade = getUnidade.nomeInstituicao
          const EndereçoUnidade = getUnidade.Endereco
          await BulkMessageQueueConfirmation.add('BulkMessageNotification', {
             consultas, 
             NomeUnidade,
             EndereçoUnidade
          })
          

        })
        .catch(err => {
          console.error('Erro ao buscar médico:', err)
        })

      }

  }  
     const UnidadeSaude = await models.ModelRegisterUnidadeSaude.findById(IDUnidade)
  
     const ConsultasUnidade2 = {
       Solicitante: '',
       Solicitado: '',
       Casos: '',
       Status: '',
     }

     Casos.forEach((casosClinicos) => {
       let newConsulta = { ...ConsultasUnidade2 }
       newConsulta.Solicitante = Solicitante
       newConsulta.Solicitado = 'Médico Especialista'
       newConsulta.Casos = casosClinicos
       newConsulta.Status = Status
       UnidadeSaude.ConsultasUnidadedeSaude.push(newConsulta)
     })
 
     await UnidadeSaude.save()

     res.status(200).json({ message: 'Consultas Agendadas com Sucesso' })
 
   } catch (err) {
     console.log(err)
     return res.status(500).json({ message: 'Erro ao Agendar Consultas da Unidade de Saude' })
   }
   
}

export const AcceptMedical = async (id, newState, res) => {
  try{
    await models.ModelRegisterMédico.findOneAndUpdate(
      {
        'ConsultasUnidadedeSaude._id': id
      },
      { $set: { 'ConsultasUnidadedeSaude.$.Status': newState }},
      { new: true }
    )
    const getAcceptConsulta = await models.ModelRegisterMédico.findOne(
      {
        'ConsultasUnidadedeSaude._id': id
      },
      {
        'ConsultasUnidadedeSaude': 1
      }
    )
   const Consulta = getAcceptConsulta.ConsultasUnidadedeSaude.find(consulta => consulta._id.equals(id))

   const EmailPaciente = Consulta.EmailSolicitante
   const NomePaciente = Consulta.Solicitante
   const NumeroPaciente = Consulta.NumeroSolicitante
   const NomeMedico = Consulta.Solicitado

   await EmailQueue.add('Email', { 
    to: EmailPaciente,
    subject: `Atenção ${NomePaciente} sua consulta foi Aceita com Sucesso!`,
    message: `✨ ${NomePaciente}, Confirmação Recebida com Gratidão!\n\nAgradecemos por confirmar sua presença! A DR(a) ${NomeMedico} e toda a equipe estão prontos para oferecer um atendimento excepcional. Sua cooperação faz toda a diferença. Se surgir algo, estamos aqui para ajudar. 🌈`
   })

   await WhatsappQueue.add('Whatsapp', {
    numero: NumeroPaciente,
    mensagem: `✨ ${NomePaciente}, Confirmação Recebida com Gratidão!\n\nAgradecemos por confirmar sua presença! A DR(a) ${NomeMedico} e toda a equipe estão prontos para oferecer um atendimento excepcional. Sua cooperação faz toda a diferença. Se surgir algo, estamos aqui para ajudar. 🌈`,
   })

   return res.status(200).json({ message: 'Consulta Aceita com Sucesso'})
  }catch(error){
    return res.status(500).json({ message: 'Error internal server'})
  }
}


export const RejectMedical = async (id, newState, res) => {
  try{
     await models.ModelRegisterMédico.findOneAndUpdate(
      {
        'ConsultasUnidadedeSaude._id': id
      },
      { $set: { 'ConsultasUnidadedeSaude.$.Status': newState }},
      { new: true }
    )

    const getRejectConsulta = await models.ModelRegisterMédico.findOne(
      {
        'ConsultasUnidadedeSaude._id': id
      },
      {
        'ConsultasUnidadedeSaude': 1
      }
    )
   const Consulta = getRejectConsulta.ConsultasUnidadedeSaude.find(consulta => consulta._id.equals(id))

   const EmailPaciente = Consulta.EmailSolicitante
   const NomePaciente = Consulta.Solicitante
   const NumeroPaciente = Consulta.NumeroSolicitante

   await EmailQueue.add('Email', { 
    to: EmailPaciente,
    subject: `Atenção ${NomePaciente} sua consulta foi cancelada com Sucesso!`,
    message: `😢 ${NomePaciente}, Cancelamento Recebido com Compreensão!\n\nEntendemos que imprevistos acontecem. Obrigado por nos informar com antecedência. Se precisar reagendar ou tiver dúvidas, estamos à disposição. Sua atenção é crucial para otimizar nosso atendimento a todos os pacientes. 🌷`
   })

   await WhatsappQueue.add('Whatsapp', {
    numero: NumeroPaciente,
    mensagem: `😢 ${NomePaciente}, Cancelamento Recebido com Compreensão!\n\nEntendemos que imprevistos acontecem. Obrigado por nos informar com antecedência. Se precisar reagendar ou tiver dúvidas, estamos à disposição. Sua atenção é crucial para otimizar nosso atendimento a todos os pacientes. 🌷`, 
   })

   return res.status(200).json({ message: 'Consulta Rejeitada com Sucesso'})
  }catch(error){
    return res.status(500).json({ message: 'Error internal server'})
  }
}


export const WarningDoctorNotSchedules = async (idMedicoWarningDoctorNotHorarios, NomePacienteWarningDoctorNotHorarios, res) => {
  try{
    const getDoctor = await models.ModelRegisterMédico.findById(idMedicoWarningDoctorNotHorarios)
       
    const NameDoctor = getDoctor.NomeEspecialista
    const NumberDoctor =  getDoctor.telefone
    const EmailDoctorWarning = getDoctor.email

    await WhatsappQueue.add('Whatsapp', {
     numero:`${NumberDoctor}`,
     mensagem: `Ola ${NameDoctor} o Paciente ${NomePacienteWarningDoctorNotHorarios} Tem interesse em marcar uma consulta com voce entretando voce não tem Horarios cadastrados Disponiveis na Plataforma =/\nNão perca mais tempo entre agora e cadastre um Horario para começar a atender agora!`
   })

   await EmailQueue.add('Email',
   {
     to: `${EmailDoctorWarning}`, 
     subject: `Ola ${NameDoctor} tem um Paciente querendo agendar com voce!`,
     message: `${NameDoctor} o Paciente ${NomePacienteWarningDoctorNotHorarios} Tem interesse em marcar uma consulta com voce entretando voce não tem Horarios cadastrados Disponiveis na Plataforma =/ Não perca mais tempo entre agora e cadastre um Horario para começar a atender agora!`
   })

   return res.status(200).json({ message: 'Médico Notificado com Sucesso'})
  }catch(err){
    return res.status(400).json({ message: 'Erro ao Notificar Médico que ele nao tem Horarios'})
  }
}


export const WarningDoctorHorariosAntigos = async (NomePacienteWarningDoctorHorariosAntigos, idMedicoWarningDoctorHorariosAntigos, res) => {
  try{
    const getDoctor = await models.ModelRegisterMédico.findById(idMedicoWarningDoctorHorariosAntigos)
       
    const NameDoctor = getDoctor.NomeEspecialista
    const NumberDoctor =  getDoctor.telefone
    const EmailDoctorWarning = getDoctor.email

    await WhatsappQueue.add('Whatsapp', {
     numero:`${NumberDoctor}`,
     mensagem: `Ola ${NameDoctor} o Paciente ${NomePacienteWarningDoctorHorariosAntigos} Tem interesse em marcar uma consulta com voce entretando seus Horarios estão todos antigos =/, entre agora na plataforma e cadastre Horarios com Datas atuais para poder começar a atender novamente agora mesmo!`
   })

   await EmailQueue.add('Email',
   {
     to: `${EmailDoctorWarning}`, 
     subject: `Atenção ${NameDoctor}`,
     message: `${NameDoctor}o Paciente ${NomePacienteWarningDoctorHorariosAntigos} Tem interesse em marcar uma consulta com voce entretando seus Horarios estão todos antigos =/, entre agora na plataforma e cadastre Horarios com Datas atuais para poder começar a atender novamente agora mesmo!`
   })

   return res.status(200).json({ message: 'Médico Notificado com Sucesso'})
  }catch(err){
    return res.status(400).json({ message: 'Erro ao Notificar Médico que ele nao tem Horarios'})
  }
}