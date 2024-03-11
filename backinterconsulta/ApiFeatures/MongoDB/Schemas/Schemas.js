import mongoose, { Schema, Document } from 'mongoose';

// Define types for the schemas
type DadosIniciaisType = {
  nome: string;
  senha: string;
  email: string;
  telefone: string;
};

type EnderecoType = {
  endereco: string;
  cidade: string;
  estado: string;
  pais: string;
};

type UsuarioType = {
  usuario: string;
  unidadeSaude: string;
  dataInsercao: string;
  statusPaciente: string;
};

type ProcedimentoType = {
  procedimento: string;
  codProcedimento: string;
  crm: string;
  solicitante: string;
  especialidade: string;
  subEspecialidade: string;
  tipoSolicitacao: string;
  diagnostico: string;
  tratamento: string;
  medicacao: string;
  ferramentaTerapeutica: string;
  progressoPaciente: string;
  recomendacoesFuturas: string;
  material: [string];
  data: string;
  fotoEspecialidade: string;
  resumoCasoClinico: string;
};

type GestaoSolicitadaType = {
  inicio: string;
  fim: string;
  orcamentoEscolhido: string;
  valorPorConsulta: string;
  creditosDisponiveis: string;
  diferencaDiasGestor: string;
  quantidadeCasosClinicosPlanilha: string;
  atendimentoNecessariosDia: string;
  saudoDisponivel: string;
  quantidadeMedicosDisponiveis: string;
  datasMedicosDisponiveis: [string];
  quantidadeHorariosMedicosDisponiveis: string;
  atendimentosDiaMedicos: [string];
  valorTotalAtendimentosDiaMedico: string;
  agendamentosFaltando: string;
  diferencaEntreDiasDosMedicos: string;
  casosClinicosSuportados: string;
  mediaAtendimentosDia: string;
  fraseFinalConsolidada: string;
  orcamentoEstimado: string;
  medicosDisponiveis: [{
    nome: string;
    especialidade: string;
    areadeAtuacao: string;
    crm: string;
  }];
};

type HorarioType = {
  data: string;
  inicio: string;
  fim: string;
  horasDedicadas: number;
  atendimentosDia: number;
  intervaloAtendimentos: [{
    intervalo: string;
    escolhido: string;
    fotoPaciente: string;
  }];
  gerado: string;
  dayDuplicate: boolean;
  tempoDeConsulta: number;
};

type ConsultaSolicitadaPacienteType = {
  data: string;
  inicio: string;
  fim: string;
  solicitante: string;
  solicitado: string;
  cpfPaciente: string;
  fotoPaciente: string;
  casos: string;
  status: string;
  horarioSelecionado: string;
  resumo: string;
  idHorario: string;
  tempoConsulta: number;
  documentosSolicitadosPaciente: [string];
  fichaPaciente: string;
  diagnostico: string;
  tratamento: string;
  ferramentasTerapeuticas: string;
  progresso: string;
  recomendacoesFuturas: string;
  linkConsulta: [{
    link: string;
    expiration: Date;
  }];
  receitasSimples: [{
    typeDocument: string;
    receitaSimplesSolicitada: string;
  }];
  receitasControlada: [{
    typeDocument: string;
    receitaControladaSolicitada: string;
  }];
  atestado: [{
    typeDocument: string;
    diasDeAtestado: string;
    cid: string;
  }];
  exameSolicitado: [{
    typeDocument: string;
    exame: string;
  }];
  laudoDocumento: [string];
  receitaSimplesDocumento: [string];
  receitaControladaDocumento: [string];
  atestadosDocumento: [string];
  examesDocumento: [string];
  okMedico: [string];
  okPaciente: [string];
};

type ConsultaUnidadeSaudeType = {
  data: string;
  inicio: string;
  fim: string;
  solicitante: string;
  emailSolicitante: string;
  numeroSolicitante: string;
  solicitado: string;
  especialidadeSolicitado: string;
  nomeUnidadeSolicitante: string;
  fotoUnidadeSolicitante: string;
  casos: [{
    cpf: string;
    doenca: string;
    nomePaciente: string;
    quantidadeCasosClinicos: number;
    identificadorConsulta: string;
  }];
  status: string;
  consulta: string;
};

type AvaliacaoType = {
  avaliacoesStar: number;
  aval
