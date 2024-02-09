import { models } from "../../MongoDB/Schemas/Schemas.js"
import mongoose from 'mongoose';
import {  addMinutes } from 'date-fns'
import { customAlphabet } from 'nanoid'
import { ValidatorDateAndTime, calculateTimeDifference } from "../utils/Functions/Validator.js";
import axios from 'axios'
import { TraduçaoAudioParaTextoIA  } from '../utils/Functions/TraduçaoAudio.js'
import { Payment, MercadoPagoConfig } from 'mercadopago'
import { Pix, CartãoDeCrédito } from "../utils/Payment/Payments.js";

const alphabet = '0123456789';
const generateFourDigitNumber = customAlphabet(alphabet, 4)

export const SavedConsultaPacienteParticular = async (body, res) => {
   const {
     IDPaciente,
     IDMedico,
     Caso,
     Data,
     Inicio,
     Fim,
     Solicitante,
     Solicitado,
     Status,
     HorarioSelecionado,
     Escolhido,
     idHorario,
     TempoConsulta,
     Resumo,
   } = body;
 
   const Consulta = {
     Casos: Caso,
     Data: Data,
     Inicio: Inicio,
     Fim: Fim,
     Solicitante: Solicitante,
     Solicitado: Solicitado,
     Status: Status,
     HorarioSelecionado: HorarioSelecionado,
     CPFPaciente: '',
     Resumo: Resumo,
     FotoPaciente: '',
     idHorario: idHorario,
     TempoConsulta: TempoConsulta,
   };
 
   try{
    const consultaId = new mongoose.Types.ObjectId()
 
    const getPaciente = await models.ModelRegisterPaciente.findById(IDPaciente)

    await models.ModelRegisterMédico.findOneAndUpdate(
      {
        _id: IDMedico,
        'Horarios._id': idHorario,
        'Horarios.IntervaloAtendimentos.Intervalo':  HorarioSelecionado,
      },
      {
        $set: {
          'Horarios.$[horario].IntervaloAtendimentos.$[intervalo].Escolhido': Escolhido,
          'Horarios.$[horario].IntervaloAtendimentos.$[intervalo].FotoPaciente': getPaciente.Foto,
        },
      },
      {
        arrayFilters: [
          { 'horario._id': idHorario },
          { 'intervalo.Intervalo': HorarioSelecionado },
        ],
        new: true,
      },
    );
  
    if (getPaciente) {
      Consulta._id = consultaId
      Consulta.CPFPaciente = getPaciente.CPF
      getPaciente.ConsultasSolicitadasPacientes.push(Consulta)
      getPaciente.save();
      res.status(200).json({ message: 'Consulta Agendada com Sucesso' })
    } else {
      res.status(404).json({ message: 'Paciente nao cadastrado no Interconsulta =/' })
    }
  
    const getMedico = await models.ModelRegisterMédico.findById(IDMedico)
    if (getMedico) {
      Consulta._id = consultaId;
      Consulta.CPFPaciente = getPaciente.CPF
      Consulta.FotoPaciente = getPaciente.Foto
      getMedico.ConsultasSolicitadasPacientes.push(Consulta)
      getMedico.save()
    }

    const body = {
       route: '/especialistas-disponiveis-agendamento',
       TelefoneMedicoAgendamento: getMedico.telefone,
       EmailMedico: getMedico.email,
       NomeMedico: getMedico.NomeEspecialista,
       DataAgendamento: Data,
       InicioAgendamento: Inicio,
       FimAgendamento: Fim,
       NomePaciente: getPaciente.nome
    }
    
    //Production
    // axios.post('http://back-a:8081/api/automatic-whatsapp', body)
    //Development
    axios.post('http://localhost:8081/api/automatic-whatsapp', body)

   }catch(e){
    throw new Error(e)
   }
 }


 export const SavedConsultaUnidadeSaude = async (body, res) => {
   const {  IDMedicos, IDUnidade ,Solicitante, Casos, Status,
    //Automaçao
    IdentificadorUnidadeSaudeRoute,
    route } = body
    
    try {
      const getMedicos = await models.ModelRegisterMédico.find({
        _id: { $in: IDMedicos },
      });
  
      for (const medico of getMedicos) {
        const ConsultaUnidadedeSaude = {
          Data: '',
          Inicio: '',
          Fim: '',
          Solicitante: Solicitante,
          Casos: [],
          Status: Status,
        };

        const QuantidadeCasosClinicos = Casos[0].QuantidadeCasosClinicos

        //const totalIntervalos = medico.Horarios.reduce((total, horario) => total + horario.IntervaloAtendimentos.length, 0)
        //const FaltamIntervalos = QuantidadeCasosClinicos - totalIntervalos;
    
        //if (FaltamIntervalos > 0) {
          //const novoHorario = await criarNovoHorario(medico, FaltamIntervalos);
          //medico.Horarios.push(novoHorario)
          //await medico.save()

          // Looping para multiplos Horarios Automaticos 

            
        let casosDistribuidos = 0;
    
        for (const horario of medico.Horarios) {
          const intervalosAtendimentos = horario.IntervaloAtendimentos;
    
          for (const intervalo of intervalosAtendimentos) {
            if (casosDistribuidos < QuantidadeCasosClinicos) {
              let novaConsulta = { ...ConsultaUnidadedeSaude };
              const intervaloParts = intervalo.split(" - ");
    
              novaConsulta.Inicio = intervaloParts[0];
              novaConsulta.Fim = intervaloParts[1];
              novaConsulta.Data = horario.data;
    
              novaConsulta.Casos = Casos[casosDistribuidos];
    
              medico.ConsultasUnidadedeSaude.push({ ...novaConsulta });
              casosDistribuidos++;
            }
          }
        }
      await medico.save();
   }
      
      const UnidadeSaude = await models.ModelRegisterUnidadeSaude.findById(IDUnidade);
  
      const ConsultasUnidade2 = {
        Solicitante: '',
        Solicitado: '',
        Casos: '',
        Status: '',
      };
      Casos.forEach((casosClinicos) => {
        let newConsulta = { ...ConsultasUnidade2 };
        newConsulta.Solicitante = Solicitante;
        newConsulta.Solicitado = 'Médico Especialista';
        newConsulta.Casos = casosClinicos;
        newConsulta.Status = Status;
        UnidadeSaude.ConsultasUnidadedeSaude.push(newConsulta);
      });
  
      await UnidadeSaude.save();
  
      res.status(200).json({ message: 'Consultas Agendadas com Sucesso' });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao Agendar Consultas da Unidade de Saude' })
      throw new Error(error)
    }
    
 }

