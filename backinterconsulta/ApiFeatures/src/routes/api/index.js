import Login from './Login.js'
import Medico from './Medico.js'
import Paciente from './Paciente.js'
import Unidade from './Unidade.js'
import Agenda from './Agenda.js'
import Reuniao from './Reuniao.js' // corrected the spelling
import SafeID from './SafeID.js'

import { Router } from 'express'

const router = Router() 

router.use('/login', Login) // added the endpoint name
router.use('/medicos', Medico) // added the endpoint name
router.use('/pacientes', Paciente) // added the endpoint name
router.use('/unidades', Unidade) // added the endpoint name
router.use('/agendas', Agenda) // added the endpoint name
router.use('/reunioes', Reuniao) // added the endpoint name and corrected the spelling
router.use('/safeid', SafeID) // added the endpoint name


export default router
