'use client'
import { useState, useRef, useEffect } from 'react'
import { TextField, Checkbox } from '@mui/material'
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice'
import GraphicEqIcon from '@mui/icons-material/GraphicEq'
import SendIcon from '@mui/icons-material/Send'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { config2, Api2 } from '../config.js'
import { startOfDay, parse, isAfter, isSameDay } from 'date-fns';

import axios from 'axios'
import { useMutation } from '@tanstack/react-query'
import Avatar from '@mui/material/Avatar'
import { CircularProgress } from '@mui/material'
import { useSpring, animated, config } from 'react-spring'

export const AgendamentoComponente = ({
    setDoenca,
    doenca,
    Horarios,
    visibleData,
    NomeMedico,
    onChangeCheckBoxDate,
    selectedDate,
    visibleHorarios,
    NamePaciente,
    selectedIntervals,
    HandleSelectHorario,
    setSelectedDate,
    horarioSelecionado,
    setHorarioSelecionado,
    especialidade,
    setResumo,
    resumo,
    FotoPaciente,
    checkboxSelecionado,
    Sintoma,
    selectOneDate,
    notIntervals,
    nomePaciente,
    setHorariosAntigos,
    horariosAntigos,
    idMedico,
}) => {


  const mediaRecorder = useRef(null)
  const [gravando, setGravando] = useState(false)
  const [audioRecordings, setAudioRecordings] = useState([])
  const [sucessAudio, setIsSucessAudio] = useState(false)

  
  const WarningDoctorHorariosAntigos = useMutation(async (valueRequest) => {
    try {
      const response = await axios.post(`${Api2.apiBaseUrl}/api2/warning-doctor-horarios-antigos`, valueRequest)
      return response.data
    } catch (error) {
      throw new Error(`Error fetching: ${error}`);
    }
  })

  useEffect(() => {
    const WarningDoctorHorariosAntigosFunctionAsync = async () => { 
      await WarningDoctorHorariosAntigos.mutateAsync({
        NomePacienteWarningDoctorHorariosAntigos: nomePaciente,
        idMedicoWarningDoctorHorariosAntigos: idMedico
      })
    }

    if(horariosAntigos){
       WarningDoctorHorariosAntigosFunctionAsync()
    }
  
  },[horariosAntigos, nomePaciente, idMedico])

  const props = useSpring({
    opacity: selectOneDate ? 2 : 0,
    from: { opacity: 0 },
  })


  const TranslationAudioToText = useMutation(formData => {
    return axios.post(`${config2.apiBaseUrl}/api/audio-to-text-translation`, formData);
  }, {
    onSuccess: (data) => {
      if (data && data.data && data.data.success) {
        setAudioRecordings([])
        setIsSucessAudio(true)
        setResumo(data.data.data)
      } else {
        console.error('Invalid response structure:', data);
        setIsSucessAudio(false)
      }
    },
    onError: (error) => {
      console.error('Error uploading audio:', error)
      setIsSucessAudio(false)
    }
  });

 const blobToFile = (blob, filename) => {
    const file = new File([blob], filename, { type: 'audio/mpeg' });
    return file
  }
  

  
const IniciarGravacao = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.current = new MediaRecorder(stream)

    let currentChunks = []

    mediaRecorder.current.ondataavailable = (e) => {
      if (e.data.size > 0) {
        currentChunks.push(e.data);
      }
    };

    mediaRecorder.current.onstop = async () => {
      const audioBlob = new Blob(currentChunks, { type: 'audio/mpeg' });
      const audioFile = blobToFile(audioBlob, 'audio.mp3');

      const formData = new FormData();
      formData.append('audio', audioFile);

      TranslationAudioToText.mutate(formData);
      
      setGravando(false)
    };

    setGravando(true)
    mediaRecorder.current.start();
  } catch (error) {
    console.error('Erro ao iniciar a gravação de áudio:', error);
  }
 }
   
  const PararGravacao = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
       mediaRecorder.current.stop()
    }
  }
   

    return (
      <>
        <div className="flex flex-col gap-3">
         
          {Horarios && Horarios.length > 0 && visibleData && (
            <>
              <div className="flex gap-5 justify-center flex-wrap">
                <h1 className="font-bold text-blue-500 text-center text-xl">
                  {doenca ?  
                    `Datas Disponiveis do ${especialidade}, ${NomeMedico} para ${doenca}`: 
                    `Datas Disponiveis do ${especialidade}, ${NomeMedico}`
                  }
                </h1>
                <>
                  {Horarios.filter(horario => {
                    const dataHorario = parse(horario.data, 'dd/MM/yyyy', new Date());
                    const hoje = startOfDay(new Date())
                    return isAfter(dataHorario, hoje) || isSameDay(dataHorario, hoje)
                  }).map((datas, index) => {
                    return (
                      <div
                        key={index}
                        className="flex gap-5 justify-center items-center"
                      >
                        <h1> Data: {datas.data}</h1>
                        <Checkbox
                          {...datas}
                          onChange={(e) => onChangeCheckBoxDate(e,datas._id)}
                          disabled={checkboxSelecionado !== null && checkboxSelecionado !== datas._id}
                        />
                      </div>
                    )
                  })}
                   {Horarios.filter(horario => {
                            const dataHorario = parse(horario.data, 'dd/MM/yyyy', new Date());
                            const hoje = startOfDay(new Date());
                            return isAfter(dataHorario, hoje) || isSameDay(dataHorario, hoje)
                    }).length === 0 && (
                         <>
                          <p className="text-center text-red-500 mt-4 font-bold text-xl">Infelizmente o {NomeMedico}, Nao tem datas Disponiveis Atualmente.</p>
                           {setHorariosAntigos(true)}
                           
                         </>
                  )}
                </>
              </div>
            </>
          )}

          {selectedDate && visibleHorarios && notIntervals !== false ? (
            <div>
              <div className="flex gap-5 flex-wrap mt-5 border-blue-500 border-4 rounded-lg  justify-center items-center">
                {selectedIntervals.map((interval, index) => (
                  <div key={index} className="flex justify-center items-center">
                    <div>
                      <Checkbox
                        onClick={() => HandleSelectHorario(interval)}
                      />
                      <span> {interval}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : notIntervals === false ?
          <>
          <h1 className="font-bold text-blue-500 text-center text-lg">
            {nomePaciente} Infelizmente o(a) {NomeMedico} nao tem agenda disponivel para essa data =/
         </h1>
          </> 
          : null
          } 
  
          <div className="flex gap-5 w-full">
           
            {horarioSelecionado && (
              <>
                <TextField
                  variant="standard"
                  label="Horario Seleionado para a consulta"
                  InputProps={{
                    sx: { borderBottom: "1px solid blue" },
                    readOnly: true
                  }}
                  type="text"
                  required
                  onChange={(e) => setHorarioSelecionado(e.target.value)}
                  value={horarioSelecionado}
                  className="w-full"
                />
              </>
            )}
          </div>
      

      {selectOneDate ?  
        <>
        <animated.div style={props}>
          {Sintoma ? 
             <h1 className='font-bold text-blue-500 text-center text-xl'> Confirme os seus sintomas {doenca ? `sobre ${doenca}` : `para o ${NomeMedico}`} </h1>
          : 
          <h1 className='font-bold text-blue-500 text-center text-xl'> Descreva o seu Sintoma  {doenca ? `sobre ${doenca}` : `para o ${NomeMedico}`} </h1>
          }

        <div className='w-full flex justify-center items-center'>
         <TextField
           label={
             <>
             {Sintoma ?
              null 
             :
             TranslationAudioToText.isLoading ? 
               <div className='flex justify-center items-center'>
                  <h1> {NamePaciente} Aguarde... <CircularProgress color='primary' size={24}/>
                  </h1> 
               </div>
              
             :
             <div className='flex gap-10'>
             <Avatar alt="Foto Médico" src={`${config2.apiBaseUrl}/${FotoPaciente}`} />
             <div className='flex justify-center items-center'>
               <p className='sm:whitespace-pre-wrap'>
                {doenca ? `Conte quais são os Sintomas que ${doenca} esta te causando` : `Conte o que voce esta sentido`} <br/>
               </p>
             </div>
           </div>
              }
             </>
           }
           multiline
           rows={4}
           variant="standard"
           InputProps={{
             sx: { borderBottom: "1px solid blue" },
           }}
           onChange={(e) => setResumo(e.target.value)}
           value={resumo}
           required
           className='w-10/12'
         />
 
           {gravando && !sucessAudio ? 
           <>
           <div className='flex gap-4'>
           <GraphicEqIcon
           color="primary"
           /> 
           <SendIcon
           color="primary"
           className="cursor-pointer"
           onClick={PararGravacao}
           />
           </div>
           </>
           :
           !sucessAudio &&
           <KeyboardVoiceIcon
           color="primary"
           className="cursor-pointer"
           onClick={IniciarGravacao}
         />
        }
 
        {sucessAudio &&
         <>
         <CheckCircleIcon color='primary'/>
         </>
        }
         </div>
       </animated.div>
        
        </>
       : null
      }
        </div>
      </>
    );
  };
  