import { parse } from 'date-fns';

export const getHistoricoPaciente = async (req, res) => {
  const { Paciente, ModelPacientee } = req; // destructure Paciente and ModelPacientee from req object

  if (!Paciente || !ModelPacientee) {
    return res.status(400).json({ error: 'Paciente or ModelPacientee not provided' });
  }

  const paciente = new ModelPacientee(Paciente); // create a new instance of ModelPacientee

  const updatedPaciente = await ModelPacientee.findById(paciente._id); // use the instance's id for query

  if (!updatedPaciente) {
    return res.status(404).json({ error: 'Paciente not found' });
  }

  const HistoricoCasosClinicosAtualizados = updatedPaciente.Historico.sort((a, b) => {
    const dateA = parse(a.DataInsercao, 'dd/MM/yyyy', new Date());
    const dateB = parse(b.DataInsercao, 'dd/MM/yyyy', new Date());

    return dateA - dateB;
  });

  return res.status(200).json({ HistoricoCasosClinicosAtualizados, Paciente: updatedPaciente });
};

