import { CreatingPDF } from "../utils/Functions/CreatingPDF.js"
import { models } from '../../MongoDB/Schemas/Schemas.js' 
import { getHistoricoPaciente } from "../utils/Functions/getHistoricoPaciente.js"


export const CreatingDoctorLaudo = async (body, res) => {
  const { idMedico, IdentificadorConsultaPaciente, Diagnostico, TratamentoPrescrito, MedicacaoPrescrita, FerramentaTerapeutica, ProgressoPaciente, RecomendacoesFuturas } = body

  try {
  const catchingPatientbyIdentifier = await models.ModelRegisterPaciente.find(
    {
    'ConsultasSolicitadasPacientes._id': IdentificadorConsultaPaciente
    },
  )
  
  const ObjectDate = new Date()

  const Dia = ObjectDate.getDate()
  const Mes = ObjectDate.getMonth() + 1
  const Ano = ObjectDate.getFullYear()

  const DataAtual = `${Dia}/${Mes}/${Ano}`

  const getDataDoctor = await models.ModelRegisterMédico.findOne({_id: idMedico})

  const Laudo = `
  Data: ${DataAtual}
  
  Eu, ${getDataDoctor.NomeEspecialista}, ${getDataDoctor.EspecialidadeMedica}, inscrito no CRM:${getDataDoctor.CRM}/RQE: ${getDataDoctor.RQE}, sendo responsável pelo acompanhamento médico do(a) paciente ${catchingPatientbyIdentifier.map((data) => data.nome).join(',')}, venho por meio deste relatório, com base em exames clínicos e diagnósticos realizados, fornecer informações detalhadas sobre o estado de saúde do paciente e o tratamento prescrito.
  
  Identificação do Paciente:
  
  Prontuário: ${catchingPatientbyIdentifier.map((data) => data._id).join(', ')}
  Nome: ${catchingPatientbyIdentifier.map((data) => data.nome).join(', ')}
  Data de Nascimento: ${catchingPatientbyIdentifier.map((data) => data.Data).join(', ')}

  Sexo: ${catchingPatientbyIdentifier.map((data) => data.Genero).join(', ')}
  CPF: ${catchingPatientbyIdentifier.map((data) => data.CPF).join(', ')}
  Estado Civil: ${catchingPatientbyIdentifier.map((data) => data.EstadoCivil).join(', ')}
  Profissão: ${catchingPatientbyIdentifier.map((data) => data.Profissao).join(', ')}
  Estado: ${catchingPatientbyIdentifier.map((data) => data.Estado).join(', ')} 
  Cidade: ${catchingPatientbyIdentifier.map((data) => data.Cidade).join(', ')}
  Bairro: ${catchingPatientbyIdentifier.map((data) => data.Bairro).join(', ')}
  Rua:  ${catchingPatientbyIdentifier.map((data) => data.Rua).join(', ')}
  
  Contato: ${catchingPatientbyIdentifier.map((data) => data.telefone).join(', ')}
  
  
  Diagnóstico -
  
  ${Diagnostico}
  
  Tratamento Prescrito - 
  
  ${TratamentoPrescrito}
  
  Medicação prescrita -

  ${MedicacaoPrescrita}
  
  Ferramenta Terapêutica Prescrita - 
  
  ${FerramentaTerapeutica}
  
  Progresso do Paciente - 
  
  ${ProgressoPaciente}
  
  Recomendações Futuras - 

  ${RecomendacoesFuturas}
  
  Atenciosamente, ${getDataDoctor.NomeEspecialista}.
  `;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=laudo.pdf');

    const pdfBuffer = await CreatingPDF(Laudo)

      await models.ModelRegisterMédico.findOneAndUpdate(
      {
        _id: idMedico,
        'ConsultasSolicitadasPacientes._id': IdentificadorConsultaPaciente,
      },
      {
        $set: {
          'ConsultasSolicitadasPacientes.$.PDF': pdfBuffer,
        },
      },
      { new: true }
    )

    res.status(200).send(pdfBuffer);
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Erro ao criar Laudo Médico' })
  }
}

export const getConsulta = async (body, res) => {
     const { IdentificadorConsulta } = body

     try{
      const getConsulta = await models.ModelRegisterPaciente.find(
        {
        'ConsultasSolicitadasPacientes._id': IdentificadorConsulta
        },
      )
      
      if(getConsulta.length > 0){
        return  res.status(200).json({ getConsulta })
      }else{
        return res.status(404).json({ message: 'Consulta nao cadastrada no banco de dados do Interconsulta =/'})
      }
     }catch(error){
      throw new Error(error)
     }
}


export const getHistoricoPacientee = async (body, res) => {
   const { CPF } = body

   try{
   const PacienteParticular = await models.ModelRegisterPaciente.findOne({ CPF: CPF})
   const PacientePublico = await models.ModelCasosClinicos.findOne({ CPF: CPF })

   const ModelPacienteParticular = models.ModelRegisterPaciente
   const ModelPacientePublico = models.ModelCasosClinicos

   if(PacienteParticular){
    getHistoricoPaciente(PacienteParticular, ModelPacienteParticular, res)
   }

   if(PacientePublico){
    getHistoricoPaciente(PacientePublico, ModelPacientePublico, res)
   }
   }catch(error){
    throw new Error(error)
   }
}

