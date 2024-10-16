import { z } from 'zod';

export const VerifyLogin = z.object({
  email: z.string().email(),
  senha: z.string(),
  route: z.string()
})

export const VerifyRegister = z.object({
  nome: z.string(),
  email: z.string().email(),
  telefone: z.string().min(6),
  route: z.string(),
  doenca: z.string().optional(),
  EspecialidadeMedica: z.string().optional(),
  AreadeAtuacao: z.string().optional(),
  TypeDoctor: z.string().optional(),
  valorConsulta: z.string().optional(),
  tituloEspecialista: z.string().optional()
})


export const VerifyDataMédico = z.object({
  FormacaoEspecialista: z.string(),
  AnoGraduacao: z.string(),
  PosGraduacao: z.string(),
  CRM: z.string(),
  UFCRM: z.string(),
  InstituicaoResidencia: z.string(),
  DataNascimento: z.string(),
  RQE: z.string(),
  Certificacao: z.string(),
  ResumoProfissional: z.string(),
  FerramentasTerapeuticas: z.string(),
  NomeTitular: z.string(),
  NumeroConta: z.string(),
  NumeroAgencia: z.string(),
  Banco: z.string(),
  ChavePix: z.string(),
  CPNJMedico: z.string(),
  CPFMedico: z.string(),
  RazaoSocialEmpresa: z.string(),
  NomeFantasia: z.string(),
  EnderecoMedico: z.string(),
  Bairro: z.string(),
  Cidade: z.string(),
  Estado: z.string(),
  CEPMedico: z.string(),
})

export const VerifyDataPaciente = z.object({
  Genero: z.string(),
  Data: z.string(),
  Doenca: z.string(),
  TipoSanguineo: z.string(),
  EstadoCivil: z.string(),
  Profissao: z.string(),
  CPF: z.string(),
  CEP: z.string(),
  EnderecoPaciente: z.string(),
  CidadePaciente: z.string(),
  EstadoPaciente: z.string(),
  Pais: z.string(),
  CartaoSUS: z.string(),
  NomeAcompanhante: z.string(),
  TelefoneAcompanhante: z.string(),
  EmailAcompanhante: z.string(),
})

export const VefiryDataUnidade = z.object({
  Endereco: z.string(),
  nomeInstituicao: z.string(),
  CPNJ: z.string(),
  codeUnidade: z.string(),
})
