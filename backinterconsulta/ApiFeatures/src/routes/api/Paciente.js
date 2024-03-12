import { Router } from 'express';
const router = Router();

import {
  GetDoença,
  EspecialidadesDisponiveis,
  getEspecialista,
  GetRecomendacoesEspecialistas,
  GetPaciente,
  getBlood,
  getMedicoStatus,
  UpdateOnlineDoctor,
  GetDataSintomasAndDoenca,
  VerifyDataPatient,
  ValidatorPatientConsulta,
} from '../../services/PacienteService.js';

router.post('/get-doenca', async (req, res) => {
  try {
    const { doenca } = req.query;
    await GetDoença(doenca, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/especialidades', async (req, res) => {
  try {
    const { doenca, id } = req.body;
    const body = { doenca, id };
    await EspecialidadesDisponiveis(body, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/get-especialista/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const body = { slugIdentificador: slug };
    getEspecialista(body, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/get-recomendacoes/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const body = { slugIdentificador: slug };
    GetRecomendacoesEspecialistas(body, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/get-paciente/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const body = { id };
    GetPaciente(body, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/get-blood/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const body = { id };
    console.log(`ID do Paciente para pegar o Tipo Sanguineo que combina com ele ${id}`);
    getBlood(body, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/verify-status', async (req, res) => {
  try {
    const { id } = req.query;
    getMedicoStatus(id, res);
    console.log(req.query);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/atualized-status', async (req, res) => {
  try {
    const { id, status } = req.body;
    const body = { id, status };
    UpdateOnlineDoctor(body, res);
    console.log(req.body);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/get-sintomas-doencas', async (req, res) => {

