'use client'
import { useState, useRef, useEffect } from 'react'
import React from 'react'
import { TextField, CircularProgress,  Dialog, DialogContent, DialogTitle } from '@mui/material'
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
import Logo from '../public/logo.png'
import Logo2 from '../public/Logo2.png'
import Image from 'next/image'

export const ComponenteAudio = () => {

  const mediaRecorder = useRef(null)
  const [open, setOpen] = useState(false)
  const [fraseDoença, setFraseDoença] = useState(null)
  const [gravando, setGravando] = useState(false)
  const [audioRecordings, setAudioRecordings] = useState([])
  const [sucessAudio, setIsSucessAudio] = useState(false)
  const [resumo, setResumo] = useState('')
  const [resumoIA, setResumoIA] = useState(false)
  
  const propsComponenteAudio = useSpring({
    opacity: 1,
    from: { opacity: 0 },
  })

  const propsResumoIA = useSpring({
    opacity: resumoIA ? 1 : 0,
    from: { opacity: 0 },
    config: config.default,
  })

  useEffect(()  => {
    setOpen(true)
  },[])

  const Doenca = secureLocalStorage.getItem('Doenca')
  const NomePaciente = secureLocalStorage.getItem('NomePaciente')

  const ResumoDoença = useMutation(async () => {
    try {
      const response = await axios.post(`${config2.apiBaseUrl}/api/get-doenca?doenca=${Doenca}`)
      setFraseDoença(response.data)
    } catch (error) {
      console.error('Erro na solicitação:', error)
    }
  })

  useEffect(() => {
    ResumoDoença.mutateAsync()
  },[])

  useEffect(() => {
  
  },[resumoIA,fraseDoença])


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
    mediaRecorder.current.start()
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

  const HandleClickEnd = () => {
    secureLocalStorage.removeItem('InitialContact')
    setOpen(false) 
  } 

  return (
    <>
    <Dialog 
    open={open}
    PaperProps={{
      style: {
        maxWidth: '600px', 
        width: '100%',
      
      },
    }}
    >

  <div className='flex flex-col justify-center items-center'>
        <div className='pt-6 flex justify-center items-center flex-col'>
          <Image
            src={Logo2}
            alt='Segundo Logo Interconsulta'
            width={200}
            height={100}
          />
          
          <DialogTitle>
          <h1 className='text-blue-500 text-center text-xl'> {NomePaciente} queremos te escutar! </h1>
          <h2 className='text-center text-blue-500 text-xl'> Subheadline </h2>
          </DialogTitle>
       
        </div>
  
      <DialogContent sx={{ display: 'flex', justifyContent: 'center', justifyItems: 'center'}}>

        <div className='flex justify-center items-center'>
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
                    {`${Doenca} estão te causando`}
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
          <h1 className='text-blue-500 font-bold'> Receber detalhes sobre o seu caso de {Doenca} </h1>
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
         Resolver {Doenca}
        </button> 
       </div>
   </animated.div>
    </>
   )}
        </div>
   
      </DialogContent>

      </div>

      <div className="flex justify-end p-4">
            <Image
              src={Logo}
              alt="Logo Interconsulta"
              height={40}
              width={40}
              className='animate-spin-slow'
            />
          </div>
    </Dialog>
   
  </>
  )
}
