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
import { usePathname } from 'next/navigation';

import { useMutation } from '@tanstack/react-query'
import secureLocalStorage from 'react-secure-storage'
import axios from 'axios'
import { config } from '../config.js'

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

export const PopUpBlood = ({
  onClose
}) => {

  const[open, setOpen] = useState(false)
  const[quantidade, setQuantidade] = useState('')
  const[tipo, setTipo] = useState('')
  const[telefones, setTelefones] = useState('')
  const[cidade, setCidade] = useState('')
  const[snackbarOpen, setSnackbarOpen] = useState(false)
  const[snackbarMessage, setSnackbarMessage] = useState("")
  const[position, setPosition] = useState({
    vertical: 'top',
    horizontal: 'center'
  })
  const[notification, setNotification] = useState(false)

  const { vertical, horizontal } = position


  const NameLocalPaciente = typeof window !== 'undefined' ? secureLocalStorage.getItem('NomePaciente') : false

  const NomePaciente = NameLocalPaciente || ''

  const idLocal = typeof window !== 'undefined' ? secureLocalStorage.getItem('id') : false
  const id = idLocal || ''

  const Route = usePathname()

  useEffect(() => {
    handleClickOpen();
  }, [])
  
  useEffect(() => {
   RequestGetBlood.mutateAsync()
  }, [Route])

  const handleClickOpen = () => setOpen(true);

  const handleClickClose = () => {
    setOpen(false)
    onClose()
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSnackBarOpen = () => {
    setSnackbarOpen(true);
  };

  const RequestGetBlood = useMutation(async () => {
    const response = await axios.post(`${config.apiBaseUrl}/api/get-blood/${id}`);
    setQuantidade(response.data.QueryCompativeis.length)
    setTipo(response.data.TipoSanguineo)
    setCidade(response.data.Cidade)
    const telefones = response.data.QueryCompativeis.map((data) => data.Historico[0]?.Telefone);
    setTelefones(telefones)  
    return response.data.QueryCompativeis
  })

  const RequestNotificationPaciente = useMutation(async (valueRequest) => {
    const response = await axios.post(`${config.apiBaseUrl}/api/automatic-whatsapp`, valueRequest)
    return response.data
  })

  const RequestAutomaticNotification = async () => {
    const body = {
      route: Route,
      IdentificadorPacientePublico: telefones,
      IdentificadorPacienteParticular: id,
    };
    try { 
      await RequestNotificationPaciente.mutateAsync(body)
      setNotification(true)
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
        onClose={handleClickClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }} className="bg-white">
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
            onClick={RequestAutomaticNotification}
            disabled={notification || RequestNotificationPaciente.isLoading}
          >
            {RequestNotificationPaciente.isLoading ? (
              <>
                <CircularProgress size={24} />
                <h1 className="whitespace-nowrap font-bold text-white">
                  Notificando Doadores em {cidade}...
                </h1>
              </>
            ) : (
              <p className='text-white font-bold whitespace-nowrap'>
                {RequestNotificationPaciente.isSuccess && notification
                  ? `Parabens ${NomePaciente} Todos os Doadores compativeis com voce em ${cidade} foram Notificados`
                  : `Notificar Doadores em ${cidade}`
                }
              </p>
            )}
          </button>
           </div>

    
           <div className="flex gap-7 flex-wrap mb-7 justify-center items-center sm:gap-10">
           {RequestGetBlood.data && RequestGetBlood.data.map((paciente, index) => (
            <div key={index} className="cursor-pointer flex flex-col gap-5 border-4 rounded-lg p-5 w-1/3 sm:w-10/12">

              <div className='flex justify-center items-center'>
                <Image src={BolsaDeSangue} width={100} height={100} alt="Bolsa de Sangue"/>
              </div>
              <div className="flex gap-3 justify-center items-center">
                <p className="sm:text-center text-center text-blue-500 font-bold">{paciente.NomePaciente}</p>
              </div>
              <div className="flex justify-center items-center gap-5">
              <BloodtypeIcon color="error"/>
                <p className="sm:text-center text-blue-900"> Tipo Sanguineo: {paciente.TipoSanguineo}</p>
              </div>

            </div>
          ))}
          </div>
        </div>

        <Snackbar
        open={snackbarOpen}
        autoHideDuration={20000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical, horizontal }}
      >
        <Alert onClose={handleSnackbarClose} severity="error">
            {snackbarMessage}
        </Alert>
      </Snackbar>
      
      </Dialog>
    </>
  );
};
