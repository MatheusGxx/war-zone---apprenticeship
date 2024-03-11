import { TemplateReceitaControlada } from '../partials/TemplateReceitaControlada'
import { useReceitaControlada } from '../context/context'

export const ReceitaControlada = ({
  endereco,
  nomeMedico,
  crm,
  uf,
  cidadeMedico,
  nomePaciente,
  enderecoPaciente,
  cpfPaciente,
  date,
  receitaC,
}) => {
  const { setReceitaControlada } = useReceitaControlada()

  const handleChangeReceitaC = (index, newValue) => {
    const updatedReceitaControlada = [...receitaC]
    updatedReceitaControlada[index].receitaControladaSolicitada = newValue
    setReceitaControlada(updatedReceitaControlada)
  }

  return (
    <div className='flex flex-col gap-10 mt-10 w-10/12'>
      {Array.isArray(receitaC) &&
        receitaC.map((data, index) => {
          return (
            <TemplateReceitaControlada
              key={index}
              endereco={endereco}
              nomeMedico={nomeMedico}
              crm={crm}
              uf={uf}
              cidadeMedico={cidadeMedico}
              nomePaciente={nomePaciente}
              enderecoPaciente={enderecoPaciente}
              cpfPaciente={cpfPaciente}
              date={date}
              data={data.receitaControladaSolicitada}
              index={index}
              handleChangeReceitaC={(newValue) => handleChangeReceitaC(index, newValue)}
            />
          )
        })}
    </div>
  )
}
