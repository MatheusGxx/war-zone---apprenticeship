import { EspecialidadesAtendidas } from '../utils/EspecialidadesAtendidas.js'
import { models } from "../../MongoDB/Schemas/Schemas.js"
import { parse, eachMinuteOfInterval, format, differenceInMinutes } from "date-fns";
import { utcToZonedTime } from 'date-fns-tz';

export const getInfosMedico = async (params) => {
  const { id } = params;

  try {
    const getMedico = await models.ModelRegisterMédico.findById(id);

    if (getMedico) {
      return { InformacoesMedico: getMedico };
    } else {
      throw new Error('Medico not found in the database');
    }
  } catch (e) {
    console.log(e);
    throw new Error('An error occurred while fetching the medico information');
  }
}

export const GetSlug = async (params) => {
  const { id } = params;

  try {
    const ModelMedico = await models.ModelRegisterMédico.findById(id);

    if (ModelMedico) {
      return { SlugMedico: ModelMedico.Slug };
    } else {
      throw new Error('Medico not found in the database');
    }
  } catch (e) {
    console.log(e);
    throw new Error('An error occurred while fetching the medico slug');
  }
}

export const RegisterHorarios = async (body, params) => {
  const { data, inicio, fim, TempoConsulta } = body;
  const { id } = params;

  try {
    const Medico = await models.ModelRegisterMédico.findById(id);

    if (Medico) {
      const TempoConsultaNumber = parseInt(TempoConsulta);

      if (!TempoConsultaNumber || !data || !inicio || !fim) {
        throw new Error('Invalid input data');
      }

      const intervalos = eachMinuteOfInterval({
        start: parse(`${data} ${inicio}`, 'dd/MM/yyyy HH:mm', new Date()),
        end: parse(`${data} ${fim}`, 'dd/MM/yyyy HH:mm', new Date()),
      }, { step: TempoConsultaNumber });

      const intervalosFormatados = intervalos.slice(0, -1).map((horaInicio, index) => {
        const horaFim = intervalos[index + 1];
        return {
          Intervalo: `${format(horaInicio, 'HH:mm')} - ${format(horaFim, 'HH:mm')}`,
          Escolhido: 'Livre',
        };
      });

      const existingHorario = Medico.Horarios.find(horario => horario.data === data);

      if (existingHorario) {
        const existingInterval = existingHorario.IntervaloAtendimentos.find(
          intervalo => intervalo.Intervalo === intervalosFormatados[0].Intervalo
        );

        if (existingInterval) {
          throw new Error('The selected time slot is already booked');
        }

        existingHorario.IntervaloAtendimentos.push(...intervalosFormatados);
      } else {
        Medico.Horarios.push({
          data,
          inicio,
          fim,
          HorasDedicadas: differenceInMinutes(
            parse(`${data} ${fim}`, 'dd/MM/yyyy HH:mm', new Date()),
            parse(`${data} ${inicio}`, 'dd/MM/yyyy HH:mm', new Date())
          ) / TempoConsultaNumber,
          AtendimentosDia: 0,
          IntervaloAtendimentos: intervalosFormatados,
          TempoDeConsulta: TempoConsultaNumber,
        });
      }

      await Medico.save();

      return { message: 'Horario registered successfully' };
    } else {
      throw new Error('Medico not found in the database');
    }
  } catch (e) {
    console.log(e);
    throw new Error('An error occurred while registering the horario');
  }
}

// ... Rest of the functions

