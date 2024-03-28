import mongoose from 'mongoose'

const DadosIniciais = {
  nome: String,
  senha: String,
  email: String,
  telefone: String,
}

const ModelDataCasosClinicos = {
  Usuario: String,
  UnidadeSaude: String,
  Posição: String,
  MatrículaProntuário: String,
  CartãoSUS: String,
  Acompanhante: String,
  TelefoneAcompanhante: String,
  EmailAcompanhante: String,
  Endereço: String,
  Cidade: String,
  Estado: String,
  Pais: String,
  DataInsercao: String,
  Procedimento: String,
  CodProcedimento: String,
  CRM: String,
  Solicitante: String,
  Especialidade: String,
  SubEspecialidade: String,
  TipoSolicitaçao: String,
  Diagnóstico: String,
  Tratamento: String,
  Medicação: String,
  FerramentaTerapêutica: String,
  ProgressoPaciente: String,
  RecomendaçõesFuturas: String,
  StatusPaciente: String,
  Medicamentos: [String],
  Material: [String],
  Data: String,
  FotoEspecialidade: String,
  ResumoCasoClinico: String
}

const ModelGestoesSolicitadas = {
  Inicio: String,
  Fim: String,
  OrçamentoEscolhido: String,
  ValorPorConsulta: String,
  CréditosDisponiveis: String,
  DiferençaDiasGestor: String,
  QuantidadeCasosClinicosPlanilha: String,
  AtendimentoNecessariosDia: String,
  SaudoDisponivel: String,
  QuantidadeMedicosDisponiveis: String,
  DatasMedicosDisponiveis: [String],
  QuantidadeHorariosMedicosDisponiveis: String,
  AtendimentosDiaMedicos:[String],
  ValorTotalAtendimentosDiaMedico: String,
  AgendamentosFaltando: String,
  DiferencaEntreDiasDosMedicos: String,
  CasosClinicosSuportados: String,
  MediaAtendimentosDia: String,
  FraseFinalConsolidada: String,
  OrçamentoEstimado: String,
  MedicosDisponiveis: [{
     Nome: String,
     Especialidade: String,
     AreadeAtuacao: String,
     CRM: String,
  }]
}

