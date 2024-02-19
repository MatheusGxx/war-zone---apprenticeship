import { TemplateComponenteExame } from '../partials/TemplateComponentExame.jsx'
import { useExame } from '../context/context.js'

export const SolicitaçaoExames = ({ date, 
    nomePaciente,
    nomeMedico,
    CRMMedico,
    EnderecoMedico,
    SolicitarExames,
    IdentificadorConsulta,
    exames,
 }) => {

  const { setExame } = useExame()
  setExame(exames)
 
    const HandleChangeExame = (index, newValue) => {
      const updatedExames = [...exames];
      updatedExames[index].Exame = newValue;
      setExame(updatedExames)
    }
     
    
    return(
        <>
        <div className='flex flex-col gap-3 mt-10'>
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

        </div>
       
        </>
    )
}