'use client'
import { useState, useRef, useEffect } from 'react'
import React from 'react';
import { TextField, CircularProgress } from '@mui/material';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { config2 } from '../config.js'
import { useSpring, animated, config } from 'react-spring'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import axios from 'axios'
import { useMutation } from '@tanstack/react-query'
import secureLocalStorage from 'react-secure-storage'

export const ComponenteAudio = ({
  doenca,
  NomePaciente,
  setResumoIA,
  resumoIA,
  fraseDoença,
  CreateRequestMutation,
  HandleClickEnd,
}) => {

  const mediaRecorder = useRef(null)
  const [gravando, setGravando] = useState(false)
  const [audioRecordings, setAudioRecordings] = useState([])
  const [sucessAudio, setIsSucessAudio] = useState(false)
  const [resumo, setResumo] = useState('')
  
  const propsComponenteAudio = useSpring({
    opacity: 1,
    from: { opacity: 0 },
  })

  const propsResumoIA = useSpring({
    opacity: resumoIA ? 1 : 0,
    from: { opacity: 0 },
    config: config.default,
  });

  useEffect(() => {

  },[resumoIA, fraseDoença])

  const TranslationAudioToText = useMutation(formData => {
    return axios.post(`http://${config2.apiBaseUrl}/api/audio-to-text-translation`, formData);
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
  })

  const blobToFile = (blob, filename) => {
    const file = new File([blob], filename, { type: 'audio/mpeg' });
    return file
  };
  
  
  const IniciarGravacao = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.current = new MediaRecorder(stream);
  
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
  
    setGravando(true);
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

  const HandleNextResumoIA = () => {
    setResumoIA(true)
    secureLocalStorage.setItem('Sintoma', resumo)
  }

  return (
    <>
    {!resumoIA && (
      <animated.div style={propsComponenteAudio}>
        <div className='w-full flex justify-center items-center'>
          <TextField
            label={
              <>
                {TranslationAudioToText.isLoading ? (
                  <div className='flex justify-center items-center'>
                    {NomePaciente ? (
                      <h1>
                        {NomePaciente} Aguarde...
                        <CircularProgress color='primary' size={24} />
                      </h1>
                    ) : (
                      <h1>
                        Aguarde... <CircularProgress color='primary' size={24} />
                      </h1>
                    )}
                  </div>
                ) : TranslationAudioToText.isSuccess ? null : (
                  <p className='sm:whitespace-pre-wrap'>
                    {`Conte quais são os Sintomas que`} <br />
                    {`${doenca} estão te causando`}
                  </p>
                )}
              </>
            }
            multiline
            rows={4}
            variant='standard'
            InputProps={{
              sx: { borderBottom: '1px solid blue' },
            }}
            onChange={(e) => setResumo(e.target.value)}
            value={resumo}
            required
            className='w-10/12'
          />

          {gravando && !sucessAudio ? (
            <>
              <div className='flex gap-4'>
                <GraphicEqIcon color='primary' />
                <SendIcon
                  color='primary'
                  className='cursor-pointer'
                  onClick={PararGravacao}
                />
              </div>
            </>
          ) : !sucessAudio && (
            <KeyboardVoiceIcon
              color='primary'
              className='cursor-pointer'
              onClick={IniciarGravacao}
            />
          )}

          {sucessAudio && (
            <>
              <CheckCircleIcon color='primary' />
            </>
          )}
        </div>

        <div className='flex justify-center items-center gap-5 animate-pulse cursor-pointer mt-3' onClick={HandleNextResumoIA}>
          <h1 className='text-blue-500 font-bold'> Receber detalhes sobre o seu caso de {doenca} </h1>
          <ArrowForwardIosIcon color="primary"/>
        </div>
      </animated.div>
    )}

    {resumoIA && (
    <>
    <animated.div style={propsResumoIA}>
       <div className='border-blue-500 border-2 rounded-lg p-5'>
          {fraseDoença}
       </div>

       <div className='flex justify-center items-center mt-3'>
        <button onClick={() => HandleClickEnd()} className="w-72 h-12 rounded-full bg-red-600 text-white font-light">
        {CreateRequestMutation.isLoading ? <CircularProgress size={24}/> 
           :
         `Resolver ${doenca}`
        }
        </button> 
       </div>
   </animated.div>
    </>
   )}
  </>
  )
}