const RegisterMédico = new mongoose.Schema({
  ...DadosIniciais,
  NomeEspecialista: String,
  TituloEspecialista: String,
  FormacaoEspecialista: String,
  PosGraduacao: String,
  EspecialidadeMedica: String,
  AreadeAtuacao: String,
  CRM: String,
  UFCRM: String,
  RQE: String,
  Certificacao: String,
  ResumoProfissional: String,
  Slug: String,
  Foto: String, 
  online: Boolean,
  FotoEspecialidade: String,
  PrecoConsulta: String,
  DataNascimento: String,
  Idade: String,
  FerramentasTerapeuticas: [String],
  AnoGraduacao: String,
  QuantidadeTempoAnoGraduacao: String,
  InstituicaoResidencia: String,
  NomeTitular: String,
  NumeroConta: String,
  NumeroAgencia: String,
  Banco: String,
  ChavePix: String,
  CPNJMedico: String,
  CPFMedico: String,
  RazaoSocialEmpresa: String,
  NomeFantasia: String,
  EnderecoMedico: String,
  Bairro: String,
  Cidade: String,
  Estado: String,
  CEPMedico: String,
  EmailContador: String,
  TelefoneContador:String,
  TypeDoctor: String,
  PasswordRecovery: [{
    code: String,
    expirationCode: Date
  }],
  DoencasAndSintomas: [{
    Doenca: String,
    Sintomas: [String],
    PrincipaisCausas: String,
    FormasDeTratamento: String,
    ComoPrevenir: String,
    TemCura:String,

  }],
  Horarios: [{
    data: String,
    inicio: String,
    fim: String,
    HorasDedicadas: Number,
    AtendimentosDia: Number,
    IntervaloAtendimentos: [{
      Intervalo: String,
      Escolhido: String,
      FotoPaciente: String,
    }],
    Gerado: String,
    DayDuplicate: Boolean,
    TempoDeConsulta: Number
  }],
  TotalAtendimentos:String,
  ConsultasSolicitadasPacientes: [{
    Data: String,
    Inicio: String,
    Fim: String,
    Solicitante: String,
    Solicitado: String,
    CPFPaciente: String,
    FotoPaciente: String,
    Casos: String,
    Status: String,
    HorarioSelecionado: String,
    Resumo: String,
    idHorario: String,
    TempoConsulta: Number,
    DocumentosSolicitadosPaciente:[String],
    FichaPaciente: String,
    Diagnostico: String,
    Tratamento: String,
    FerramentasTerapeuticas: String,
    Progresso: String,
    RecomendacoesFuturas: String,
    LinkConsulta: [{
      Link: String,
      expiration: Date,
    }],
    ReceitasSimples:[{
      TypeDocument: String,
      ReceitaSimplesSolicitada: String,
    }],
    ReceitasControlada:[{
      TypeDocument: String,
      ReceitaControladaSolicitada: String,
    }],
    Atestado:[{
      TypeDocument: String,
      DiasDeAtestado: String,
      CID: String,
    }],
    ExameSolicitado: [{
      TypeDocument: String,
      Exame: String,
    }],
    LaudoDocumento: [String],
    ReceitaSimplesDocumento: [String],
    ReceitaControladaDocumento: [String],
    AtestadosDocumento: [String],
    ExamesDocumento: [String],
    OkMedico: [String],
    OkPaciente: [String],
  }],
  ConsultasUnidadedeSaude: [{
    Data: String,
    Inicio: String,
    Fim: String,
    Solicitante: String,
    EmailSolicitante: String,
    NumeroSolicitante: String,
    Solicitado: String,
    EspecialidadeSolicitado: String,
    NomeUnidadeSolicitante: String,
    FotoUnidadeSolicitante: String,
    Casos: [{
      CPF: String,
      Doenca: String,
      NomePaciente:String,
      QuantidadeCasosClinicos: Number,
      IdentificadorConsulta: String,
    }],
    Status: String,
    Consulta: String,
  }],
  Avaliacoes:[{
    AvaliacoesStar: Number,
    AvaliacoesText: String,
    Foto: String,
    NomePaciente: String,
  }],
  mediaAvaliacoes : Number,
  CapacityNotification: Number
})

const RegisterPaciente = new mongoose.Schema({
  ...DadosIniciais,
  Genero: String,
  Data: String,
  Doenca: String,
  CPF: String,
  Foto: String,
  EspecialidadePaciente: String,
  Idade: String,
  TipoSanguineo: String,
  EstadoCivil: String,
  Profissao: String,
  CEP: String,
  EnderecoPaciente: String,
  CidadePaciente: String,
  EstadoPaciente: String,
  Pais: String,
  CartaoSUS: String,
  NomeAcompanhante: String,
  TelefoneAcompanhante: String,
  EmailAcompanhante: String,
  GifDoenca: String,
  QueixaInicial: String,
  ChavePix: String,
  PasswordRecovery: [{
    code: String,
    expirationCode: Date
  }],
  SolicitationDoctors: [String],
  TrackingUTMAQ:[{
    data: String,
    UTM_Referrer: String,
    UTM_Funil: String,
    UTM_Temp: String,
    UTM_Rota: String,
    UTM_Source: String,
    UTM_Medium: String,
    UTM_Campaign: String,
    UTM_Term: String,
    UTM_Content: String,
  }],
  TrackingUTMCS:[{
    data: String,
    UTM_Referrer: String,
    UTM_Funil: String,
    UTM_Temp: String,
    UTM_Rota: String,
    UTM_Source: String,
    UTM_Medium: String,
    UTM_Campaign: String,
    UTM_Term: String,
    UTM_Content: String,
  }],
  ConsultasSolicitadasPacientes: [{
    Data: String,
    Inicio: String,
    Fim: String,
    Solicitante: String,
    Solicitado: String,
    CPFPaciente: String,
    Casos: String,
    Status: String,
    HorarioSelecionado: String,
    Resumo: String,
    idHorario: String,
    TempoConsulta: Number,
    DocumentosSolicitadosPaciente:[String],
    LinkConsulta: [{
      Link: String,
      expiration: Date,
    }],
    OkMedico: [String],
    OkPaciente: [String],
  }],
  Historico:[{
    FichaPaciente: String,
    Diagnostico: String,
    Tratamento: String,
    FerramentasTerapeuticas: String,
    Progresso: String,
    SolicitacaoMateriais: String,
    ReceitasSimples:[{
      TypeDocument: String,
      ReceitaSimplesSolicitada: String,
    }],
    ReceitasControlada:[{
      TypeDocument: String,
      ReceitaControladaSolicitada: String,
    }],
    Atestado:[{
      TypeDocument: String,
      DiasDeAtestado: String,
      CID: String,
    }],
    ExameSolicitado: [{
      TypeDocument: String,
      Exame: String,
    }],
    RecomendacoesFuturas: String,
    EstadoPaciente: String,
    CRMMedicoAtendeu:  String,
    DataInsercao: String,
    AreaAtuacao: String,
    Especialidade: String,
    ResumoCasoClinico: String,
  }],
})

