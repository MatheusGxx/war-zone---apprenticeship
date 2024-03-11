'use client'
import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent } from '@mui/material'
import Image from 'next/image'
import Logo from '../public/logo.png'
import Logo2 from '../public/Logo2.png'
import axios from 'axios'
import { useMutation, useQueryClient} from '@tanstack/react-query'
import { config } from '../config'
import { parse, isPast } from 'date-fns'
import secureLocalStorage from 'react-secure-storage'

export const PopupCancelPaciente = ({ nomePaciente, nomeMédico, data, inicio, fim, idConsulta, idHorario, HorarioSelecionado, onClose }) => {

  const [open, setOpen] = useState(false)
  const [passouTempoConsulta, setPassouTempo] = useState(false)

  const idLocal = secureLocalStorage.getItem('id')
  const id = idLocal || ''

  useEffect(() => {
    setOpen(true)
  }, [])

  const queryClient = useQueryClient()
   
  const DeleteCasoClinicoPacienteParticular = useMutation(
    async (body) => {
      try {
        const response = await axios.delete(`${config.apiBaseUrl}/api/delete-caso-clinico-paciente-particular`,{ data: body })
        console.log(response.data)
        return response.data; 
      } catch (error) {
        console.error('Error during delete mutation Paciente Particular:', error);
        throw error
      }
    },
    {
      onSettled: () => {
        queryClient.invalidateQueries('Consultas')
      },
    }
  )

  const handleClose = () => {
    onClose()
    setOpen(false)
  }

  const HandleRequest = async () => {
    try{

        const [dia, mes, ano] = data.split('/').map(Number);
        const [hora, minutos] = inicio.split(':').map(Number);
        const dataHora = new Date(ano, mes - 1, dia, hora, minutos);
    
        const passouTempo = isPast(dataHora)
    
        if(passouTempo){
           setPassouTempo(true)
        }else{
          const body = {
            id: idConsulta,
            Solicitante: nomePaciente,
            idPaciente: id,
            Data: data,
            Inicio: inicio,
            Fim: fim,
            idHorario: idHorario,
            HorarioSelecionado: HorarioSelecionado,
         }
            await DeleteCasoClinicoPacienteParticular.mutateAsync(body)
            onClose()
            setOpen(false)
        }
    }catch(err){
      console.log(err)
    }
  }

  return (
    <>
    <Dialog open={open} onClose={handleClose}>
      <div className='flex flex-col justify-center items-center'>
        <div className='pt-6'>
          <Image
            src={Logo2}
            alt='Segundo Logo Interconsulta'
            width={200}
            height={100}
          />
        </div>
          <DialogTitle className='text-red-600 font-bold'>{nomePaciente}</DialogTitle>
          <DialogContent>
             <p className='font-bold'> Voce realmente deseja cancelar a consulta da data {data} que começa as {inicio} e termina as {fim} com {nomeMédico}? </p>
          </DialogContent>

          <div className='flex flex-col gap-5 w-full justify-center items-center'>
       
          <button onClick={() => HandleRequest()} className="w-11/12 h-12 rounded-full bg-red-600 text-white font-bold">
               <p className="whitespace-nowrap">
                {passouTempoConsulta ? `Consulta Expirada nao é possivel cancelar`:  `Cancelar consulta com ${nomeMédico}`}
                 </p>
         </button>

         <button onClick={() => handleClose()} className="w-11/12 h-12 rounded-full bg-blue-600 text-white font-bold">
               <p className="whitespace-nowrap"> Voltar </p>
         </button>

          </div>

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
  );
}