export const VerifyClickEndReuniao = async (body, res) => {
  const { IdentificadorConsulta, id } = body

  try{
    const getMedico = await models.ModelRegisterMédico.findOne({ _id: id });
    const getPaciente = await models.ModelRegisterPaciente.findOne({ _id: id })
    console.log(getPaciente)
  
    const arrayFilters = [{ 'element._id': IdentificadorConsulta }];
  
    if (getMedico) {
      const updateQueryMedico = {
        $push: {
          'ConsultasSolicitadasPacientes.$[element].OkMedico': `Finalizado pelo Médico ${getMedico.NomeEspecialista}`,
        },
      };
  
      await models.ModelRegisterMédico.findOneAndUpdate({ _id: id }, updateQueryMedico, { arrayFilters })
  
      await models.ModelRegisterPaciente.findOneAndUpdate(
        { 'ConsultasSolicitadasPacientes._id': IdentificadorConsulta }, updateQueryMedico, 
        { arrayFilters }
      )
    }
  
    if (getPaciente) {
      const updateQueryPaciente = {
        $push: {
          'ConsultasSolicitadasPacientes.$[element].OkPaciente': `Finalizado pelo Paciente ${getPaciente.nome}`,
        },
      };
  
      await models.ModelRegisterPaciente.findOneAndUpdate({ _id: id }, updateQueryPaciente, { arrayFilters })
  
      await models.ModelRegisterMédico.findOneAndUpdate
      (
        { 'ConsultasSolicitadasPacientes._id': IdentificadorConsulta }, updateQueryPaciente, { arrayFilters }
      )
    }
  
    const Consulta = await models.ModelRegisterMédico.findOne(
      { 'ConsultasSolicitadasPacientes._id': IdentificadorConsulta },
      {
        'ConsultasSolicitadasPacientes.$': 1,
      }
    )
    
    res.status(200).json({ Consulta });
  }catch(error){
    throw new Error(error)
  }
}

