import { Router, Request, Response } from 'express'
import { Job, QueueEvents } from 'bullmq'
import { v4 as uuidv4 } from 'uuid'

import AutomaticWhatsapp from '../../services/AutomaticService'
import sendDocumentsPatient from '../../services/SendDocumentsService'
import SavedConsultaUnidadeSaude from '../../services/SavedConsultaUnidadeSaudeService'
import AcceptMedical from '../../services/AcceptMedicalService'
import RejectMedical from '../../services/RejectMedicalService'
import WarningDoctorNotSchedules from '../../services/WarningDoctorNotSchedulesService'
import WarningDoctorHorariosAntigos from '../../services/WarningDoctorHorariosAntigosService'

import uploadSignedDocuments from '../../utils/MulterSignDocuments'
import uploadPlanilha from '../../utils/MulterPlanilha'
import config from '../../utils/RedisConnection'
const { redisRead, redisWrite } = config

import {
  ProcessPlanilhaQueue,
  ProcessConsolidadoQueue,
  BulkMessageQueueConfirmation,
} from '../../utils/Queues'

const router = Router()

interface RequestBody {
  [key: string]: any
}

const validateRequestBody = (body: RequestBody) => {
  for (const key in body) {
    if (body[key] === undefined || body[key] === null) {
      throw new Error(`Missing required field: ${key}`)
    }
  }
}

const handleAutomaticWhatsapp = async (req: Request, res: Response) => {
  try {
    console.log(req.body)
    validateRequestBody(req.body)

    const body = {
      // ...
    }

    const response = await AutomaticWhatsapp(body, res)
    res.status(2
