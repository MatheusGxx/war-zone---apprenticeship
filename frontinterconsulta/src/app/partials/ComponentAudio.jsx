import { useState, useRef, useEffect } from 'react'
import {
  TextField,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
} from '@mui/material'
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice'
import GraphicEqIcon from '@mui/icons-material/GraphicEq'
import SendIcon from '@mui/icons-material/Send'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import axios from 'axios'
import { useMutation } from '@tanstack/react-query'
import secureLocalStorage from 'react-secure-storage'
import Image from 'next/image'

const ComponenteAudio = () => {
  const [open, setOpen] = useState(false)
  const [fraseDoenca, setFraseDoenca] = useState(null)
  const [gravando, setGravando] = useState(false)
  const [audioRecordings, setAudioRecordings] = useState([])
  const [sucessAudio, setIsSucessAudio] = useState(false)
  const [resumo, setResumo] = useState('')
  const [resumoIA, setResumoIA] = useState(false)
  const mediaRecorder = useRef(null)
  const Doenca = secureLocalStorage.getItem('Doenca')
  const NomePaciente = secureLocalStorage.getItem('NomePaciente')

  const propsComponenteAudio = useSpring({
    opacity: 1,
    from: { opacity: 0 },
  })

  const propsResumoIA = useSpring({
    opacity: resumoIA ? 1 : 0,
    from: { opacity: 0 },
    config: config.default,
  })

  useEffect(() => {
    setOpen(true)
    fetchResumoDoenca()
  }, [])

  const fetchResumoDoenca = async () => {
    try {
      const response = await axios.post(`${config2.apiBaseUrl}/api/get-doenca`, { doenca: Doenca })
      setFraseDoenca(response.data)
    } catch (error) {
      console.error('Erro na solicitação:', error)
    }
  }

  useEffect(() => {
  }, [resumoIA, fraseDoenca])

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

          <DialogContent