export const SavedConsultaMedico = async (body, res) => {
  const { id, IdentificadorConsulta, Diagnostico, Tratamento, Medicacao, FerramentasTerapeuticas, Progresso, SolicitacaoMedicamentos, SolicitacaoMateriais, SolicitacaoExames, RecomendacoesFuturas,   EstadoPaciente, Solicitacao, CRMMedicoAtendeu, DataInsercao } = body;

  try {
    const getMedico = await models.ModelRegisterMédico.findById(id)

    const AreaAtuacao = getMedico.AreadeAtuacao
    const Especialidade = getMedico.EspecialidadeMedica
    if (getMedico) {
      const updateStateConsultaMedico = await models.ModelRegisterMédico.findByIdAndUpdate(
        id, // Pass only the document ID as the first parameter
        {
          $set: {
            'ConsultasSolicitadasPacientes.$[element].Status': `Atendida por ${getMedico.NomeEspecialista}`,
          },
        },
        {
          arrayFilters: [{ 'element._id': IdentificadorConsulta }],
          new: true, // Return the modified document
        }
      )

      const result = await models.ModelRegisterPaciente.findOneAndUpdate(
        { 'ConsultasSolicitadasPacientes._id': IdentificadorConsulta },
         {
           $push: {
             Historico: {
               Diagnostico,
               Tratamento,
               Medicacao,
               FerramentasTerapeuticas,
               Progresso,
               SolicitacaoMedicamentos,
               SolicitacaoMateriais,
               SolicitacaoExames,
               RecomendacoesFuturas,
               EstadoPaciente,
               Solicitacao,
               CRMMedicoAtendeu,
               DataInsercao,
               AreaAtuacao,
               Especialidade,
             },
           },
         },
         {
           new: true,
         }
       )
       
      
       await axios.post('http://back-a:8081/api/automatic-whatsapp', {
        route: '/resumo-casos-clinicos',
        Diagnostico: Diagnostico,
        Tratamento: Tratamento,
        Medicacao: Medicacao,
        FerramentasTerapeuticas: FerramentasTerapeuticas,
        Progresso: Progresso,
        SolicitacaoMedicamentos: SolicitacaoMedicamentos,
        SolicitacaoMateriais: SolicitacaoMateriais,
        SolicitacaoExames: SolicitacaoExames,
        RecomendacoesFuturas: RecomendacoesFuturas,
        EstadoPaciente: EstadoPaciente,
        Solicitacao: Solicitacao,
        result: result
       })
      
      if (updateStateConsultaMedico) {
        return res.status(200).json({ message: 'Atualização de Consulta Atendida do médico concluída com sucesso' });
      } else {  
        return res.status(200).json({ message: 'Erro ao atualizar a Consulta Atendida do Médico' });
      }
    } else {
      return res.status(404).json({ message: 'Médico não encontrado' });
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const SavedConsultaEndPaciente = async (body, res) => {
  const { id, IdentificadorConsulta } = body;

  try {
    const updateStateConsultaPaciente = await models.ModelRegisterPaciente.findByIdAndUpdate(
      id, 
      {
        $set: {
          'ConsultasSolicitadasPacientes.$[element].Status': 'Atendida',
        },
      },
      {
        arrayFilters: [{ 'element._id': IdentificadorConsulta }],
        new: true, 
      }
    )

    if (updateStateConsultaPaciente) {
      return res.status(200).json({ message: 'Atualização de Consulta Atendida do médico concluída com sucesso' });
    } else {
      return res.status(200).json({ message: 'Erro ao atualizar a Consulta Atendida do Médico' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}


export const DoctorAvaliations = async (body, res) =>{
  
  const { IdentificadorConsulta } = body

  try{
    const getMedico = await models.ModelRegisterMédico.find({
      'ConsultasSolicitadasPacientes._id': IdentificadorConsulta
    })
  
    if(getMedico){
      return res.status(200).json({ getMedico })
    }else{
      return res.status(404).json({ message: 'Consulta Médica nao existe no banco de dados do Interconsulta :)'})
    }
  }catch(e){
    throw new Error
  }
}

export const CalculingAvaliationsDoctor = async (body,res) => {

  const { id, avaliacao,avaliacaoText, FotoPaciente, NomePaciente } = body

  try{
    const getMedico = await models.ModelRegisterMédico.findOne({ _id: id})

    if(!getMedico){
      return res.status(404).json({ message: 'Medico nao esta cadastrado no banco de dados do interconsulta'})
    }

    const novaAvaliacao = {
      AvaliacoesStar: avaliacao,
      AvaliacoesText: avaliacaoText,
      Foto: FotoPaciente,
      NomePaciente: NomePaciente,
    }

    getMedico.Avaliacoes.push(novaAvaliacao)
  
    const totalAvaliacoes = getMedico.Avaliacoes.length;
    const somaAvaliacoes = getMedico.Avaliacoes.reduce((acc, avaliacao) => acc + avaliacao.AvaliacoesStar, 0);
    getMedico.mediaAvaliacoes = somaAvaliacoes / totalAvaliacoes

    await getMedico.save()

  
    res.status(200).json({ message: `Nova Media atribuido com sucesso ao  ${getMedico.NomeEspecialista}`})
  }catch(e){
    throw new Error('Error in Calculator Avalations Doctor ')
  }
}

export const getDataPatient = async (body,res) => {
  const { idPaciente } = body

  try{
    const getPaciente = await models.ModelRegisterPaciente.findById(idPaciente)

    const FotoPaciente = getPaciente.Foto
  
    if(!getPaciente){
      return res.status(404).json({ message: 'Paciente nao cadastrado no banco de dados do interconsulta.'})
    }
  
    res.status(200).json({ FotoPaciente })
  }catch(error){
      console.log(error)
  }
}

export const ConclusionConsultaDeleteHorario = async (body, res) => {
     const { idConsultaParticular } = body

     try{
      const getConsultaParticular = await models.ModelRegisterMédico.findOne(
        { 'ConsultasSolicitadasPacientes._id': idConsultaParticular },
        { 'ConsultasSolicitadasPacientes.$': 1 } 
      )
  
       const idMedico = getConsultaParticular._id
  
       const consultaParticular = getConsultaParticular.ConsultasSolicitadasPacientes[0]
  
       const HorarioSelecionadoConsulta = consultaParticular.HorarioSelecionado
    
       const idHorario = consultaParticular.idHorario
  
       const UpdateHorarioDoctor = await models.ModelRegisterMédico.findOneAndUpdate(
        {
          _id: idMedico,
          'Horarios._id': idHorario,
          'Horarios.IntervaloAtendimentos.Intervalo': HorarioSelecionadoConsulta,
        },
        {
          $pull: {
            'Horarios.$.IntervaloAtendimentos': { Intervalo: HorarioSelecionadoConsulta },
          },
        },
        {
          new: true,
        }
      )
  
       if(UpdateHorarioDoctor){
        return res.status(200).json({ message: 'Atualizaçao feita com Sucesso' })
       }else{
        return res.status(404).json({ message: 'Consulta Particular nao existe '})
       }
     }catch(error){
      console.log(error)
     }   
}


export const getConsultaParticularDoctor = async (body, res) => {
  try {
    const { idConsultaParticular } = body;

    const consultaParticular = await models.ModelRegisterMédico.findOne(
      { 'ConsultasSolicitadasPacientes._id': idConsultaParticular },
      { 'ConsultasSolicitadasPacientes.$': 1 }
    );

    res.status(200).json({ consultaParticular })
  } catch (error) {

    console.error(error)
    res.status(500).send('Erro interno do servidor');
  }
};


export const getHorariosProximos = async (body,res) => {
  const { idMedico } = body

  try{
     const ConsultasConfirmadasDoctor = await models.ModelRegisterMédico.find({
      _id: idMedico,
     })
    const ConsultasSolicitadasPacientes = ConsultasConfirmadasDoctor.map((data) => data.ConsultasSolicitadasPacientes.filter((data) => data.Status.includes('Confirmada')))
    
    return res.json({ ConsultasSolicitadasPacientes })
  }catch(error){
    console.log(error)
  }
}