export const getAgendamentos = async  (params, res) => {

   const { id } = params
   
   let getStatus
   let countAguardando
   let countConfirmadas
   let countAtendidas
   let countCanceladas
   let Consultas
   let ConsultaUnidade

   try{
    switch(true){
      case !!await models.ModelRegisterMédico.findOne({ _id: id }):
            
         const getMedico = await models.ModelRegisterMédico.findOne({ _id: id })

         if(getMedico){
          const ConsultasMedico = getMedico.ConsultasSolicitadasPacientes
          const ConsultasMedicos2 = getMedico.ConsultasUnidadedeSaude
          const ConsultasGerais = ConsultasMedico.concat(ConsultasMedicos2)
          
          getStatus = ConsultasGerais.map((data) => data.Status);
 
          countAguardando = getStatus.filter((status) => status.includes('Aguardando')).length
 
          countConfirmadas = getStatus.filter((status) => status.includes('Confirmada')).length
 
          countAtendidas = getStatus.filter((status) => status.includes('Atendida')).length
          
          countCanceladas = getStatus.filter((status) => status.includes('Cancelada')).length
 
          Consultas = ConsultasMedico.map((consultas) => consultas)
 
          res.status(200).json({ ConsultasGerais, countAguardando, countConfirmadas, countAtendidas, countCanceladas })
         }else{
          res.status(404).json({ message: 'Medico nao cadastrado no Interconsulta'})
         }

         break
      case !!await models.ModelRegisterPaciente.findOne({ _id: id }):

         const getPaciente = await models.ModelRegisterPaciente.findOne({ _id: id })

         if(getPaciente){

          const ConsultasPaciente = getPaciente.ConsultasSolicitadasPacientes

          getStatus = ConsultasPaciente.map((data) => data.Status);
        
          countAguardando = getStatus.filter((status) => status.includes('Aguardando')).length
 
          countConfirmadas = getStatus.filter((status) => status.includes('Confirmada')).length
 
          countAtendidas = getStatus.filter((status) => status.includes('Atendida')).length
          
          countCanceladas = getStatus.filter((status) => status.includes('Cancelada')).length
 
          Consultas = ConsultasPaciente.map(consultas => consultas)
 
          res.status(200).json({ Consultas, countAguardando, countConfirmadas, countAtendidas, countCanceladas })
         }else{
          res.status(404).json({ message: 'Paciente nao cadastrado no Interconsulta'})
         }
         break
      case !!await models.ModelRegisterUnidadeSaude.findOne({ _id: id }):

         const getUnidade = await models.ModelRegisterUnidadeSaude.findOne({ _id: id })

         if(getUnidade){
          const ConsultasUnidade = getUnidade.ConsultasUnidadedeSaude
   
          getStatus = ConsultasUnidade.map((data) => data.Status)
 
          countAguardando = getStatus.filter((status) => status.includes('Aguardando')).length
 
          countConfirmadas = getStatus.filter((status) => status.includes('Confirmada')).length
 
          countAtendidas = getStatus.filter((status) => status.includes('Atendida')).length
          
          countCanceladas = getStatus.filter((status) => status.includes('Cancelada')).length
          
          ConsultaUnidade = ConsultasUnidade.map((consultas) => consultas)
          res.status(200).json({  ConsultaUnidade , countAguardando, countConfirmadas, countAtendidas, countCanceladas })
         }else{
          res.status(404).json({ message: 'Unidade de Saude nao cadastrada no Interconsulta '})
         }

         break
      default:
         break 
   }

   }catch(e){
    return res.status(500).json({message: 'Erro no Switch case de pegar as Consultas Cadastradas das 3 Personas' })
   }
}

