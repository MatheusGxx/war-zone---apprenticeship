import MedicationLiquidIcon from '@mui/icons-material/MedicationLiquid'
import { TextField } from '@mui/material'
import Image from 'next/image'
import Logo from '../public/logo.png'

export const TemplateReceitaControlada = ({
  Endereço = '',
  NomeMedico = '',
  CRM = '',
  UF = '',
  CidadeMedico = '',
  NomePaciente = '',
  EnderecoPaciente = '',
  CPFPaciente = '',
  date = '',
  index = 0,
  data = '',
  HandleChangeReceitaC,
  HandleChangeReceitaSimples
}) => {
  return (
    <>
      <div
        key={index}
        className="w-full border-blue-500 border-4 rounded-lg p-6"
      >
        <div className="flex justify-center items-center gap-5">
          <h1 className="font-bold text-blue-900 text-2xl">
            Receita Controlada {index + 1}
          </h1>
          <MedicationLiquidIcon color="primary" />
        </div>

        <div className="flex gap-5 container mt-10">
          <div className="flex gap-3 flex-col container border-2 border-blue-500 rounded-lg p-3">
            <h1 className="flex justify-center items-center font-bold text-lg text-blue-900">
              Identificação do Emitente
            </h1>
            <div className="flex justify-start items-center gap-3">
              <h1 className="display-inline" style={{ fontSize: '1rem' }}>
                Nome:
              </h1>
              <h1 className="display-inline"> {NomeMedico} </h1>
            </div>
            <div className="flex justify-start items-center gap-3">
              <h1 className="display-inline" style={{ fontSize: '1rem' }}>
                CRM:
              </h1>
              <h1 className="display-inline"> {CRM} </h1>
            </div>

            <div className="flex justify-start items-center gap-3">
              <h1 className="display-inline" style={{ fontSize: '1rem' }}>
                Endereço:
              </h1>
              <h1 className="display-inline"> {Endereço}</h1>
            </div>

            <div className="flex justify-start items-center gap-3">
              <h1 className="display-inline" style={{ fontSize: '1rem' }}>
                Cidade e UF:
              </h1>
              <h1 className="display-inline"> {CidadeMedico} - {UF}</h1>
            </div>
          </div>

          <div className="flex flex-col gap-3 container ">
            <h1 className="flex justify-center items-center font-bold text-lg text-blue-900">
              Receituário Controle Especial
            </h1>
            <div className="flex justify-start items-center gap-3">
              <h1 className="display-inline" style={{ fontSize: '1rem' }}>
                Data:
              </h1>
              <h1 className="display-inline"> {date} </h1>
            </div>
            <div className="flex justify-start items-center gap-3">
              <h1 className="display-inline" style={{ fontSize: '1rem' }}>
                1a. via Farmacia
              </h1>
            </div>
            <div className="flex justify-start items-center gap-3">
              <h1 className="display-inline" style={{ fontSize: '1rem' }}>
                2a. via Paciente
              </h1>
            </div>
            <div
              className="border-b-2 border-blue-500  w-full"
              style={{ marginBottom: '1rem' }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 ml-3 mt-3">
          <h1 className="font-bold text-blue-900"> {NomePaciente} </h1>
          <h1>
            <span className="font-bold text-blue-900"> CPF: </span>
            {CPFPaciente}
         
