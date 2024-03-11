import { ModelRegisterMédico, ModelRegisterPaciente } from "../../MongoDB/Schemas/Schemas.js";
import { GPT } from "../utils/Functions/IA.js";
import { EspecialidadesAtendidas } from '../utils/EspecialidadesAtendidas.js'

// Function to get disease information
export const getDiseaseInfo = async (disease, res) => {
  if (!disease) {
    return res.status(400).json({ message: 'Disease name is required' });
  }

  try {
    const prompt = `Chatgpt me fale como evitar ter ${disease} e tambem diga o que acontece se nao procurar um médico para tratar e no final fale que no Interconsulta nós temos os melhores médicos para tratar essa doença deixando claro o nome da doença, para ele finalizar o cadastro, gere um  texto curto de no maximo 8 linhas`;

    const responseIA = await GPT(prompt, 250, 0.2);

    return res.status(200).json(responseIA.content);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error while fetching disease info' });
  }
}

// Function to get available specialties
export const getAvailableSpecialties = async (body, res) => {
  const { disease, patientId } = body;

  if (!disease && !patientId) {
    return res.status(400).json({ message: 'Disease and patientId are required' });
  }

  try {
    const doctorModel = ModelRegisterMédico;
    const patientModel = ModelRegisterPaciente;

    let doctors = [];

    if (patientId) {
      const patient = await patientModel.findById(patientId);
      if (patient) {
        patient.Doenca = disease;
        patient.GifDoenca = `icons-doencas/${disease}.gif`;
        await patient.save();
      }

      doctors = await doctorModel.find({
        $or: [
          { 'DoencasAndSintomas.Doenca': { $in: disease } },
          { 'DoencasAndSintomas.Sintomas': { $in: disease } },
        ],
      });
    } else {
      doctors = await doctorModel.find({
        $or: [
          { 'DoencasAndSintomas.Doenca': { $in: disease } },
          { 'DoencasAndSintomas.Sintomas': { $in: disease } },
        ],
      });
    }

    if (doctors.length > 0) {
      return res.status(200).json({ doctors });
    } else {
      return res.status(404).json({ message: 'We do not treat this disease yet' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error while fetching available specialties' });
  }
}

// Function to get a specialist
export const getSpecialist = async (body, res) => {
  const { specialistSlug } = body;

  if (!specialistSlug) {
    return res.status(400).json({ message: 'Specialist slug is required' });
  }

  try {
    const specialist = await ModelRegisterMédico.findOne({ Slug: specialistSlug });

    if (specialist) {
      return res.status(200).json({ specialist });
    } else {
      return res.status(404).json({ message: 'Specialist not found' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error while fetching specialist' });
  }
}

// Function to get recommended specialists
export const getRecommendedSpecialists = async (body, res) => {
  const { specialistSlug } = body;

  if (!specialistSlug) {
    return res.status(400).json({ message: 'Specialist slug is required' });
  }

  try {
    const specialist = await ModelRegisterMédico.findOne({ Slug: specialistSlug });

    if (specialist) {
      const relatedSpecialties = specialist.AreadeAtuacao;

      const recommendedSpecialists = await ModelRegisterMédico.find({
        AreadeAtuacao: { $in: relatedSpecialties },
        Slug: { $ne: specialistSlug },
      });

      return res.status(200).json(recommendedSpecialists);
    } else {
      return res.status(404).json({ message: 'Specialist not found' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error while fetching recommended specialists' });
  }
}

// Function to get patient
export const getPatient = async (body, res) => {
  const { patientId } = body;

  if (!patientId) {
    return res.status(400).json({ message: 'Patient id is required' });
  }

  try {
    const patient = await ModelRegisterPaciente.findById(patientId);

    if (patient) {
      return res.status(200).json({ patient });
    } else {
      return res.status(404).json({ message: 'Patient not found' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error while fetching patient' });
  }
}

// Function to get compatible blood don