export const GetPaciente = async (params, res) => {

  const { id } = params 
   
  try{
    const PacienteParticular = await models.ModelRegisterPaciente.findOne({
      'ConsultasSolicitadasPacientes._id': id
    })
  
    if(PacienteParticular){
       return res.status(200).json({ PacienteParticular })
    }else{
      return res.status(404).json({ message: 'Paciente Particular nao tem essa consulta'})
    }
  }catch(e){
    throw new Error(e)
  }
}

export const UpdateConsulta = async (body, res) => {
  const { id, status, idMedico, idPacienteParticular, CPFPacientePublico, NomePacientePublico, Data, Inicio, Fim, Solicitante } = body;
  
  try {

  let idUnidade 
  if(id){
    idUnidade = id.flat()
  }
  
    const GenerateNanoID = generateFourDigitNumber()
    if(id){  //Paciente Publico
      const updateMedico = await models.ModelRegisterMédico.updateMany(
        {
          _id: idMedico,
          'ConsultasUnidadedeSaude.Casos.IdentificadorConsulta': { $in: idUnidade },
        },
        {
          $set: {
            'ConsultasUnidadedeSaude.$[outer].Status': status,
          },
          $push: {
            'LinksConsulta': {
              Link: GenerateNanoID,
              expiration: addMinutes(new Date(), 60),
            },
          },
        },
        {
          arrayFilters: [{ 'outer.Casos.IdentificadorConsulta': { $in: idUnidade } }],
        }
      )

      const medicoQueAceitou = await models.ModelRegisterMédico.findOne({ _id: idMedico });
      const LinkReunião = medicoQueAceitou.LinksConsulta
      const nomeDoMedicoQueAceitou = medicoQueAceitou.NomeEspecialista
      const crmDoMedicoQueAceitou = medicoQueAceitou.CRM
      const LinkRecenteReuniao = LinkReunião[LinkReunião.length - 1]
      const NanoIDLink = LinkRecenteReuniao.Link

      const UpdatesMedicos = await models.ModelRegisterMédico.updateMany(
        {
          _id: { $ne: idMedico }, // $ne significa "not equal", excluindo o médico específico
          'ConsultasUnidadedeSaude.Casos.IdentificadorConsulta': { $in: idUnidade },
        },
        {
          $set: {
            'ConsultasUnidadedeSaude.$[outer].Status': `Aceita por ${nomeDoMedicoQueAceitou}`,
          },
        },
        {
          arrayFilters: [
            { 'outer.Casos.IdentificadorConsulta': { $in: idUnidade } },
          ],
        }
      )

      const deleteCasesUnidade = await models.ModelRegisterUnidadeSaude.findOneAndUpdate(
        {
          'nomeInstituicao': Solicitante[0],
        },
        {
          $pull: {
            'ConsultasUnidadedeSaude': { 'Casos.IdentificadorConsulta': { $in: idUnidade } },
          },
        },
        { new: true }
      )

      const consultasMapeadas = CPFPacientePublico.map((cpf, index) => ({
        Inicio: Inicio[index],
        Fim: Fim[index],
        CPFPaciente: cpf[0],
        Status: status,
        Responsavel: Solicitante[0],
        NomePaciente: NomePacientePublico[index][0],
        CRMMedico: crmDoMedicoQueAceitou, 
        NomeMedico: nomeDoMedicoQueAceitou, 
        LinkConsulta: `localhost:3000/consultorio/${NanoIDLink}`, 
      })) 

      const UnidadeSaude = await models.ModelRegisterUnidadeSaude.findOneAndUpdate(
        {
          'nomeInstituicao': Solicitante
        },
        {
          $push: {
            'ConsultasAceitasUnidade': {
              grupos: consultasMapeadas
            }
          }
        },
        { new: true }
      );

    
      if (updateMedico.modifiedCount > 0 && UpdatesMedicos.modifiedCount > 0 && deleteCasesUnidade && UnidadeSaude) {
        res.status(200).json({ message: 'Atualização bem-sucedida' });
      } else {
        res.status(404).json({ message: 'Nenhum documento encontrado para atualizar' });
      }
    }else{  // Paciente Particular

      const updateMedico = await models.ModelRegisterMédico.updateMany(
        { 'ConsultasSolicitadasPacientes._id': { $in: idPacienteParticular } },

        {
          $set: { 'ConsultasSolicitadasPacientes.$[elem].Status': status },
          $push: {
            'ConsultasSolicitadasPacientes.$[elem].LinkConsulta': {  
              Link: GenerateNanoID,
              expiration: addMinutes(new Date(), 60),
            }
          }
        },

        {
          arrayFilters: [{ 'elem._id': { $in: idPacienteParticular } }],
        }
      )
      
      const updatePaciente = await models.ModelRegisterPaciente.updateMany(
        { 'ConsultasSolicitadasPacientes._id': { $in: idPacienteParticular } },
        
        { 
          $set: { 'ConsultasSolicitadasPacientes.$[elem].Status': status },
          $push: {
            'ConsultasSolicitadasPacientes.$[elem].LinkConsulta': { 
              Link: GenerateNanoID,
              expiration: addMinutes(new Date(), 60)
            }
          }
        },

        {
          arrayFilters: [{ 'elem._id': { $in: idPacienteParticular } }],
        }
      )
      
      if (updateMedico.modifiedCount > 0 && updatePaciente.modifiedCount > 0) {

        res.status(200).json({ message: 'Atualização bem-sucedida' })

        const Medico = await models.ModelRegisterMédico.findById(idMedico)

        const Paciente = await models.ModelRegisterPaciente.find({
          'ConsultasSolicitadasPacientes._id': idPacienteParticular
        })

        const NomePacienteArr = Paciente.map((data) => data.nome)
        const NomePaciente = NomePacienteArr.join(',')
        
        const TelefonePacienteArr = Paciente.map((data) => data.telefone)
        const TelefonePaciente = TelefonePacienteArr.join(',')

        const EmailPacienteParticularArr = Paciente.map((data) => data.email)
        const EmailPaciente = EmailPacienteParticularArr.join(',')
        

        const body = {
          EmailPacienteAceitouConsulta: EmailPaciente,
          NomeMedicoAceitouConsulta: Medico.NomeEspecialista,
          NumeroPacienteAceitouConsulta: TelefonePaciente,
          NomePacienteAceitouConsulta: NomePaciente,
          DataAceitouConsulta: Data[0],
          InicioAceitouConsulta: Inicio[0],
          FimAceitouConsulta: Fim[0],
          route: '/confirmaçao-consulta-medico'
        }
        
        //Production
        //axios.post('http://back-a:8081/api/automatic-whatsapp', body)
        //Development
        axios.post('http://localhost:8081/api/automatic-whatsapp', body)
      } else {
        res.status(500).json({ message: 'Erro ao fazer Atualização' });
      }
    
    }
   
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};


export const DeleteCasoClinico = async (body, res) => {
  
  const {idCasoClinico, IdentificadorCaso, CPFPaciente, Solicitante, idMedico, status, Data, Inicio, Fim, idHorario, HorarioSelecionado } = body

  try{
    if(IdentificadorCaso && IdentificadorCaso.length > 0){ //PacientePublico   
      const deleteCasoPublicoMédico = await models.ModelRegisterMédico.findOneAndUpdate(
        {
          _id: idMedico,
          'ConsultasUnidadedeSaude.Casos.IdentificadorConsulta': IdentificadorCaso,
          'ConsultasUnidadedeSaude.Casos.CPF': CPFPaciente
        },
        {
          $pull: {
            'ConsultasUnidadedeSaude': { 'Casos.IdentificadorConsulta': IdentificadorCaso }
          }
        },
        { new: true }
      )
  
      const UpdateCasosUnidade = await models.ModelRegisterUnidadeSaude.findOneAndUpdate(
        {
          'ConsultasUnidadedeSaude.Casos.IdentificadorConsulta':  IdentificadorCaso,
          'ConsultasUnidadedeSaude.Casos.CPF': CPFPaciente
        },
        {
          $set: {
            'ConsultasUnidadedeSaude.$.Status': `${Solicitante} Aguardando`
          }
        }
      )
   
      if (deleteCasoPublicoMédico && UpdateCasosUnidade) {
        res.status(200).json({ message: 'Atualizaçao Feita com Sucesso'})
      } else {
         res.status(400).json({ message: 'Erro ao realizar Atualizaçao'})
      }
     }else{ //Paciente Particular
  
      const UpdateHorarioDoctor =  await models.ModelRegisterMédico.findOneAndUpdate(
        {
          _id: idMedico,
          'Horarios._id': idHorario,
          'Horarios.IntervaloAtendimentos.Intervalo':  HorarioSelecionado,
        },
        {
          $set: {
            'Horarios.$[horario].IntervaloAtendimentos.$[intervalo].Escolhido': 'Livre',
            'Horarios.$[horario].IntervaloAtendimentos.$[intervalo].FotoPaciente': null,
          },
        },
        {
          arrayFilters: [
            { 'horario._id': idHorario },
            { 'intervalo.Intervalo': HorarioSelecionado },
          ],
          new: true,
        },
      )
  
      const deletedCasoParticularMédico = await models.ModelRegisterMédico.findOneAndUpdate(
        {
          'ConsultasSolicitadasPacientes._id': idCasoClinico
        },
        {
          $pull: {
            'ConsultasSolicitadasPacientes': { _id: idCasoClinico }
          }
        },
        { new: true }
      )
   
      const AtualizandoRejeiçaoPaciente = await models.ModelRegisterPaciente.updateOne(
        {
         'ConsultasSolicitadasPacientes._id': idCasoClinico, 
        },
        {
          $set: { 
            'ConsultasSolicitadasPacientes.$.Status': status
          }
        }
      )
  
      if(deletedCasoParticularMédico && AtualizandoRejeiçaoPaciente.modifiedCount > 0  &&UpdateHorarioDoctor){
        res.status(200).json({ message: 'Atualizaçao Feita com Sucesso'})
  
  
        const Medico = await models.ModelRegisterMédico.findById(idMedico)
  
        const Paciente = await models.ModelRegisterPaciente.find({
          'ConsultasSolicitadasPacientes._id': idCasoClinico
        })
  
        const NomePacienteArr = Paciente.map((data) => data.nome)
        const NomePaciente = NomePacienteArr.join(',')
        
        const TelefonePacienteArr = Paciente.map((data) => data.telefone)
        const TelefonePaciente = TelefonePacienteArr.join(',')
  
        const DoencaPacienteArr = Paciente.map((data) => data.Doenca)
        const Doenca = DoencaPacienteArr.join(',')
  
        const EmailPacienteArr = Paciente.map((data) => data.email)
        const EmailPaciente = EmailPacienteArr.join(',')
  
     
        const body = {
          EmailPacienteRejeitouConsulta: EmailPaciente,
          NomeMedicoRejeitouConsulta: Medico.NomeEspecialista,
          NumeroPacienteRejeitouConsulta: TelefonePaciente,
          NomePacienteRejeitouConsulta: NomePaciente,
          DataRejeitouConsulta: Data,
          InicioRejeitouConsulta: Inicio,
          FimRejeitouConsulta: Fim,
          DoencaRejeitouConsulta: Doenca,
          route: '/rejeicao-consulta-medico'
        }
        
        //Production
        //axios.post('http://back-a:8081/api/automatic-whatsapp', body)
       //Development
       axios.post('http://localhost:8081/api/automatic-whatsapp', body)
      }
     }
  }catch(error){
    console.log(error)
  }
}


export const DeleteCasoClinicoPacienteParticular = async (body, res) => {
  const { id, Solicitante, idPaciente, Data,Inicio, Fim , idHorario, HorarioSelecionado } = body;

  try {

    const UpdateHorarioDoctor =  await models.ModelRegisterMédico.findOneAndUpdate(
      {
        'Horarios._id': idHorario,
        'Horarios.IntervaloAtendimentos.Intervalo':  HorarioSelecionado,
      },
      {
        $set: {
          'Horarios.$[horario].IntervaloAtendimentos.$[intervalo].Escolhido': 'Livre',
          'Horarios.$[horario].IntervaloAtendimentos.$[intervalo].FotoPaciente': null,
        },
      },
      {
        arrayFilters: [
          { 'horario._id': idHorario },
          { 'intervalo.Intervalo': HorarioSelecionado },
        ],
        new: true,
      },
    )

    const getPaciente = await models.ModelRegisterPaciente.findOneAndUpdate(
      { 'ConsultasSolicitadasPacientes._id': id },
      {
        $set: {
          'ConsultasSolicitadasPacientes.$.Status': `Cancelada por ${Solicitante}`,
        },
      },
      { new: true }
    )

    const getMedico = await models.ModelRegisterMédico.findOneAndUpdate(
      { 'ConsultasSolicitadasPacientes._id': id },
      { $pull: { 'ConsultasSolicitadasPacientes': { _id: id } } },
      { new: true }
    )

    let NumeroMedico = getMedico.telefone
    let NomeMedico = getMedico.NomeEspecialista
    let EmailMedico = getMedico.email

 
    if (UpdateHorarioDoctor && getPaciente && getMedico) {
       res.status(200).json({ message: 'Consulta Excluída com Sucesso' })

       const Paciente = await models.ModelRegisterPaciente.findById(idPaciente)

         const body = {
         EmailMedicoExclusao: EmailMedico,  
         NumeroMedicoExclusao:NumeroMedico,
         NomeMedicoExclusao: NomeMedico,
         NomePacienteExclusao: Paciente.nome,
         DataExclusaoPaciente: Data,
         InicioExlusaoPaciente: Inicio,
         FimExclusaoPaciente: Fim,
         route: '/exclusion-consulta-paciente'
         }
   
      //Production
      //axios.post('http://back-a:8081/api/automatic-whatsapp', body)
      //Development
      axios.post('http://localhost:8081/api/automatic-whatsapp', body)

    } else {
      res.status(404).json({ message: 'Erro ao excluir consulta' });
    }
  } catch (e) {
    console.error('Erro ao Remover Consulta:', e.message);
    return res.status(500).json({ message: 'Erro interno ao excluir consulta' });
  }
};


export const GenerateLink = async (body, res) =>{
  const { IdentificadorConsultaParticular } = body
  
  try{
    const documentosAtualizados = await models.ModelRegisterMédico.findOne(
      { 'ConsultasSolicitadasPacientes._id':  IdentificadorConsultaParticular  },
      { 'ConsultasSolicitadasPacientes.$': 1 }
    )
    

    const dataConsulta = documentosAtualizados.ConsultasSolicitadasPacientes.map((data) => data.Data)
    const inicioConsulta = documentosAtualizados.ConsultasSolicitadasPacientes.map((data) => data.Inicio)
    const fimConsulta =  documentosAtualizados.ConsultasSolicitadasPacientes.map((data) => data.Fim)


    const isValid = await ValidatorDateAndTime(dataConsulta, inicioConsulta, fimConsulta)


    if(isValid){
      try{
        const documentosAtualizados = await models.ModelRegisterMédico.find({
          'ConsultasSolicitadasPacientes._id': { $in: IdentificadorConsultaParticular }
        })
  
    
        let LinksConsulta
        
        documentosAtualizados.forEach(doc => {
          doc.ConsultasSolicitadasPacientes.forEach(consulta => {
            consulta.LinkConsulta.forEach(link => {
              LinksConsulta = link.Link
            })
          })
        })

        res.status(200).json({ message: `/consultorio/${LinksConsulta}`})   
      }catch(error){
        console.log(error)
      }
    }else{
      try{
        const TempoFaltando = await calculateTimeDifference(dataConsulta, inicioConsulta, fimConsulta)
        console.log(TempoFaltando)
   
        if (TempoFaltando === 'Consulta Expirada') {
           res.json({ TempoFaltando: TempoFaltando })
       } else {
          res.json({ TempoFaltando: TempoFaltando })
       }
      }catch(error){
         console.log(error)
      }
    }
  }catch(error){
    throw new Error('Error in TryCatch Generatelink', error)
  }
 
}


export const ValidatorURL = async(params, res) => {
  const { ParamsLink } = params
   
  try{
    const link = await models.ModelRegisterMédico.findOne(
      {
        'ConsultasSolicitadasPacientes.LinkConsulta.Link': ParamsLink
      },
      { 'ConsultasSolicitadasPacientes.$': 1 }
    );
  
    const LinkConsulta = link.ConsultasSolicitadasPacientes[0].LinkConsulta[0]
    
    if(LinkConsulta && LinkConsulta.expiration > new Date()){
      res.status(200).json({ valid: true })
    }else{
      res.status(404).json({ valid: false })
    }
  }catch(e){
    throw new Error('Error in Validador Link Sala de Reuniao', e)
  }
}

export const getLaudo = async (body, res) => {
  const { id, IdentificadorConsulta } = body

  try{
    const getMedico = await models.ModelRegisterMédico.findOne({
      _id: id,
    });
  
    if (getMedico) {
      const consulta = getMedico.ConsultasSolicitadasPacientes.find(
        (consulta) => consulta._id.toString() === IdentificadorConsulta
      );
  
      const Data = consulta.Data;
      const NomePaciente = consulta.Solicitante;
  
      const pdfBase64 = consulta.PDF.toString('base64');
  
      const responseData = {
        pdfBase64,
        NomePaciente,
        Data,
      };
  
      res.status(200).json(responseData);
    } else {
      return res
        .status(404)
        .json({ message: 'Médico não cadastrado no banco de dados do interconsulta' });
    }
  }catch(error){
    console.log(error)
  }
}


export const getDataMedico = async (body, res) =>{
  const { idMedico } = body

  try{
    const getMedico = await models.ModelRegisterMédico.findById(idMedico)

    if(!getMedico){
      return res.status(404).json({ message: 'Médico nao esta cadastrado no banco de dados do Interconsulta'})
    }
      
    const FotoMédico = getMedico.Foto
  
    res.status(200).json({ FotoMédico })
  }catch(error){
    console.log(error)
  }
} 

export const GetSchemaLinksDoctor = async (params, res) => {
  const { id } = params;

  try {
    const getMedico = await models.ModelRegisterMédico.findOne({ _id: id })

    if(getMedico){
     const ConsultasMedico = getMedico.ConsultasSolicitadasPacientes

     const consultasConfirmadasComLinkPreenchido = ConsultasMedico.filter((consulta) => consulta.Status.includes('Confirmada'))
 
      return res.status(200).json({ consultasConfirmadasComLinkPreenchido }); // Retornando a propriedade correta
    } else {
      return res.status(404).json({ error: 'Médico não encontrado' }); // Adicionando uma resposta adequada
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


export const getPhotoPatient = async (body, res) =>{
  const { id } = body
  
  try{
    const getPaciente = await models.ModelRegisterPaciente.findById(id)

    if(!getPaciente){
      return res.status(400).json({ message: 'Paciente nao esta cadastrado no Interconsulta'})
    }
    const FotoPaciente = getPaciente.Foto
    return res.status(200).json({ FotoPaciente })
  }catch(error){
    console.log(error)
  }
}

export const TraduçaoAudioParaTexto = async (audioPath, res) => {
  try {
    const Translate = await TraduçaoAudioParaTextoIA(audioPath);
    const TraducaoFeita = Translate

    if (TraducaoFeita) {
      return res.status(200).json({ success: true, data: TraducaoFeita });
    } else {
      console.error('Translation result is undefined.');
      return res.status(500).json({ success: false, error: 'Translation result is undefined.' });
    }
  } catch (error) {
    console.error('Error during audio translation:', error);
    return res.status(500).json({ success: false, error: 'Error during audio translation.' });
  }
}


export const PaymentDoctor = async (body, res) => {
  const { id , ValorConsulta , TypePayment , TransictionCardID } = body

  try{
    const getPaciente = await models.ModelRegisterPaciente.findById(id)

    const client = new MercadoPagoConfig({ accessToken: 'APP_USR-1485714438717131-011321-a805841cf5cb2ccf3b83011440e05639-505908896' })
  
    let paymentMessage
  
    const AmountNumeric = parseFloat(ValorConsulta)
  
    switch (TypePayment) {
       case 'Pix':
        try {
          const data = await Pix(Payment, client, AmountNumeric, getPaciente)
          const PixCopiaECola = data.point_of_interaction.transaction_data.qr_code;
          const PixQrCode = data.point_of_interaction.transaction_data.qr_code_base64;
          const LinkPagamentoPix = data.point_of_interaction.transaction_data.ticket_url;
    
          res.status(200).json({
            TypePayment: 'Pix',
            PixCopiaECola,
            PixQrCode,
            LinkPagamentoPix,
          })
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
          break
       case 'Cartão de Crédito':
          CartãoDeCrédito(Payment, client, ValorConsulta, getPaciente, TransictionCardID)
          break;
       default:
          paymentMessage = 'Forma de Pagamento recusada';
    }
  
  }catch(error){
    console.log(error)
  }
}
