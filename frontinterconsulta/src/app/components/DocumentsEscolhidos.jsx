import { TemplateComponenteExame } from '../partials/TemplateComponentExame.jsx'
import { TemplateReceitaSimples } from '../partials/TemplateReceitaSimples.jsx'
import { TemplateReceitaControlada } from '../partials/TemplateReceitaControlada.jsx'
import { TemplateAtestado } from '../partials/TemplateAtestado.jsx'
import { useExame } from '../context/context.js'
import { useReceitaSimples } from '../context/context.js'
import { useReceitaControlada } from '../context/context.js'
import { useAtestado } from '../context/context'

export const DocumentsEscolhidos = ({ date, 
    nomePaciente,
    nomeMedico,
    CRMMedico,
    EnderecoMedico,
    SolicitarExames,
    UF,
    HoraAtual,
    CPFPaciente,
    CidadeMedico,
    EnderecoPaciente,
    exames,
    receitaS,
    receitaC,
    atestado
 }) => {

  const { setExame } = useExame()
  setExame(exames)
  const { setReceitaSimples } = useReceitaSimples()
  setReceitaSimples(receitaS)
  const { setReceitaControlada} = useReceitaControlada()
  setReceitaControlada(receitaC)
  const { setAtestado } = useAtestado()
  setAtestado(atestado)

 
    const HandleChangeExame = (index, newValue) => {
      const updatedExames = [...exames];
      updatedExames[index].Exame = newValue;
      setExame(updatedExames)
    }

    const HandleChangeReceitaSimples = (index, newValue) => {
        const updateReceitaSimples = [...receitaS];
        updateReceitaSimples[index].ReceitaSimplesSolicitada = newValue;
        setReceitaSimples(updateReceitaSimples)
    }

    const HandleChangeReceitaC = (index, newValue) => {
        const updateReceitaControlada = [...receitaC]
        updateReceitaControlada[index].ReceitaControladaSolicitada = newValue
        setReceitaControlada(updateReceitaControlada)
    }

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
        <div className='flex flex-col gap-3 mt-10 w-10/12'>
        {exames && exames.map((data, index) => {
            return (
                <TemplateComponenteExame
                    key={index} // Adicionando key para cada componente
                    index={index}
                    date={date}
                    nomePaciente={nomePaciente}
                    nomeMedico={nomeMedico}
                    CRMMedico={CRMMedico}
                    EnderecoMedico={EnderecoMedico}
                    SolicitarExames={SolicitarExames}
                    data={data.Exame}
                    handleChangeExame={(newValue) => HandleChangeExame(index, newValue)} 
                />
            );
        })}

       {receitaS && receitaS.map((data, index) => {
            return(
                <>
                <TemplateReceitaSimples
                    index={index}
                    data={data.ReceitaSimplesSolicitada}
                    NomePaciente={nomePaciente}
                    CPFPaciente={CPFPaciente}
                    Endereço={EnderecoMedico}
                    NomeMedico={nomeMedico}
                    CRM={CRMMedico}
                    UF={UF}
                    date={date}
                    HoraAtual={HoraAtual}
                    HandleChangeReceitaSimples={(newValue) => HandleChangeReceitaSimples(index, newValue)}
                />
                </>
            )
        })}

        {receitaC && receitaC.map((data, index) => {
                return(
                <>
                <TemplateReceitaControlada
                    Endereço={EnderecoMedico}
                    NomeMedico={nomeMedico}
                    CRM={CRMMedico}
                    UF={UF}
                    CidadeMedico={CidadeMedico}
                    NomePaciente={nomePaciente}
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

          {atestado && atestado.map((data, index) => {
                return(
                  <>
                    <TemplateAtestado
                        NomeMedico={nomeMedico}
                        CRMMedico={CRMMedico}
                        NomePaciente={nomePaciente} 
                        CPFPaciente={CPFPaciente}
                        Localidade={EnderecoMedico}
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