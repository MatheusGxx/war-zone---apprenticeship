import { Router } from 'express'

const router = Router()

import { AutomaticWhatsapp } from '../../services/AutomaticService.js'

router.post('/automatic-whatsapp', async (req, res) => {

  console.log(req.body)

  const body = {
    IdentificadorMedico: req.body.IdentificadorMedico,
    IdentificadorPaciente: req.body.IdentificadorPaciente,
    IdentificadorUnidade: req.body.IdentificadorUnidade,
    IdentificadorObrigadoMedico: req.body.IdentificadorObrigadoMedico,
    IdentificadorObrigadoPaciente: req.body.IdentificadorObrigadoPaciente,
    IdentificadorObrigadoUnidade: req.body.IdentificadorObrigadoUnidade,
    IdentificadorUnidadeSaudeRoute: req.body. IdentificadorUnidadeSaudeRoute,
    IdentificadorPacientePublico: req.body.IdentificadorPacientePublico,
    IdentificadorPacienteParticular: req.body. IdentificadorPacienteParticular,
    TelefoneMedicoAgendamento: req.body.TelefoneMedicoAgendamento,
    EmailMedico: req.body.EmailMedico,
    NomeMedico: req.body.NomeMedico,
    NomePaciente: req.body.NomePaciente,
    DataAgendamento: req.body.DataAgendamento,
    InicioAgendamento: req.body.InicioAgendamento,
    FimAgendamento: req.body.FimAgendamento,
    EmailPacienteAceitouConsulta: req.body.EmailPacienteAceitouConsulta,
    NomeMedicoAceitouConsulta: req.body.NomeMedicoAceitouConsulta,
    NumeroPacienteAceitouConsulta: req.body.NumeroPacienteAceitouConsulta,
    NomePacienteAceitouConsulta: req.body.NomePacienteAceitouConsulta,
    DataAceitouConsulta: req.body.DataAceitouConsulta,
    InicioAceitouConsulta: req.body.InicioAceitouConsulta,
    FimAceitouConsulta: req.body.FimAceitouConsulta,
    EmailPacienteRejeitouConsulta: req.body.EmailPacienteRejeitouConsulta,
    NomeMedicoRejeitouConsulta: req.body.NomeMedicoRejeitouConsulta,
    NumeroPacienteRejeitouConsulta: req.body.NumeroPacienteRejeitouConsulta,
    NomePacienteRejeitouConsulta: req.body.NomePacienteRejeitouConsulta,
    DataRejeitouConsulta: req.body.DataRejeitouConsulta,
    InicioRejeitouConsulta: req.body.InicioRejeitouConsulta,
    FimRejeitouConsulta: req.body.FimRejeitouConsulta,
    DoencaRejeitouConsulta: req.body.DoencaRejeitouConsulta,
    EmailMedicoExclusao: req.body.EmailMedicoExclusao,
    NumeroMedicoExclusao:req.body.NumeroMedicoExclusao,
    NomeMedicoExclusao: req.body.NomeMedicoExclusao,
    NomePacienteExclusao: req.body.NomePacienteExclusao,
    DataExclusaoPaciente: req.body.DataExclusaoPaciente,
    InicioExlusaoPaciente: req.body.InicioExlusaoPaciente,
    FimExclusaoPaciente: req.body.FimExclusaoPaciente,
    FichaPaciente: req.body.FichaPaciente,
    Diagnostico: req.body.Diagnostico,
    Tratamento: req.body.Tratamento,
    FerramentasTerapeuticas: req.body.FerramentasTerapeuticas,
    Progresso: req.body.Progresso,
    SolicitacaoMateriais: req.body.SolicitacaoMateriais,
    RecomendacoesFuturas: req.body.RecomendacoesFuturas,
    EstadoPaciente: req.body.EstadoPaciente,
    ReceitaSimples: req.body.ReceitaSimples,
    ReceitaControlada: req.body.ReceitaControlada,
    Atestado: req.body.Atestado,
    Exame:  req.body.Exame,
    result: req.body.result,
    NamePatient: req.body.NamePatient,
    NameDoctor: req.body.NameDoctor,
    PathsFiles: req.body.PathsFiles,
    NumberPatient: req.body.NumberPatient,
    EmailPatient: req.body.EmailPatient,
    route: req.body.route
  }

  const response = res

  AutomaticWhatsapp(body, response)
 
}) 

export default router