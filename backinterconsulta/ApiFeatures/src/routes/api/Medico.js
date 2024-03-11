import { Router } from 'express';
const router = Router();

import {
  getInfosMedico,
  GetSlug,
  RegisterHorarios,
  getHorarios,
  deleteHorarios,
  VerifyMedico,
  getCasosClinicos,
  DeleteIntervalo
}  from '../../services/MedicoSerivce.js';
import uploadIcons from '../../utils/multerIcons.js';

router.post('/info-medico/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const params = { id };

    const response = res;

    await getInfosMedico(params, response);
  } catch (error) {
    next(error);
  }
});

router.post('/get-slug/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const params = { id };

    const response = res;

    await GetSlug(params, response);
  } catch (error) {
    next(error);
  }
});

router.post('/register-horarios/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { data, inicio, fim, Escolhido, TempoConsulta } = req.body;
    const body = { data, inicio, fim, Escolhido, TempoConsulta };
    const params = { id };

    const response = res;

    await RegisterHorarios(body, response, params);
  } catch (error) {
    next(error);
  }
});

router.get('/get-horarios/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const params = { id };

    const response = res;

    await getHorarios(params, response);
  } catch (error) {
    next(error);
  }
});

router.delete('/delete-horarios/:id/:idH', async (req, res, next) => {
  try {
    const { id, idH } = req.params;
    const params = { id, idH };

    const response = res;

    await deleteHorarios(params, response);
  } catch (error) {
    next(error);
  }
});

router.post('/verify-medico/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const params = { id };

    const response = res;

    await VerifyMedico(params, response);
  } catch (error) {
    next(error);
  }
});

router.post('/get-casos-clinicos/:id', uploadIcons.single('file'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const params = { id };

    const response = res;

    await getCasosClinicos(params, response);
  } catch (error) {
    next(error);
  }
});

router.delete('/delete-intervalo/:id/:idHorarioo', async (req, res, next) => {
  try {
    const { id, idHorarioo } = req.params;
    const params = { id, idHorarioo };

    await DeleteIntervalo(params, res);
  } catch (error) {
    next(error);
  }
});

export default router;
