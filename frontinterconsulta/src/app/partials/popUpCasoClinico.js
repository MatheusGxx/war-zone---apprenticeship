import { forwardRef, useState, useEffect } from 'react';
import {
  Dialog,
  AppBar,
  Toolbar,
  Slide,
} from '@mui/material'
import {
  ArrowBackIcon,
  Image,
  Logo,
  ApartmentIcon,
  TodayIcon,
  WcIcon,
  CrisisAlertIcon,
  MedicalInformationIcon,
  AddAlertIcon,
  CakeIcon,
  LocalHospitalIcon,
  HealthAndSafetyIcon,
  CoPresentIcon,
  AccountBalanceIcon,
} from 'components';
import secureLocalStorage from 'react-secure-storage';
import { config } from '../config.js';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const CasosClinico = ({ onClose, CPF }) => {
  const [open, setOpen] = useState(false);
  const [patientData, setPatientData] = useState(null);
  const [medicoData, setMedicoData] = useState(null);
  const [quantidade, setQuantidade] = useState(0);

  const idLocal = secureLocalStorage.getItem('id') || '';
  const id = idLocal;

  const { data: pacienteData } = useQuery(['paciente', CPF], async () => {
    try {
      const request = await axios.post(`${config.apiBaseUrl}/api/get-historic-patient`, { CPF });
      return request.data;
    } catch (error) {
      console.error("Erro ao buscar Histórico do Paciente", error);
      throw new Error;
    }
  }, {
    onSuccess: (data) => {
      setPatientData(data.Pacientee);
      setQuantidade(data.HistoricoCasosClinicosAtualizados.length);
    }
  });

  const { data: medicoDataQuery } = useQuery(['medico', id], async () => {
    try {
      const request = await axios.post(`${config.apiBaseUrl}/api/get-data-doctor`, { id });
      return request.data;
    } catch (error) {
      console.error("Erro ao buscar a Foto do Médico", error);
      throw new Error;
    }
  });

  useEffect(() => {
    if (medicoDataQuery) {
      setMedicoData(medicoDataQuery);
    }
  }, [medicoDataQuery]);

  const handleClickOpen = () => setOpen(true);
  const handleClickClose = () => {
    setOpen(false);
    onClose();
  };

  return (
    <>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClickClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative', backgroundColor: 'white' }}>
          <Toolbar>
            <div className="flex justify-center items-center cursor-pointer" onClick={handleClickClose}>
              <ArrowBackIcon
                edge="start"
                color="primary"
                aria-label="close"
              />
              <h1 className="text-lg text-blue-600 ml-3 animate-pulse"> VOLTAR </h1>
            </div>
            <div className='flex justify-center items-center flex-grow'>
              <Image src={Logo} width={50} height={50} alt="Logo Interconsulta" className='animate-spin-slow'/>
            </div>
          </Toolbar>
        </AppBar>

        {pacienteData ? (
          <div className='p-5 bg-white'>
            <h1 className='text-center font-bold text-2xl text-blue-900 pb-10 pt-5'>Ficha do Paciente {pacienteData.nome} </h1>

            <div className='flex justify-center items-center gap-10'>
              <div className="flex flex-col gap-5">
                <div className='flex gap-2'>
                  <CakeIcon color="primary"/>
                  <h2>Idade: {pacienteData.Idade} </h2>
                </div>

                <div className="flex gap-2">
                  <WcIcon color="primary"/>
                  <h2>Sexo: {pacienteData.Genero}</h2>
                </div>
              </div>

              <div className="flex flex-col gap-5">
                <div className='flex gap-2'>
                  <AccountBalanceIcon color="primary"/>
                  <h2>Estado Civil: {pacienteData.EstadoCivil} </h2>
                </div>

                <div className='flex gap-2'>
                  <CoPresentIcon color="primary"/>
                  <h2> Profissão: {pacienteData.Profissao} </h2>
                </div>
              </div>
            </div>

          </div>
        ) : (
          <div className='flex-1 flex items-center justify-center'>
            <Image src={Logo} width={150} height={150} alt="Logo Interconsulta" className='animate-bounce'/>
          </div>
        )}

        {quantidade ? (
          <div className='pt-5 bg-white flex flex-col gap-10 items-center pb-5'>
            <h1 className='font-bold text-2xl text-blue-900 p-5 text-center sm:text-xl'> Linha da Vida: ({quantidade})</h1>
            {pacienteData && pacienteData.HistoricoCasosClinicosAtualizados.map((data, outerIndex) => (
              <div key={outerIndex} className
