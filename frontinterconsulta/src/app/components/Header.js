import React, { useState, useEffect } from "react"
import PopUpRecuperaçao from "../partials/PopUpRecuperaçao"
import { useMutation } from '@tanstack/react-query'
import { config } from "../config"
import secureLocalStorage from 'react-secure-storage'
import axios from 'axios'

const Header = () => {
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [paginaCarregada, setPaginaCarregada] = useState(false)

  const ValidatorPatientConsulta = useMutation(
    async (valueRequest) => {
      const response = await axios.post(`${config.apiBaseUrl}/api/validator-patient`, valueRequest)
      return response.data.ConsultasSolicitadas
    }
  )

  const id = secureLocalStorage.getItem('id')

  useEffect(() => {
    const FetchingDataPatient = async () => {
      const data = await ValidatorPatientConsulta.mutateAsync({ id: id })
      return data
    };

    const VerifyConsultaPatient = async () => {
      if (id) {
        const ResultPatient = await FetchingDataPatient()
        return ResultPatient.length > 0 ? false : true
      }
      return false
    }

    VerifyConsultaPatient().then((valid) => {
      setPaginaCarregada(valid)
    })
  }, [id])

  useEffect(() => {
    if (paginaCarregada) {
      setMostrarFormulario(true)
    }
  }, [paginaCarregada])

  return (
    <>
      <header
        className="container bg-blue-900 p-1 text-white"
        onMouseEnter={() => {
          if (paginaCarregada) {
            setMostrarFormulario(true)
          }
        }}
      >
        <h2 className="text-center text-lg">
          Conecte-se a especialistas do mundo Inteiro!
        </h2>
      </header>
      {mostrarFormulario && <PopUpRecuperaçao />}
    </>
  );
};

export default Header;
