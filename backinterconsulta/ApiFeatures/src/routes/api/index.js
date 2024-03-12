import Login from './Login.js'
import Médico from './Medico.js'
import Paciente from './Paciente.js'
import Unidade from './Unidade.js'
import Agenda from './Agenda.js'
import Reunião from './Reunião.js'
import SafeID from './SafeID.js'

import { Router } from 'express'

const router = Router() 

router.use('/', Login)
router.use('/', Médico)
router.use('/', Paciente)
router.use('/', Unidade)
router.use('/', Agenda)
router.use('/', Reunião)
router.use('/', SafeID)


export default router