import {
  ConvertingDate,
  ConvertingDateAndTime,
  Medicamentos, 
  Materiais,
  ConvertingIdade
} from '../utils/Functions/Converting.js'
import { differenceInDays, parse } from 'date-fns'
import { titulos } from "../utils/TitulosPlanilha.js"
import { fileURLToPath } from 'url';
import { dirname, join } from 'path'
import xlsx from 'xlsx'
import path from 'path'
import { models } from "../../MongoDB/Schemas/Schemas.js"
import mongoose from 'mongoose';
import { rmSync } from 'fs';

export const GetPlanilha = async (res) => {
  const currentFilePath = fileURLToPath(import.meta.url);
  const currentDir = dirname(currentFilePath)
  
  const filePath = join(currentDir, '..', 'ModelPlanilha', 'ModelV1.xlsx')

  res.download(filePath, 'ModeloPlanilhaInterconsulta.xlsx', (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Erro ao fazer o download do arquivo Excel');
    }
  });
}

export const getWaitList = async (res) => {

  const UltimosPacientesEspera = await models.ModelWaitList.findOne().sort({ _id: -1 })

  if(!UltimosPacientesEspera){
    return res.status(400).json({ message: 'Nao existem pacientes na lista de espera no momento!'})
  }

  return res.status(200).json({ UltimosPacientesEspera })

  
}