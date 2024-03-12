import { forwardRef, useState, useEffect } from 'react';
import {
  Dialog,
  AppBar,
  Toolbar,
  Slide,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Image from 'next/image';
import LogoIconVermelho from '../public/LogoIconVermelho.png'
import BloodtypeIcon from '@mui/icons-material/Bloodtype'
import BolsaDeSangue from '../public/BolsaDeSangue.png'
import { useRouter } from 'next/router';
import { useMutation } from '@tanstack/react-query';
import secureLocalStorage from 'react-secure-storage';
import axios from 'axios';
import { config } from '../config.js';
import { useBlood } from '../context/context';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

export const PopUpBlood = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [quantidade, setQuantidade] = useState(0);
  const [tipo, setTipo] = useState('');
  const [cidade, setCidade] = useState('');
  const [telefones, setTelefones] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [position, setPosition] = useState({
    vertical: 'top',
    horizontal: 'center'
  });
  const [notification, setNotification] = useState(false);

  const { setBlood } = useBlood();

  const { vertical: verticalPosition, horizontal: horizontalPosition } = position;

  const nameLocalPaciente = secureLocalStorage.getItem('NomePaciente');
  const NomePaciente = nameLocalPaciente || '';

  const idLocal = secureLocalStorage.getItem('id');
  const id = idLocal || '';

  const route = router.pathname;

  useEffect(() => {
    handleClickOpen();
  }, []);

  useEffect(() => {
    RequestGetBlood.mutateAsync();
  }, [route]);

  const handleClickOpen = () => setOpen(true);

  const handleClickClose = () => {
    setOpen(false);
    setBlood(false);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSnackBarOpen = () => {
    setSnackbarOpen(true);
  };

  const RequestGetBlood = useMutation(async () => {
    const response = await axios.post(`${config.apiBaseUrl}/api/get-blood/${id}`);
    const { QueryCompativeis, TipoSanguineo, Cidade } = response.data;
    setQuantidade(QueryCompativeis.length);
    setTipo(TipoSanguineo);
    setCidade(Cidade);
    const phoneNumbers = QueryCompativeis.map((data) => data.Historico[0]?.Telefone);
    setTelefones(phoneNumbers);
    return QueryCompativeis;
  }, {
    onError: (error) => {
      setSnackbarMessage(
        `Ops ${NomePaciente} Ocorreu um Erro ao Obter os Doadores Compativeis.`
      );
      handleSnackBarOpen();
    }
  });

  const RequestNotificationPaciente = useMutation(async (valueRequest) => {
    const response = await axios.post(`${config.apiBaseUrl}/api/automatic-whatsapp`, valueRequest);
    return response.data;
  });

  const RequestAutomaticNotification = async () => {
    const body = {
      route,
      IdentificadorPacientePublico: telefones,
      IdentificadorPacienteParticular: id,
    };

    try {
      await RequestNotificationPaciente.mutateAsync(body);
      setNotification(true);
    } catch (err) {
      setSnackbarMessage(
        `Ops ${NomePaciente} Ocorreu um Erro ao Notificar os Doadores.`
      );
      handleSnackBarOpen();
    }
  };

  return (
    <>
      <Dialog
        fullScreen
        open={open}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative', backgroundColor: 'white' }}>
          <Toolbar>
            <CloseIcon
              edge="start"
              color="error"
              onClick={handleClickClose}
              aria-label="close"
              className="cursor-pointer"
            />
            <div className='flex justify-center items-center flex-grow gap-3'>
              <Image src={LogoIconVermelho} width={50} height={50} alt="Logo Interconsulta" className='animate-spin-slow'/>
            </div>
          </Toolbar>
        </AppBar>

        <div className="flex justify-center items-center flex-col gap-5 mt-10 w-full">
          <h1 className='font-bold text-red-600'> {NomePaciente} foram encontrados ({quantidade}) Doadores Compativeis com {tipo} em {cidade}</h1>

          <div className="flex gap-5 w-full justify-center items-center mt-5"> 
            <button
              className={`p-2 ${RequestNotificationPaciente.isLoading ? 'bg-blue-600' : 'bg-red-600'} ${RequestNotificationPaciente.isSuccess && 'bg-green-600'} rounded-full min-w-[150px] cursor-pointer flex justify-center items-center`}
             
