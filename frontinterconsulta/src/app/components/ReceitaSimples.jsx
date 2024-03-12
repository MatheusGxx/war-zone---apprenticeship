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
    setReceitaSimples(receitaS)
   
    const HandleChangeReceitaSimples = (index, newValue) => {
      const updateReceitaSimples = [...receitaS];
      updateReceitaSimples[index].ReceitaSimplesSolicitada = newValue;
      setReceitaSimples(updateReceitaSimples)
    }
    
    return(
        <>
        <div className="flex gap-10 flex-col mt-10">
        {receitaS && receitaS.map((data, index) => {
            return(
                <>
                <TemplateReceitaSimples
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
                    HandleChangeReceitaSimples={(newValue) => HandleChangeReceitaSimples(index, newValue)}
                />
                </>
            )
        })}
       
        </div> 
        </>
    )
}