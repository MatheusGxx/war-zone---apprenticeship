import { nanoid } from 'nanoid';
import { ModelRegisterPaciente } from '../../../MongoDB/Schemas/Schemas.js';

// Generate a random 4-digit number
const generateFourDigitNumber = () => nanoid(4).split('').join('');

export const getSavedPaciente = async (CPF) => {
  try {
    const getPaciente = await ModelRegisterPaciente.findOne({ CPF });
    console.log(getPaciente);
    return getPaciente;
  } catch (error) {
    throw new Error('Error fetching saved paciente');
  }
};

export const createAccountedPaciente = async (CPF, telefone, nome) => {
  const newPasswordPaciente = generateFourDigitNumber();

  const newPaciente = new ModelRegisterPaciente({
    nome,
    CPF,
    senha: newPasswordPaciente,
    telefone,
  });

  try {
    await newPaciente.save();
    return newPaciente;
  } catch (error) {
    throw new Error('Error creating new paciente');
  }
};
