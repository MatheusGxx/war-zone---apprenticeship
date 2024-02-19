import { TemplateAtestado } from '../partials/TemplateAtestado'
import { useAtestado } from '../context/context'

export const AtestadoDoctor = ({ 
    NomeMedico,
    CRMMedico, 
    NomePaciente, 
    CPFPaciente,
    Localidade,
    date,
    atestado,
}) => {
    const { setAtestado } = useAtestado()
    setAtestado(atestado)
   
    const HandleChangeDiasAfastados = (index, newValue) => {
      const updatedAtestado = [...atestado]
      updatedAtestado[index].DiasDeAtestado = newValue
      setAtestado(updatedAtestado)
    }

    const HandleChangeCID = (index, newValue) => {
      const updatedAtestado =    [...atestado]
      updatedAtestado[index].CID = newValue
      setAtestado(updatedAtestado)
    }

    return(
        <>
         <div className='flex flex-col gap-3 mt-10  justify-center items-center'>
            {atestado && atestado.map((data, index) => {
                return(
                  <>
                    <TemplateAtestado
                        NomeMedico={NomeMedico}
                        CRMMedico={CRMMedico}
                        NomePaciente={NomePaciente} 
                        CPFPaciente={CPFPaciente}
                        Localidade={Localidade}
                        date={date}
                        data={data}
                        index={index}
                        HandleChangeDiasAfastados={(newValue) => HandleChangeDiasAfastados(index, newValue)}
                        HandleChangeCID={(newValue) => HandleChangeCID(index, newValue)}
                    />
                  </>
                )
            })}
         </div>
        </>
    )
}   