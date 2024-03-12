import { TemplateReceitaControlada } from '../partials/TemplateReceitaControlada'
import { useReceitaControlada } from '../context/context'

export const ReceitaControladA = ({
    Endereço,
    NomeMedico,
    CRM,
    UF,
    CidadeMedico,
    NomePaciente,
    EnderecoPaciente,
    CPFPaciente,
    date,
    receitaC
}) => {
    
  const { setReceitaControlada } = useReceitaControlada()
  setReceitaControlada(receitaC)
   
  const HandleChangeReceitaC = (index, newValue) => {
    const updateReceitaControlada = [...receitaC]
    updateReceitaControlada[index].ReceitaControladaSolicitada = newValue
    setReceitaControlada(updateReceitaControlada)
  }

    return(
        <>
        <div className='flex flex-col gap-10 mt-10 w-10/12'>
          {receitaC && receitaC.map((data, index) => {
            return(
              <>
              <TemplateReceitaControlada
               Endereço={Endereço}
               NomeMedico={NomeMedico}
               CRM={CRM}
               UF={UF}
               CidadeMedico={CidadeMedico}
               NomePaciente={NomePaciente}
               EnderecoPaciente={EnderecoPaciente}
               CPFPaciente={CPFPaciente}
               date={date}
               data={data.ReceitaControladaSolicitada}
               index={index}
               HandleChangeReceitaC={(newValue) => HandleChangeReceitaC(index, newValue)}
              />
              </>
            )
          })}
        </div>
        </>
    )
}






