'use client'
import React, { useState, useEffect } from 'react'
import { Dialog, DialogTitle, DialogContent, TextField, Autocomplete, Snackbar, Alert} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import Image from 'next/image'
import Logo from '../public/logo.png' 
import Logo2 from '../public/Logo2.png'
import { Horarios } from './HorariosDisponiveis'
import { useMutation } from '@tanstack/react-query'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useHistorico } from '../context/context';
import axios from 'axios'
import secureLocalStorage from 'react-secure-storage'
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material"
import { parse } from 'date-fns'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { TempoConsulta } from './TempoConsulta'
import { config } from '../config.js'

function HorariosMedicos({ onClose }) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState('');
  const [inicio, setInicio] = useState('');
  const [fim, setFim] = useState('');
  const [historicoo, setHistoricoo] = useState('')
  const [idHorario, setidHorario] = useState('')
  const { historico, setHistorico } = useHistorico()
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [interval, setIntervaal] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [tempoConsulta, setTempoConsulta] = useState('')

  const HoraInicio =  parse(`${data} ${inicio}`,  'dd/MM/yyyy HH:mm', new Date())
  const HoraFim = parse(`${data} ${fim}`,  'dd/MM/yyyy HH:mm', new Date())

  const regex = /^(\d{0,2})\/?(\d{0,2})\/?(\d{0,4})$/;

  const idLocal = typeof window !== 'undefined' ? secureLocalStorage.getItem('id') : false
  const VerifyID = idLocal || ''

  const queryClient = useQueryClient()

  const getInfoMedico = useMutation(
    async (valueRequest) => {
      const request = await axios.post(`${config.apiBaseUrl}/api/info-medico/${VerifyID}`, valueRequest)
      return request.data.InformacoesMedico
    },
    {
      onSettled: () => {
        queryClient.invalidateQueries('Historico');
      },
    }
  );

  const CreateMutationRequest = useMutation(
    async (valueRequest) => {
      const request = await axios.post(`${config.apiBaseUrl}/api/register-horarios/${VerifyID}`, valueRequest)
      setMensagem(request.data.message)
      return request.data.message
    },
    {
      onSettled: () => {
        queryClient.invalidateQueries('Historico');
      },
    }
  )

  const DeleteMutationRequest = useMutation(
    async () => {
      const request = await axios.delete(`${config.apiBaseUrl}/api/delete-horarios/${VerifyID}/${idHorario}`)
      setMensagem(request.data.mensagem)
      return request.data.mensagem
    },
    {
      onSettled: () => {
        queryClient.invalidateQueries('Historico');
      },
    }
  )

  const DeleteIntervalRequest = useMutation(
    async ({ id, idHorarioo }) => {
      const request = await axios.delete(`${config.apiBaseUrl}/api/delete-intervalo/${id}/${idHorarioo}`);
      return request.data
    },
    {
      onSettled: () => {
        queryClient.invalidateQueries('Historico');
      },
    }
  )

  const RequestGetHistorico = async () => {
    const response = await axios.get(`${config.apiBaseUrl}/api/get-horarios/${VerifyID}`);
    setHistorico(response.data.QueryHistorico)
    return response.data.QueryHistorico
  };

  const queryKey = ['Historico', historicoo];
  const { data: QueryHistorico, isFetching, isError, isSuccess } = useQuery(
    queryKey,
    () => RequestGetHistorico(historicoo),
    {
      onSettled: (data) => {
        // Handle data or errors here if needed.
      },
    }
  )

  useEffect(() => {
    setOpen(true)
  }, [])

  useEffect(() =>{
    getInfoMedico.mutateAsync()
  },[])

  const handleDataChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    const formattedValue = value.replace(regex, '$1/$2/$3');
    setData(formattedValue);
  };

  
  const CleanHorarios = () => {
    setData('');
    setInicio('');
    setFim('')
    setTempoConsulta('')
  }

  const HandleSave = async () =>{
    const body = {
      data: data,
      inicio: inicio,
      fim: fim,
      Escolhido: 'Livre',
      TempoConsulta: tempoConsulta
    };

    try {
      await CreateMutationRequest.mutateAsync(body)
      CleanHorarios();
    } catch (error) {

    }
  }
  
  const HandleVerification = () =>{
    if(data === ''|| tempoConsulta === '' || inicio === '' || fim === ''){
      setSnackbarMessage('Preencha todos os Campos para poder agendar um Horario')
      handleSnackBarOpen()
    }else if(HoraInicio >= HoraFim){
          setSnackbarMessage('Ops Doutor o Horario de Inicio sempre tem que ser menor que o de fim :D, refaça o Horario por favor.')
          handleSnackBarOpen()
    }else{
       HandleSave()
    }
  }

  const handleCloseButton = async () => {
    if (onClose) {
      onClose()
    }
    setOpen(false)
  }

  const handleDeleteHorario = async (idH) => {
    try {
      setidHorario(idH)
      await DeleteMutationRequest.mutateAsync();
    } catch (error) {
    
    }
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false); 
  };

  const handleSnackBarOpen = () => {
    setSnackbarOpen(true)
  }
  
  const handleDeleteInterval = async (id, idHorarioo) => {
    try {
      await DeleteIntervalRequest.mutateAsync({ id, idHorarioo });
    } catch (e) {
      throw new Error('Erro ao Excluir Intervalo Médico', e);
    }
  }

  return (
    <>
      <Dialog open={open} onClose={onClose} 
        PaperProps={{
          style: {
            maxWidth: '100%', 
            width: '100%',
          },
        }}>
        <div className="flex flex-col justify-center items-center">
          <div className="pt-6">
            <Image src={Logo2} alt="Segundo Logo Interconsulta" width={200} height={100} />
          </div>

           <DialogTitle className="text-center text-indigo-950 font-bold"> 
           {getInfoMedico.isSuccess ? (
            <>
              <h1> Olá {getInfoMedico.data.NomeEspecialista} segue abaixo os seus Horários: </h1>
            </>

          ) : (
            <h1>Seus Horários</h1>
          )}
            </DialogTitle>

          <DialogContent>

          {isSuccess && QueryHistorico && (
  <>
    {QueryHistorico
      .map((horario, index) => (
        <div key={index} className='flex gap-5 mt-5 w-full'>
          <TextField
            variant="standard"
            label="Data"
            InputProps={{
              sx: { borderBottom: "1px solid blue" },
              readOnly: true,
            }}
            type="text"
            required
            className="w-full sm:w-full"
            value={horario.data}
          />
          
          <TextField
            variant="standard"
            label="Inicio"
            InputProps={{
              sx: { borderBottom: "1px solid blue" },
              readOnly: true,
            }}
            type="text"
            required
            className="w-full sm:w-full"
            value={horario.inicio}
          />
          <TextField
            variant="standard"
            label="Fim"
            InputProps={{
              sx: { borderBottom: "1px solid blue" },
              readOnly: true,
            }}
            type="text"
            required
            className="w-full sm:w-full"
            value={horario.fim}
          />

          <FormControl className="w-full sm:w-44 border-b border-blue-600" style={{ borderBottom: '1px solid blue' }}>
            <InputLabel>Intervalos</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={interval}
              label="Intervalos"
              onChange={(e) => setIntervaal(e.target.value)}
              variant="standard"
            >
              {horario.IntervaloAtendimentos.map((intervalos, key) => (
                <MenuItem key={key} value={intervalos._id}>
                  <div className="flex justify-center items-center gap-10 w-full">
                    {intervalos.FotoPaciente ?
                      <Image src={`${config.apiBaseUrl}/${intervalos.FotoPaciente}`} alt="Foto do Paciente" width={50} height={50} className="rounded-full" /> :
                      <AccountCircleIcon color="primary" fontSize='large'/>
                    }
                    <p>{intervalos.Intervalo}</p>
                    <p>{intervalos.Escolhido}</p>
                    <DeleteIcon color="primary" onClick={() => handleDeleteInterval(intervalos._id, horario._id)}/>
                  </div>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <div className="flex justify-center items-center pt-5">
            <DeleteIcon
              color={horario.IntervaloAtendimentos.some(intervalo => intervalo.Escolhido.startsWith('Escolhido')) ? 'disabled' : 'primary'}
              className={`cursor-pointer`}
              onClick={() => {
                if (!horario.IntervaloAtendimentos.some(intervalo => intervalo.Escolhido.startsWith('Escolhido'))) {
                  handleDeleteHorario(horario._id)  
                }
              }}
            />
           </div>
          </div>
        ))}
      </>
     )}
            <div className="flex gap-5 mt-5">
              <TextField
                variant="standard"
                label="Data"
                InputProps={{
                  sx: { borderBottom: "1px solid blue" },
                }}
                type="text"
                required
                className="w-full sm:w-full"
                onChange={handleDataChange}
                value={data}
              />

           <FormControl 
             className="w-full sm:w-44 border-b border-blue-600" 
             style={{ borderBottom: '1px solid blue' }}>
            <InputLabel>Tempo da Consulta</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={tempoConsulta}
              label="Intervalos"
              onChange={(e) => setTempoConsulta(e.target.value)}
              variant="standard"
            >
              {TempoConsulta.map((data, key) => (
                <MenuItem key={key} value={data}>
                  {data}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
              <Autocomplete
                value={inicio === '' ? null : inicio}
                onChange={(event, newValue) => {
                  if (newValue !== null) {
                    setInicio(newValue);
                  }
                }}
                options={Horarios}
                noOptionsText="Sem Horários Disponíveis"
                renderInput={(params) => <TextField {...params} label="Início" variant="standard" />}
                className="w-full border-b border-blue-500 sm:w-full"
              />
              <Autocomplete
                value={fim === '' ? null : fim}
                onChange={(event, newValue) => {
                  if (newValue !== null) {
                    setFim(newValue);
                  }
                }}
                options={Horarios}
                noOptionsText="Sem Horários Disponíveis"
                renderInput={(params) => <TextField {...params} label="Fim" variant="standard" />}
                className="w-full border-b border-blue-500 sm:w-full"
              />
             <div className="flex justify-center items-center pt-5">
               <button className='bg-green-300 rounded-full h-7 w-16' onClick={HandleVerification}> Salvar </button>
              </div>
            </div>

            {isFetching && 
              <div className='flex justify-center items-center mt-5'>
                <Image src={Logo} alt="Logo Interconsulta" height={50} width={50} className='animate-pulse'/>
              </div>
            }
            {isError && <h1 className='font-bold text-xl text-red text-center mt-5'> Erro ao Pegar horarios cadastrados =/ </h1>}

          <div className="flex justify-center items-center mt-5">
            <button className="w-72 h-12 rounded-full bg-indigo-950 text-white mt-3" onClick={handleCloseButton}>
                Fechar
            </button>
          </div>

          </DialogContent>  
        </div>
        <div className="flex justify-end p-4">
          <Image src={Logo} alt="Logo Interconsulta" height={40} width={40} className="animate-spin-slow" />
        </div>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000} // Tempo em milissegundos que o Snackbar será exibido
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="error">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default HorariosMedicos
