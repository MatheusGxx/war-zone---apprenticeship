import { useState, useRef, useEffect } from 'react';
import {
  TextField,
  Checkbox,
  KeyboardVoiceIcon,
  GraphicEqIcon,
  SendIcon,
  CheckCircleIcon,
} from '@mui/material';
import { startOfDay, parse, isAfter, isSameDay } from 'date-fns';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { useSpring, animated } from 'react-spring';

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
  const mediaRecorder = useRef(null);
  const [gravando, setGravando] = useState(false);
  const [audioRecordings, setAudioRecordings] = useState([]);
  const [sucessAudio, setIsSucessAudio] = useState(false);

  const WarningDoctorHorariosAntigos = useMutation(async (valueRequest) => {
    try {
      const response = await axios.post(
        `${Api2.apiBaseUrl}/api2/warning-doctor-horarios-antigos`,
        valueRequest
      );
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching: ${error}`);
    }
  });

  useEffect(() => {
    if (horariosAntigos) {
      WarningDoctorHorariosAntigos.mutateAsync({
        NomePacienteWarningDoctorHorariosAntigos: nomePaciente,
        idMedicoWarningDoctorHorariosAntigos: idMedico,
      });
    }
  }, [horariosAntigos, nomePaciente, idMedico]);

  const TranslationAudioToText = useMutation(
    (formData) => axios.post(`${config2.apiBaseUrl}/api/audio-to-text-translation`, formData),
    {
      onSuccess: (data) => {
        if (data && data.data && data.data.success) {
          setAudioRecordings([]);
          setIsSucessAudio(true);
          setResumo(data.data.data);
        } else {
          console.error('Invalid response structure:', data);
          setIsSucessAudio(false);
        }
      },
      onError: (error) => {
        console.error('Error uploading audio:', error);
        setIsSucessAudio(false);
      },
    }
  );

  const blobToFile = (blob, filename) => {
    const file = new File([blob], filename, { type: 'audio/mpeg' });
    return file;
  };

  const IniciarGravacao = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);

      let currentChunks = [];

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

        setGravando(false);
      };

      setGravando(true);
      mediaRecorder.current.start();
    } catch (error) {
      console.error('Erro ao iniciar a gravação de áudio:', error);
    }
  };

  const PararGravacao = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
      mediaRecorder.current.stop();
    }
  };

  const props = useSpring({
    opacity: selectOneDate ? 1 : 0,
    from: { opacity: 0 },
  });

  return (
    <>
      <div className="flex flex-col gap-3">
        {Horarios && Horarios.length > 0 && visibleData && (
          <>
            <div className="flex gap-5 justify-center flex-wrap">
              <h1 className="font-bold text-blue-500 text-center text-xl">
                {doenca
                  ? `Datas Disponiveis do ${especialidade}, ${NomeMedico} para ${doenca}`
                  : `Datas Disponiveis do ${especialidade}, ${NomeMedico}`}
              </h1>
              {Horarios.map((datas, index) => (
                <div
                  key={index}
                  className="flex gap-5 justify-center items-center"
                >
                  <h1> Data: {datas.data}</h1>
                  <Checkbox
                    {...datas}
                    onChange={(e) => onChangeCheckBoxDate(e, datas._id)}
                    disabled={
                      checkboxSelecionado !== null && checkboxSelecionado !== datas._id
                    }
                  />
                </div>
              ))}

