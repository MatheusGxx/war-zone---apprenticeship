import { format, parse, isValid, differenceInYears, addDays, isDate, addSeconds } from 'date-fns'

export const ConvertingDate = (data, Campo) => {
  const diasDesdeReferencia = data[`${Campo}`];

  // Convertendo a quantidade de dias para uma data
  // Converter Data no execel = 1899/11/30 até a data forncedi os dias entre as datas é o dia que se convertido usando a funçao addDays se torna a data convertida do execel.
  const dataNascimento = addDays(new Date(1899, 11, 30), diasDesdeReferencia);

  if (!isValid(dataNascimento)) {
    return 'Data Invalida'; 
  }

  // Formatando a data para o formato desejado "DD/MM/YYYY"
  const dataFormatada = format(dataNascimento, 'dd/MM/yyyy')
  return dataFormatada
}

export const ConvertingDateAndTime = (data, Campo) => {
  const dataHoraExecel = data[Campo] 
  
// Convertendo o número de série do Excel para uma data JavaScript
const excelDate = new Date((dataHoraExecel - 25569) * 86400 * 1000);

// Adicionar 1 segundo à data para corrigir a discrepância
const correctedDate = addSeconds(excelDate, 1);

// Formatando  a data para o formato desejado
const formattedDate = format(correctedDate, 'dd/MM/yyyy HH:mm:ss', { timeZone: 'America/Sao_Paulo' });

return formattedDate
}

export const Medicamentos = (data, Campo) =>{
  const medicamentosSeparados = data[`${Campo}`] ? data[`${Campo}`].split(';').map(med => med.trim()): []

  return medicamentosSeparados

}

export const Materiais = (data, Campo) => {
  const materialSeparado = data[`${Campo}`] ? data[`${Campo}`].split(';').map((material) => material.trim()) : []

  return materialSeparado
}


export const ConvertingIdade = (data,Campo) =>{
  const diasDesdeReferencia = data[`${Campo}`];

  const dataNascimento = addDays(new Date(1899, 11, 30), diasDesdeReferencia);

  if (!isValid(dataNascimento)) {
    return 'Idade Invalida'
  }

  const DataFormatada = format(dataNascimento, 'dd/MM/yyyy');

  const dataNascimentoDate = parse(DataFormatada, 'dd/MM/yyyy', new Date());

  const dataAtual = new Date();

  const idade = differenceInYears(dataAtual, dataNascimentoDate)

  return idade

}


export const ConvertingIdadee = (data) => {
  const dataNascimento = parse(data, 'dd/MM/yyyy', new Date());

  // Verifica se a data de nascimento é válida
  if (!isDate(dataNascimento)) {
    throw new Error('Data de nascimento inválida');
  }

  // Calcula a diferença em anos entre a data de nascimento e a data atual
  const idade = differenceInYears(new Date(), dataNascimento);

  return idade;
}