const RegisterUnidadeSaude = new mongoose.Schema({
  ...DadosIniciais,
  Endereco: String,
  nomeInstituicao: String,
  CPNJ: String,
  EspecialidadeDesejada: String,
  Foto: String,
  PasswordRecovery: [{
    code: String,
    expirationCode: Date
  }],
  GestoesSolicitadas: [{
    ...ModelGestoesSolicitadas  
  }],
  HistoricoQuantidadeCasosClinicos:[{
    QuantidadeCasosClinicos: String,
  }],
  ConsultasUnidadedeSaude: [{
    Data: String,
    Inicio: String,
    Fim: String,
    Solicitante: String,
    Solicitado: String,
    Casos: [{
      CPF: String,
      Doenca: String,
      NomePaciente:String,  
      QuantidadeCasosClinicos: Number,
      IdentificadorConsulta: String,
    }],
    Status: String,
  }],
  ConsultasAceitasUnidade: [{
    grupos: [{
      Inicio: String,
      Fim: String,
      Status: String,
      Responsavel: String,
      CRMMedico: String,
      NomeMedico: String,
      NomePaciente: String,
      CPFPaciente: String,
      LinkConsulta: String
    }],
  }],
})

const CasosClinicos = new mongoose.Schema({
  NomePaciente:String,
  DataNascimento:String,
  Idade: String,
  Sexo: String,
  EstadoCivil:String,
  Profissão: String,
  CPF: String,
  TipoSanguineo: String,
  Email: String,
  Telefone: String,
  FotoUnidadeResponsavel: String,
  NomeUnidadeResponsavel: String,
    Historico:[{
      ...ModelDataCasosClinicos
    }],
  MedicosEscolhidos:[{
    ids: [String]
  }],
  Duplicate: String,
})

const ListadeEspera = new mongoose.Schema({
  ListDeEspera:[{
    NomePaciente: String,
    CPF: String,
    Doenca: String,
  }]
})

const ListDoencasAndSintomasDoctor = new mongoose.Schema({
  Especialidade: String,
  AreadeAtuacao: String,  
  DoencasESintomas:[{
    Doenca: String,
    Sintomas: [String],
    PrincipaisCausas: String,
    FormasDeTratamento: String,
    ComoPrevenir: String,
    TemCura:String,
  }]
})

const SafeIDSchema = new mongoose.Schema({
  SafeID:[{
    link: String,
    idDoctor: String,
    code: String,
    acessToken: String,
    expires_in: Number,
    idSignature: String,
    PDFAssinado: String,
}]
})

const ModelRegisterMédico = mongoose.model('registerMédico', RegisterMédico)
const ModelRegisterPaciente = mongoose.model('registerPaciente', RegisterPaciente)
const ModelRegisterUnidadeSaude = mongoose.model('RegisterUnidadeSaude', RegisterUnidadeSaude)
const ModelCasosClinicos = mongoose.model('casosClinicos', CasosClinicos)
const List = mongoose.model('listDoctors', ListDoencasAndSintomasDoctor)
const SafeID = mongoose.model('SafeID', SafeIDSchema)
const ModelWaitList = mongoose.model('ListaDeEspera', ListadeEspera)


export const models = {
  ModelRegisterMédico,
  ModelRegisterPaciente,
  ModelRegisterUnidadeSaude,
  ModelCasosClinicos,
  List,
  SafeID,
  ModelWaitList 
};
