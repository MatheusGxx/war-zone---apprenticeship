import { format, parse, isValid, differenceInYears, addDays, isDate, addSeconds } from 'date-fns';

type ConverterFunction = (data: Record<string, string | number>, campo: string) => string | number | undefined;

const ConvertingDate: ConverterFunction = (data, campo) => {
  const diasDesdeReferencia = data[campo];
  const dataNascimento = addDays(new Date(1899, 11, 30), diasDesdeReferencia as number);
  if (!isValid(dataNascimento)) return 'Data Inválida';
  const dataFormatada = format(dataNascimento, 'dd/MM/yyyy');
  return dataFormatada;
}

const ConvertingDateAndTime: ConverterFunction = (data, campo) => {
  const dataHoraExecel = data[campo];
  const excelDate = new Date((dataHoraExecel as number) - 25569) * 86400 * 1000;
  const correctedDate = addSeconds(excelDate, 1);
  const formattedDate = format(correctedDate, 'dd/MM/yyyy HH:mm:ss', { timeZone: 'America/Sao_Paulo' });
  return formattedDate;
}

const Medicamentos: ConverterFunction = (data, campo) =>
  data[campo] ? data[campo].split(';').map((med) => med.trim()) : [];

const Materiais: ConverterFunction = (data, campo) =>
  data[campo] ? data[campo].split(';').map((material) => material.trim()) : [];

const ConvertingIdade: ConverterFunction = (data, campo) => {
  const diasDesdeReferencia = data[campo];
  const dataNascimento = addDays(new Date(1899, 11, 30), diasDesdeReferencia as number);
  if (!isValid(dataNascimento)) return 'Idade Inválida';
  const dataFormatada = format(dataNascimento, 'dd/MM/yyyy');
  const dataNascimentoDate = parse(dataFormatada, 'dd/MM/yyyy', new Date());
  const dataAtual = new Date();
  const idade = differenceInYears(dataAtual, dataNascimentoDate);
  return idade;
}

const ConvertingIdadee: ConverterFunction = (data) => {
  const dataNascimento = parse(data, 'dd/MM/yyyy', new Date());
  if (!isDate(dataNascimento)) throw new Error('Data de nascimento inválida');
  const idade = differenceInYears(new Date(), dataNascimento);
  return idade;
}
