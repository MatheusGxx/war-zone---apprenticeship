import { models } from '../../MongoDB/Schemas/Schemas.js' 
import { getHistoricoPaciente } from "../utils/Functions/getHistoricoPaciente.js"
import { 
   CreateLaudo,
   CreateReceitaSimples, 
   CreateReceitaControlada, 
   CreateExame, 
   CreateAtestado
   } from "../utils/Functions/CreatingDocumentsPDF.js"

import axios from 'axios'

import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

export const  CreatingDocumentsDoctor = async (body, res) => {
  
  const { idMedico, IdentificadorConsultaPaciente } = body

  try {
    
  const currentFilePath = fileURLToPath(import.meta.url)
  const currentDir = dirname(currentFilePath)

  const catchingPatientbyIdentifier = await models.ModelRegisterPaciente.find(
    {
    'ConsultasSolicitadasPacientes._id': IdentificadorConsultaPaciente
    },
  )

  const getDataDoctor = await models.ModelRegisterMédico.findOne(
    { 'ConsultasSolicitadasPacientes._id': IdentificadorConsultaPaciente },
  )

  const UltimaConsulta = getDataDoctor.ConsultasSolicitadasPacientes[getDataDoctor.ConsultasSolicitadasPacientes.length -1]

  const ObjectDate = new Date()

  const Dia = ObjectDate.getDate()
  const Mes = ObjectDate.getMonth() + 1
  const Ano = ObjectDate.getFullYear()

  const DataAtual = `${Dia}/${Mes}/${Ano}`

  const FilesToDownload = []
  const FilePathComplete = []

  const FileLaudo = await CreateLaudo(
    DataAtual,
    `${getDataDoctor.NomeEspecialista}`, // NomeMedico
    `${getDataDoctor.EspecialidadeMedica}`, // EspecialidadeMedico
    `${getDataDoctor.UFCRM}`, //UF CRM Medico
    `${getDataDoctor.CRM}`, // CRM Medico
    `${getDataDoctor.RQE}`,  // RQE Medico
    `${catchingPatientbyIdentifier.map((data) => data.nome)}`, // Nome Paciente
    `${catchingPatientbyIdentifier.map((data) => data._id)}`, // id Paciente (Prontuario)
    `${catchingPatientbyIdentifier.map((data) => data.Data)}`, // Data de Nascimento Paciente
    `${catchingPatientbyIdentifier.map((data) => data.Genero)}`, // Genero Paciente
    `${catchingPatientbyIdentifier.map((data) => data.CPF)}`, // CPF Paciente
    `${catchingPatientbyIdentifier.map((data) => data.EstadoCivil)}`, // Estado Civil Paciente
    `${catchingPatientbyIdentifier.map((data) => data.Profissao)}`, // Profissão Paciente
    `${catchingPatientbyIdentifier.map((data) => data.EstadoPaciente)}`, // Estado Paciente
    `${catchingPatientbyIdentifier.map((data) => data.CidadePaciente)}`, // Cidade Paciente
    `${catchingPatientbyIdentifier.map((data) => data.EnderecoPaciente)}`,  // Bairro Paciente faltando
    `${catchingPatientbyIdentifier.map((data) => data.CEP)}`,  // Rua  Paciente faltando
    `${catchingPatientbyIdentifier.map((data) => data.telefone)}`,  // Bairro Paciente faltando
    `${UltimaConsulta.FichaPaciente}`, // Ficha do Paciente
    `${UltimaConsulta.Diagnostico}`, // Diagnóstico 
    `${UltimaConsulta.Tratamento}`, //Tratamento
    `${(UltimaConsulta.ReceitasSimples.map(data => data.ReceitaSimplesSolicitada)).concat(UltimaConsulta.ReceitasControlada.map(data => data.ReceitaControladaSolicitada)).join(', ')}`,
    `${UltimaConsulta.FerramentasTerapeuticas}`,// Ferramenta Terapeutica
    `${UltimaConsulta.Progresso}`, // Progresso
    `${UltimaConsulta.RecomendacoesFuturas}`, // Recomendaçoes Futuras
    `${getDataDoctor.EnderecoMedico}`,
  )

  FilesToDownload.push(`/documents/${FileLaudo}`)
  const LaudoCompletePath = join(currentDir, '../..', 'pdfs', `${FileLaudo}`)
  FilePathComplete.push(LaudoCompletePath)

  await models.ModelRegisterMédico.findOneAndUpdate(
    {
      _id: idMedico,
      'ConsultasSolicitadasPacientes._id': IdentificadorConsultaPaciente
    },
    {
      $push: {
        'ConsultasSolicitadasPacientes.$.LaudoDocumento':  FileLaudo
      }
    },
    {
      new: true
    }
  )
  
  if(UltimaConsulta.ReceitasSimples.length > 0){

    const CreatedReceitaSimples = UltimaConsulta.ReceitasSimples.map(async (data, index) => {
      const FileReceitaSimples = await CreateReceitaSimples(
          `${catchingPatientbyIdentifier.map((data) => data.nome)}`,
          `${catchingPatientbyIdentifier.map((data) => data.CPF)}`,
          `${data.ReceitaSimplesSolicitada}`,
          `${getDataDoctor.NomeEspecialista}`,
          `${getDataDoctor.UFCRM}`,
          `${getDataDoctor.CRM}`,
          `${getDataDoctor.EnderecoMedico}`,
          index,
          DataAtual,
      );
  
      return FileReceitaSimples;
  });
  
  const ResultCreateReceitaSimples =  await Promise.all(CreatedReceitaSimples)

  ResultCreateReceitaSimples.map(data => {
    FilesToDownload.push(`/documents/${data}`)
    const ReceitaSimplesCompletePath = join(currentDir, '../../..', 'pdfs', `${data}`)
    FilePathComplete.push(ReceitaSimplesCompletePath)
  })
  

  await models.ModelRegisterMédico.findOneAndUpdate(
    {
      _id: idMedico,
      'ConsultasSolicitadasPacientes._id': IdentificadorConsultaPaciente
    },
    {
      $push: {
        'ConsultasSolicitadasPacientes.$.ReceitaSimplesDocumento':  ResultCreateReceitaSimples 
      }
    },
    {
      new: true
    }
  )
  }
  
  if(UltimaConsulta.ReceitasControlada.length > 0){
      
    const CreatedReceitaControlada = UltimaConsulta.ReceitasControlada.map(async (data, index) => {
      const FileReceitaControlada = await CreateReceitaControlada(
        `${getDataDoctor.NomeEspecialista}`, 
        `${getDataDoctor.CRM}`,
        `${getDataDoctor.EnderecoMedico}`, 
        `${getDataDoctor.Cidade}`, 
        `${getDataDoctor.Estado}`,
        `${getDataDoctor.UFCRM}`, 
         DataAtual,
        `${catchingPatientbyIdentifier.map(data => data.nome)}`, 
        `${catchingPatientbyIdentifier.map(data => data.CPF)}`,
        `${catchingPatientbyIdentifier.map(data => data.EnderecoPaciente)}`,
         data.ReceitaControladaSolicitada,
         index,
        )
  
      return FileReceitaControlada
  });
  
  const ResultCreateReceitaControlada = await Promise.all(CreatedReceitaControlada)

  ResultCreateReceitaControlada.map(data => {
    FilesToDownload.push(`/documents/${data}`)
    const FileReceitaControladaComplete = join(currentDir, '../..', 'pdfs', `${data}`)
    FilePathComplete.push(FileReceitaControladaComplete)
  })

   await models.ModelRegisterMédico.findOneAndUpdate(
       {
         _id: idMedico,
         'ConsultasSolicitadasPacientes._id': IdentificadorConsultaPaciente
        },
        {
          $push: {
            'ConsultasSolicitadasPacientes.$.ReceitaControladaDocumento': ResultCreateReceitaControlada
          }
        },
        {
          new: true
        }
      ) 
  }

  if(UltimaConsulta.Atestado.length > 0){
      const CreatedAtestado = UltimaConsulta.Atestado.map(async (data, index) => {
        const FileAtestado = await CreateAtestado(
          `${getDataDoctor.NomeEspecialista}`, 
          `${getDataDoctor.CRM}`, 
          `${getDataDoctor.UFCRM}`, 
          `${catchingPatientbyIdentifier.map((data) => data.nome)}`, 
          `${catchingPatientbyIdentifier.map((data) => data.CPF)}`, 
           data.DiasDeAtestado,
           data.CID,
          `${getDataDoctor.Cidade}`,
          `${getDataDoctor.EnderecoMedico}`,
           DataAtual,
           index,
          )
    
        return FileAtestado
    });
    
    const ResultCreatedAtestado = await Promise.all(CreatedAtestado)

    ResultCreatedAtestado.map(data => {
      FilesToDownload.push(`/documents/${data}`)
      const FileAtestadoComplete = join(currentDir, '../..', 'pdfs', `${data}`)
      FilePathComplete.push(FileAtestadoComplete)
      
    })

      await models.ModelRegisterMédico.findOneAndUpdate(
        {
          _id: idMedico,
          'ConsultasSolicitadasPacientes._id': IdentificadorConsultaPaciente
        },
        {
          $push: {
            'ConsultasSolicitadasPacientes.$.AtestadosDocumento': ResultCreatedAtestado
          }
        },
        {
          new: true
        }
      ) 
  }
  
  if(UltimaConsulta.ExameSolicitado.length > 0){

     const CreatedExame = UltimaConsulta.ExameSolicitado.map(async (data, index) => {
      const FileExame =  await CreateExame(
        `${catchingPatientbyIdentifier.map((data) => data.nome)}`,
         data.Exame,  
        `${getDataDoctor.NomeEspecialista}`, 
        `${getDataDoctor.CRM}`, 
        `${getDataDoctor.UFCRM}`, 
        `${getDataDoctor.EnderecoMedico}`,
         index,
         DataAtual,
       )
  
      return FileExame
  });
  
  const ResultCreateExame = await Promise.all(CreatedExame)

  ResultCreateExame.map(data => {
    FilesToDownload.push(`/documents/${data}`)
    const FileExameComplete = join(currentDir, '../..', 'pdfs', `${data}`)
    FilePathComplete.push(FileExameComplete)
  })

  await models.ModelRegisterMédico.findOneAndUpdate(
     {
        _id: idMedico,
        'ConsultasSolicitadasPacientes._id': IdentificadorConsultaPaciente
      },
      {
        $push: {
          'ConsultasSolicitadasPacientes.$.ExamesDocumento': ResultCreateExame
        }
      },
      {
        new: true
      }
  ) 
  }

    const OneArrFiles = FilesToDownload.flat()
    const OneArrFilesCompletes = FilePathComplete.flat()

    res.status(200).json({ files: OneArrFiles })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Erro ao criar Laudo Médico' })
  }
}

