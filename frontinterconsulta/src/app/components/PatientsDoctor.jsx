import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { config } from '../config'
import { useEffect, useState } from 'react'
import secureLocalStorage from 'react-secure-storage'
import { Autocomplete, TextField } from '@mui/material'
import Logo from '../public/logo.png'
import Image from 'next/image'

export const PatientsDoctor = () => {

    const[patient, setPatient] = useState('')
    const[namePatient, setNamePatient] = useState([])

    const getPatients = useMutation(async (valueRequest) => {
        try{
          const response = await axios.post(`${config.apiBaseUrl}/api/get-patients-atendidos`, valueRequest)
          const NomesPacientes = response.data.consultasAtendidas.map((data) => data.Solicitante)
          setNamePatient(NomesPacientes)
          return response.data.consultasAtendidas
        }catch(error){
          throw new Error('Erro ao pegar todos os Pacientes ja atendidos.')
        }
      })

      const id = secureLocalStorage.getItem('id')
      const NomeMedico = secureLocalStorage.getItem('NomeMedico')

      useEffect(() => {
           getPatients.mutate({ id: id })
      },[])

      return (
        <>
          {getPatients.isSuccess ? (
            getPatients.data.length > 0 ? (
              <div className='flex justify-center items-center flex-col gap-3'>
               <Autocomplete
                value={patient === '' ? null : patient}
                onChange={(event, newValue) => {
                  if (newValue !== null) {
                    setPatient(newValue);
                  }
                }}
                options={namePatient}
                noOptionsText="Sem resultados"
                renderInput={(params) => <TextField {...params} label={"Nome do Paciente"} variant="standard" />}
                className="w-1/2 border-b border-blue-500 sm:w-11/12"
              />

              <div className="flex gap-7 flex-wrap  justify-center items-center sm:gap-10">
                  {getPatients.data.map((paciente, index) => (
                    <div key={index} onClick={() => alert('Ola Paciente')}
                     className="cursor-pointer flex flex-col justify-center items-center border-blue-500 border-2 rounded-lg p-2">
                      <div className="sm:flex sm:justify-center mb-4">
                        {paciente.FotoPaciente ? 
                         <Image src={`${config.apiBaseUrl}/${paciente.Foto}`} alt="Foto do Paciente" width={100} height={100} className="sm:rounded-full rounded-xl" /> 
                         : 
                         <Image src={Logo} alt="Foto Paciente" width={100} height={100} className="sm:rounded-full rounded-xl" />
                        }
                      </div>
                      <div className="flex gap-3 justify-center items-center">
                        <p className="sm:text-center text-center text-blue-500 font-bold">{paciente.Solicitante}</p>
                      </div>
                      <div className="flex justify-center items-center flex-col">
                      <p className="text-center sm:text-center text-blue-900"> {paciente.Casos}</p>
                      <p className="text-center sm:text-center text-blue-900"> {paciente.Data}</p>
                      </div>
                    </div>
             ))}

                 
                </div>
              </div>
            ) : (
              <h1> Doutor Infelizmente voce ainda nao Atendeu nenhum Paciente =/</h1>
            )
          ) : (
            <h1>Erro Ao Pegar os Pacientes que o Dr Atendeu!</h1>
          )}
        </>
      )
}