import { models } from "../../MongoDB/Schemas/Schemas.js";
import mongoose from 'mongoose';
import { addMinutes } from 'date-fns';
import { customAlphabet } from 'nanoid';
import { calculateTimeDifference } from "../utils/Functions/Validator.js";
import axios from 'axios';
import { TraduçaoAudioParaTextoIA } from '../utils/Functions/TraduçaoAudio.js';
import { Payment, MercadoPagoConfig } from 'mercadopago';
import { Pix, CartãoDeCrédito } from "../utils/Payment/Payments.js";

const alphabet = '0123456789';
const generateFourDigitNumber = customAlphabet(alphabet, 4);

const SAVED_CONSULTA_PACIENTE_PARTICULAR = async (body, res) => {
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
    DocumentosSolicitadosPaciente,
  } = body;

  // Validate input
  if (
    !IDPaciente ||
    !IDMedico ||
    !Caso ||
    !Data ||
    !Inicio ||
    !Fim ||
    !Solicitante ||
    !Solicitado ||
    !Status ||
    !HorarioSelecionado ||
    !Escolhido ||
    !idHorario ||
    !TempoConsulta ||
    !Resumo
  ) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

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
    DocumentosSolicitadosPaciente,
  };

  try {
    const consultaId = new mongoose.Types.ObjectId();
    const getPaciente = await models.ModelRegisterPaciente.findById(IDPaciente);

    if (!getPaciente) {
      return res.status(404).json({ message: 'Paciente not found' });
    }

    await models.ModelRegisterMédico.findOneAndUpdate(
      {
        _id: IDMedico,
        'Horarios._id': idHorario,
        'Horarios.IntervaloAtendimentos.Intervalo': HorarioSelecionado,
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
      }
    );

    Consulta._id = consultaId;
    Consulta.CPFPaciente = getPaciente.CPF;
    getPaciente.ConsultasSolicitadasPacientes.push(Consulta);
    getPaciente.save();

    const getMedico = await models.ModelRegisterMédico.findById(IDMedico);

    if (getMedico) {
      Consulta._id = consultaId;
      Consulta.CPFPaciente = getPaciente.CPF;
      Consulta.FotoPaciente = getPaciente.Foto;
      getMedico.ConsultasSolicitadasPacientes.push(Consulta);
      getMedico.save();
    }

    const body = {
      route: '/especialistas-disponiveis-agendamento',
      TelefoneMedicoAgendamento: getMedico.telefone,
      EmailMedico: getMedico.email,
      NomeMedico: getMedico.NomeEspecialista,
      DataAgendamento: Data,
      InicioAgendamento: Inicio,
      FimAgendamento: Fim,
      NomePaciente: getPaciente.nome,
    };

    //Production
    axios.post('http://back-a:8081/api2/automatic-whatsapp', body);
    //Development
    //axios.post('http://localhost:8081/api2/automatic-whatsapp', body);

    res.status(200).json({ message: 'Consulta Agendada com Sucesso' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Error internal in Server' });
  }
};

// ... Rest of the code

export {
  SAVED_CONSULTA_PACIENTE_PARTICULAR,
  // Add other function names here as needed
};
