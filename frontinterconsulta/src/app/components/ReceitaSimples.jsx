import MedicationLiquidIcon from '@mui/icons-material/MedicationLiquid'
import { TextField } from '@mui/material'
import { useState } from 'react'
import { TemplateReceitaSimples } from '../partials/TemplateReceitaSimples'
import { useReceitaSimples } from '../context/context'

export const ReceitaSimples = ({
  NomePaciente,
  CPFPaciente,
  Endereço,
  NomeMedico,
  CRM,
  UF,
  date,
  HoraAtual,
  receitaS,
}) => {
  const { setReceitaSimples } = useReceitaSimples()

  const HandleChangeReceitaSimples = (newValue) => {
    setReceitaSimples((prevReceitaSimples) =>
      prevReceitaSimples.map((data, index) =>
        index === receitaS.index ? { ...data, ReceitaSimplesSolicitada: newValue } : data
      )
    )
  }

  return (
    <>
      <div className="flex gap-10 flex-col mt-10">
        {receitaS &&
          receitaS.map((data, index) => (
            <TemplateReceitaSimples
              key={index}
              index={index}
              data={data.ReceitaSimplesSolicitada}
              NomePaciente={NomePaciente}
              CPFPaciente={CPFPaciente}
              Endereço={Endereço}
              NomeMedico={NomeMedico}
              CRM={CRM}
              UF={UF}
              date={date}
              HoraAtual={HoraAtual}
              HandleChangeReceitaSimples={HandleChangeReceitaSimples}
            />
          ))}
      </div>
    </>
  )
}