export const getConsulta = async (body, res) => {
  const { IdentificadorConsulta } = body

  try {
    if (!IdentificadorConsulta || IdentificadorConsulta === '') {
      return res.status(400).json({ message: 'Identificador Consulta é uma String Vazia...' })
    }

    const getConsulta = await models.ModelRegisterPaciente.find({
      'ConsultasSolicitadasPacientes._id': IdentificadorConsulta
    })

    if (getConsulta.length > 0) {
      return res.status(200).json({ getConsulta })
    } else {
      return res.status(404).json({ message: 'Consulta nao cadastrada no banco de dados do Interconsulta =/' })
    }
  } catch (error) {
    console.error(error); // Log o erro para o console do servidor
    return res.status(500).json({ message: 'Erro interno do servidor' });
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
  const { id, IdentificadorConsulta, FichaPaciente, Diagnostico, Tratamento, FerramentasTerapeuticas, Progresso, SolicitacaoMateriais, RecomendacoesFuturas, EstadoPaciente, Solicitacao, CRMMedicoAtendeu, DataInsercao } = body;

  try {

    const dataDoctor = await models.ModelRegisterMédico.findById(id)


    const QueryConsultaMedico = await models.ModelRegisterMédico.findOne(
      { 'ConsultasSolicitadasPacientes._id': IdentificadorConsulta },
      { 'ConsultasSolicitadasPacientes.$': 1 } 
    )
    
    const ReceitasSimples = QueryConsultaMedico.ConsultasSolicitadasPacientes[0].ReceitasSimples
    const ReceitasControlada = QueryConsultaMedico.ConsultasSolicitadasPacientes[0].ReceitasControlada;
    const Atestado = QueryConsultaMedico.ConsultasSolicitadasPacientes[0].Atestado
    const ExameSolicitado = QueryConsultaMedico.ConsultasSolicitadasPacientes[0].ExameSolicitado

    const AreaAtuacao = dataDoctor.AreadeAtuacao
    const Especialidade = dataDoctor.EspecialidadeMedica

    if (QueryConsultaMedico) {

      const updateStateConsultaMedico = await models.ModelRegisterMédico.findByIdAndUpdate(
        id, 
        {
          $set: {
            'ConsultasSolicitadasPacientes.$[element].FichaPaciente': FichaPaciente,
            'ConsultasSolicitadasPacientes.$[element].Status': `Atendida por ${dataDoctor.NomeEspecialista}`,
            'ConsultasSolicitadasPacientes.$[element].Diagnostico': Diagnostico,
            'ConsultasSolicitadasPacientes.$[element].Tratamento': Tratamento,
            'ConsultasSolicitadasPacientes.$[element].FerramentasTerapeuticas': FerramentasTerapeuticas,
            'ConsultasSolicitadasPacientes.$[element].Progresso': Progresso,
            'ConsultasSolicitadasPacientes.$[element].RecomendacoesFuturas': RecomendacoesFuturas,
          },
        },
        {
          arrayFilters: [{ 'element._id': IdentificadorConsulta }],
          new: true, 
        }
      )

      const result = await models.ModelRegisterPaciente.findOneAndUpdate(
        { 'ConsultasSolicitadasPacientes._id': IdentificadorConsulta },
         {
           $push: {
             Historico: {
               FichaPaciente,
               Diagnostico,
               Tratamento,
               FerramentasTerapeuticas,
               Progresso,
               SolicitacaoMateriais,
               ReceitasSimples: ReceitasSimples,
               ReceitasControlada: ReceitasControlada,
               Atestado: Atestado,
               ExameSolicitado: ExameSolicitado,
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

      if (updateStateConsultaMedico) {
        res.status(200).json({ message: 'Atualização da Consulta feita com Sucesso' })
       //Production
      axios.post('http://back-a:8081/api2/automatic-whatsapp', {
          route: '/resumo-casos-clinicos',
          FichaPaciente: FichaPaciente,
          Diagnostico: Diagnostico,
          Tratamento: Tratamento,
          FerramentasTerapeuticas: FerramentasTerapeuticas,
          Progresso: Progresso,
          SolicitacaoMateriais: SolicitacaoMateriais,
          RecomendacoesFuturas: RecomendacoesFuturas,
          EstadoPaciente: EstadoPaciente,
          ReceitaSimples: ReceitasSimples,
          ReceitaControlada: ReceitasControlada,
          Atestado: Atestado,
          Exame: ExameSolicitado,
          result: result
       }).then(response => response).catch(err => err)
      //Development
        /*axios.post('http://localhost:8081/api2/automatic-whatsapp', {
          route: '/resumo-casos-clinicos',
          FichaPaciente: FichaPaciente,
          Diagnostico: Diagnostico,
          Tratamento: Tratamento,
          FerramentasTerapeuticas: FerramentasTerapeuticas,
          Progresso: Progresso,
          SolicitacaoMateriais: SolicitacaoMateriais,
          RecomendacoesFuturas: RecomendacoesFuturas,
          EstadoPaciente: EstadoPaciente,
          ReceitaSimples: ReceitasSimples,
          ReceitaControlada: ReceitasControlada,
          Atestado: Atestado,
          Exame: ExameSolicitado,
          result: result
         }).then(response => response).catch(err => err)*/
        
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


export const getDataDoctor = async (body, res) => {
    const { id } = body

    try{ 
       const getDoctor = await models.ModelRegisterMédico.findById(id)
        
       if(!getDoctor){
        return res.status(500).json({ message: 'Médico nao existe no banco de dados do Interconsulta'})
       }
       
       res.status(200).json({ getDoctor })
    }catch(error){
      return res.status(500).json({ message: 'Erro ao pegar insformaçoes do Médico'}) 
    }
}

export const SavedReceitaSimples = async (id, receitaSimples, res) => {
  try {
    const insertReceitaSimples = await models.ModelRegisterMédico.findOneAndUpdate(
      { 'ConsultasSolicitadasPacientes._id': id },
      {
        $push: {
          'ConsultasSolicitadasPacientes.$.ReceitasSimples': { 
            ReceitaSimplesSolicitada: receitaSimples,
            TypeDocument: 'Receita' 
          }
        }
      },
      { new: true }
    );
     
    if (!insertReceitaSimples) {
      return res.status(404).json({ message: "Consulta nao encontrada" });
    }

    return res.status(200).json({ message: 'Receita Simples salva com sucesso'});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao salvar receita simples." });
  }
}


export const getReceitaSimples = async (id, res) => {

  const getReceitaSimples = await models.ModelRegisterMédico.findOne({ 'ConsultasSolicitadasPacientes._id': id })

  if(!getReceitaSimples){
    return res.status(400).json({ message: "Consulta nao existe"})
  }

  const receitasSimples = getReceitaSimples.ConsultasSolicitadasPacientes.find(consulta => consulta._id.equals(id)).ReceitasSimples

  return res.status(200).json({ receitas: receitasSimples })
  
}

export const DeleteReceitaSimples = async(idConsulta,idReceitaS, res) => {
     try{
      const deleteReceitaSimples = await models.ModelRegisterMédico.findOneAndUpdate(
        { 'ConsultasSolicitadasPacientes._id': idConsulta},
        {
          $pull: {
            'ConsultasSolicitadasPacientes.$.ReceitasSimples': { _id: idReceitaS }
          }
        },
         { new: true }
        )

        if(!deleteReceitaSimples){
          return res.status(400).json({ message: 'Nao foi possivel encontrar essa Receita Simples para exclui-la'})
        }


      return res.status(200).json({ message: 'Receita Simples Excluida'})
        
     }catch(error){
      return res.status(500).json({ message: 'Erro ao excluir Receita Simples'})
     }
}

export const SavedReceitaControlada = async(id, receitaControlada, res) => {
  try {
    const insertReceitaControlada = await models.ModelRegisterMédico.findOneAndUpdate(
      { 'ConsultasSolicitadasPacientes._id': id },
      {
        $push: {
          'ConsultasSolicitadasPacientes.$.ReceitasControlada': {
             ReceitaControladaSolicitada: receitaControlada,
             TypeDocument: 'Receita'  
          }
        }
      },
      { new: true }
    );
      
    if (!insertReceitaControlada) {
      return res.status(404).json({ message: "Consulta nao encontrada" });
    }

    return res.status(200).json({ message: 'Receita Controlada salva com sucesso!'});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao salvar receita Controlada." })
  }
}


export const getReceitaControlada = async (id, res) => {
  const getReceitaControlada = await models.ModelRegisterMédico.findOne({ 'ConsultasSolicitadasPacientes._id': id })

  if(!getReceitaControlada){
    return res.status(400).json({ message: 'Consulta nao existe!'})
  }
  
  const receitasControladas = getReceitaControlada.ConsultasSolicitadasPacientes.find(consulta => consulta._id.equals(id)).ReceitasControlada

  res.status(200).json({ receitasControladas: receitasControladas })
}

export const DeleteReceitaControlada = async(idConsulta, idReceitaC, res) => {
  try{
    const deleteReceitaControlada = await models.ModelRegisterMédico.findOneAndUpdate(
      { 'ConsultasSolicitadasPacientes._id': idConsulta},
      {
        $pull: {
          'ConsultasSolicitadasPacientes.$.ReceitasControlada': { _id: idReceitaC }
        }
      },
       { new: true }
      )

      if(!deleteReceitaControlada){
        return res.status(400).json({ message: 'Nao foi possivel encontrar essa Receita Controlada para exclui-la'})
      }

      return res.status(200).json({ message: 'Receita Controlada Excluida'})
      
   }catch(error){
    return res.status(500).json({ message: 'Erro ao excluir Receita Controlada'})
   }
}

export const SaveAtestado = async (id, diasAfastamento, CID, res) => {
  try{
    const insertAtestado = await models.ModelRegisterMédico.findOneAndUpdate(
      { 'ConsultasSolicitadasPacientes._id': id },
      {
        $push: {
          'ConsultasSolicitadasPacientes.$.Atestado': {
             DiasDeAtestado: diasAfastamento,
             CID: CID,
             TypeDocument: 'Atestado'
          }
        }
      },
      { new: true }
    )
      
    if (!insertAtestado) {
      return res.status(404).json({ message: "Atestado não encontrado" })
    }
             
    return res.status(200).json({ message: 'Atestado salvo com sucesso!'});
  }catch(error){
    return res.status(500).json({ message: 'Erro ao Salvar Atestado' })
  }
}

export const getAtestado = async (id, res) => {
  try{
    const getAtestado = await models.ModelRegisterMédico.findOne({ 'ConsultasSolicitadasPacientes._id': id })

    if(!getAtestado){
      return res.status(400).json({ message: 'Atestado não existe!'})
    }
    
    const Atestado = getAtestado.ConsultasSolicitadasPacientes.find(consulta => consulta._id.equals(id)).Atestado

    res.status(200).json({ Atestado: Atestado })

  }catch(error){
   return res.status(500).json({ message: 'Erro ao pegar Atestado' })
  }
}

export const DeleteAtestado = async (idConsulta, idAtestado, res) => {
   try{
    const DeleteAtestado = await models.ModelRegisterMédico.findOneAndUpdate(
      { 'ConsultasSolicitadasPacientes._id': idConsulta},
      {
        $pull: {
          'ConsultasSolicitadasPacientes.$.Atestado': { _id: idAtestado }
        }
      },
       { new: true }
      )

      if(!DeleteAtestado){
        return res.status(400).json({ message: 'Nao foi possivel encontrar Atestado para Exclui - lo'})
      }

      return res.status(200).json({ message: 'Atestado Excluido'})
   }catch(error){
    return res.status(500).json({ message: 'Erro ao Excluir o Atestado '})
   }
}


export const SaveExamesSolicitadosDoctor = async (id, exame, res) => {
  try {
    const insertExame = await models.ModelRegisterMédico.findOneAndUpdate(
      { 'ConsultasSolicitadasPacientes._id': id },
      {
        $push: {
          'ConsultasSolicitadasPacientes.$.ExameSolicitado': { 
            Exame: exame,
            TypeDocument: 'Exame'  
           }
        }
      },
      { new: true }
    )
    
    if (!insertExame) {
      return res.status(404).json({ message: "Exame nao encontrado" });
    }

    return res.status(200).json({ message: 'Exato Salvo com sucesso' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao salvar Exame" })
  }
}


export const getExames = async (id, res) => {
  try{
    const getExames = await models.ModelRegisterMédico.findOne({ 'ConsultasSolicitadasPacientes._id': id });

    const exames = getExames.ConsultasSolicitadasPacientes.find(consulta => consulta._id.equals(id)).ExameSolicitado
    return res.status(200).json({ exames: exames })
  }catch(error){
    return res.status(500).json({ message: 'Erro ao pegar Exames'})
  }
}


export const editExames = async (idExame, newExame, res) => {
  try{
    const EditExames = await models.ModelRegisterMédico.findOneAndUpdate(
      { 
       'ConsultasSolicitadasPacientes.$.ExameSolicitado': { _id: idExame }
      },
      {
        $set: {
          'ConsultasSolicitadasPacientes.$.ExameSolicitado': { Exame: newExame }
        }
      },
      { new: true }
    )

    if(!EditExames){
      return res.status(400).json({ message: 'A consulta nao existe'})
    }

    res.status(200).json({ message: 'Exame atualizado com sucesso'})
  }catch(error){
    return res.status(500).json({ message: 'Erro ao Editar Exame'})
  }
}


export const DeleteExamesSolicitadosDoctor = async (idConsulta, idExame, res) => {
  try{
    const deleteExames = await models.ModelRegisterMédico.findOneAndUpdate(
      { 'ConsultasSolicitadasPacientes._id': idConsulta },
      {
        $pull: {
          'ConsultasSolicitadasPacientes.$.ExameSolicitado': { _id: idExame }
        }
      },
       { new: true }
      )

      if(!deleteExames){
        return res.status(400).json({ message: 'Nao foi possivel encontrar esse Exame para exclui-lo'})
      }

     return res.status(200).json({ message: 'Exame Excluido'})
      
   }catch(error){
    return res.status(500).json({ message: 'Erro ao excluir Exame'})
   }
}


export const VerifyDocuments = async (id, res) => {
  try {
    const getConsulta = await models.ModelRegisterMédico.findOne(
      { 'ConsultasSolicitadasPacientes._id': id },
      { 'ConsultasSolicitadasPacientes.$': 1 }
    );

    if (!getConsulta) {
      return res.status(400).json({ message: 'Consulta não existe' });
    }

    res.status(200).json({ consulta: getConsulta.ConsultasSolicitadasPacientes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar consulta' });
  }
}


export const ValidatorDocuments = async (id, res) => {
  try{
    const Consulta = await models.ModelRegisterMédico.findOne(
      { 'ConsultasSolicitadasPacientes._id': id },
      { 'ConsultasSolicitadasPacientes.$': 1 }
    );

    if(!Consulta){
      return res.status(400).json({ message: 'Consulta nao existe!'})
    }

    const getDocumentsPatient = Consulta.ConsultasSolicitadasPacientes.map((data) => data.DocumentosSolicitadosPaciente).flat()
    
    const receitasSimples = Consulta.ConsultasSolicitadasPacientes.map((data) => data.ReceitasSimples.map((data) => data.TypeDocument))
    const receitasControladas = Consulta.ConsultasSolicitadasPacientes.map((data) => data.ReceitasControlada.map((data) => data.TypeDocument))
    const Atestado = Consulta.ConsultasSolicitadasPacientes.map((data) => data.Atestado.map((data) => data.TypeDocument))
    const exames = Consulta.ConsultasSolicitadasPacientes.map((data) => data.ExameSolicitado.map((data) => data.TypeDocument))

    const TottalyDocumentsDoctor = receitasSimples.concat(receitasControladas, Atestado, exames).flat()

    const VerifyPreenchimentoDocumentsDoctor = getDocumentsPatient.every(item => TottalyDocumentsDoctor.includes(item) )

    if(VerifyPreenchimentoDocumentsDoctor === true){
      return res.status(200).json({ VerifyPreenchimentoDocumentsDoctor })
    }else{
    //Documentos Faltando
      const TottalyDocumentsDoctor2 = new Set(TottalyDocumentsDoctor)
      const getDocumentsPatientFlat2 = new Set(getDocumentsPatient)

      const missingDocuments = [...getDocumentsPatientFlat2].filter(item => !TottalyDocumentsDoctor2.has(item))
      return res.status(200).json({ missingDocuments })
    }
    
  }catch(error){
    return res.status(500).json({ message: 'Erro ao Validar documentos'})
  }
}


export const AtualizedDocuments = async (receitaSimples, receitaControlada, atestado, exame, IdentificadorConsulta,res) => {
  try {
    if (receitaSimples !== null) {

     await models.ModelRegisterMédico.findOneAndUpdate(
         {
          'ConsultasSolicitadasPacientes._id': IdentificadorConsulta
         },
         {
           $set:{
            'ConsultasSolicitadasPacientes.$.ReceitasSimples': receitaSimples,
           },
         },
         { new: true }
        )

    }        
  
    if (receitaControlada !== null) {
        await models.ModelRegisterMédico.findOneAndUpdate(
          {
            'ConsultasSolicitadasPacientes._id': IdentificadorConsulta
          },
          {
            $set:{
              'ConsultasSolicitadasPacientes.$.ReceitasControlada': receitaControlada,
            },
          },
          { new: true }
      )

    }

    if (atestado !== null) {
      await models.ModelRegisterMédico.findOneAndUpdate(
        {
          'ConsultasSolicitadasPacientes._id': IdentificadorConsulta
        },
        {
          $set:{
            'ConsultasSolicitadasPacientes.$.Atestado': atestado,
          },
        },
        { new: true }
      )

    }

    if (exame !== null) {
      await models.ModelRegisterMédico.findOneAndUpdate(
        {
          'ConsultasSolicitadasPacientes._id': IdentificadorConsulta
        },
        {
          $set:{
            'ConsultasSolicitadasPacientes.$.ExameSolicitado': exame,
          },
        },
        { new: true }
      )
      
    }

    return res.status(200).json({ message: 'Documentos Atualizados e salvos com sucesso!'})
  } catch (error) {
    return res.status(500).json({ message: 'Error internal Server' });
  }
}


export const getDataPatientEndRoom = async (id,res) => {
   try{
    const dataPatient = await models.ModelRegisterPaciente.findOne(
      { 'ConsultasSolicitadasPacientes._id': id },
    )

    const NomePaciente = dataPatient.nome
    const FotoPaciente = dataPatient.Foto


    if(!dataPatient){
      return res.status(404).json({ message: 'Paciente nao existe dentro do banco de dados do Interconsulta'})
    }

    return res.status(200).json({ NomePaciente, FotoPaciente })

   }catch(error){
    return res.status(500).json({ message: 'Error internal Server' })
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

    //Production
    axios.post('http://back-a:8081/api2/automatic-whatsapp', {
      route: '/send-documents-patient',
      NamePatient: NomePaciente,
      NameDoctor: NomeMedico,
      PathsFiles: files,
      NumberPatient: NumeroPaciente,
      EmailPatient: EmailPatient,
    }).then(response => response).catch(err => err)
    //Development
    /*axios.post('http://localhost:8081/api2/automatic-whatsapp', {
      route: '/send-documents-patient',
      NamePatient: NomePaciente,
      NameDoctor: NomeMedico,
      PathsFiles: files,
      NumberPatient: NumeroPaciente,
      EmailPatient: EmailPatient,
    }).then(response => response).catch(err => err)*/

  }catch(error){
    return res.status(500).json({ message: 'Erro Internal Server'})
  }
}