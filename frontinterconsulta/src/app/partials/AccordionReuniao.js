import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  TextField
} from '@mui/material'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

export const AccordionReuniaoMédico = ({
  setDiagnóstico,
  Diagnóstico,
  setTratamento,
  Tratamento,
  setMedicaçao,
  Medicaçao,
  setFerramenta,
  FerramentaTerapeutica,
  setProgresso,
  Progresso,
  setSolicitaçaoMedicamentos,
  SolicitaçaoMedicamentos,
  setSolicitaçaoMateriais,
  SolicitaçaoMateriais,
  setSolicitarExames,
  SolicitarExames,
  setRecomendacoes,
  Recomendacoes,
}) =>{
    return(
      <>
        <Accordion>
            <AccordionSummary
             expandIcon={<ExpandMoreIcon color="primary"/>}
             aria-controls="panel1a-content"
             id="panel1a-header"
             >
              <h1> Diagnóstico </h1>
            </AccordionSummary>
          <AccordionDetails>
            <TextField
               label="Diagnóstico"
               variant="standard"
               InputProps={{
                  sx: { borderBottom: "1px solid blue" },
              }}
               onChange={(e) => setDiagnóstico(e.target.value)}
               value={Diagnóstico}
               className = "w-full"
               required
               />
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
             expandIcon={<ExpandMoreIcon color="primary"/>}
             aria-controls="panel1a-content"
             id="panel1a-header"
             >
              <h1> Tratamento </h1>
            </AccordionSummary>
          <AccordionDetails>
            <TextField
                label="Tratamento do Paciente"
                variant="standard"
                InputProps={{
                   sx: { borderBottom: "1px solid blue" },
                 }}
                onChange={(e) => setTratamento(e.target.value)}
                value={Tratamento}
                className = "w-full"
                required
              />
            </AccordionDetails>
          </Accordion>

          <Accordion>
          <AccordionSummary
           expandIcon={<ExpandMoreIcon color="primary" />}
           aria-controls="panel1a-content"
           id="panel1a-header"
           >
            <h1> Medicaçao </h1>
          </AccordionSummary>
    
        <AccordionDetails>
          <TextField
             label="Medicaçao"
             variant="standard"
             InputProps={{
                sx: { borderBottom: "1px solid blue" },
             }}
              onChange={(e) => setMedicaçao(e.target.value)}
              value={Medicaçao}
              className = "w-full"
              required
             />
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary
           expandIcon={<ExpandMoreIcon color="primary" />}
           aria-controls="panel1a -content"
           id="panel1a-header"
           >
            <h1> Ferramentas Terapeuticas</h1>
          </AccordionSummary>
    
        <AccordionDetails>
          <TextField
              label="Ferramentas Terapeuticas"
              variant="standard"
              InputProps={{
                  sx: { borderBottom: "1px solid blue" },
               }}
               onChange={(e) => setFerramenta(e.target.value)}
               value={FerramentaTerapeutica}
               className = "w-full"
               required
                />
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary
           expandIcon={<ExpandMoreIcon color="primary"/>}
           aria-controls="panel1a-content"
           id="panel1a-header"
           >
            <h1> Progresso </h1>
          </AccordionSummary>
    
        <AccordionDetails>
          <TextField
             label="Progresso"
             variant="standard"
             InputProps={{
                sx: { borderBottom: "1px solid blue" },
              }}
              onChange={(e) => setProgresso(e.target.value)}
              value={Progresso}
              className = "w-full" 
              required
            />
          </AccordionDetails>
        </Accordion>

        <Accordion>
        <AccordionSummary
           expandIcon={<ExpandMoreIcon color="primary"/>}
           aria-controls="panel1a-content"
           id="panel1a-header"
           >
            <h1> Recomendaçoes Futuras </h1>
          </AccordionSummary>
    

        <AccordionDetails>
          <TextField
             label="Recomendaçoes Futuras"
             variant="standard"
             InputProps={{
                 sx: { borderBottom: "1px solid blue" },
              }}
             onChange={(e) => setRecomendacoes(e.target.value)}
             value={Recomendacoes}
             className = "w-full"
             required
           />
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary
           expandIcon={<ExpandMoreIcon color="primary"/>}
           aria-controls="panel1a-content"
           id="panel1a-header"
           >
            <h1> Solicitaçao Medicamentos </h1>
          </AccordionSummary>
    
        <AccordionDetails>
          <TextField
             label="Solicitaçao Médicamentos"
             variant="standard"
             InputProps={{
               sx: { borderBottom: "1px solid blue" },
              }}
              onChange={(e) => setSolicitaçaoMedicamentos(e.target.value)}
              value={SolicitaçaoMedicamentos}
              className = "w-full"
               required
          />
          </AccordionDetails>
        </Accordion>

        
        <Accordion>
          <AccordionSummary
           expandIcon={<ExpandMoreIcon color="primary"/>}
           aria-controls="panel1a-content"
           id="panel1a-header"
           >
            <h1> Solicitaçao Materiais </h1>
          </AccordionSummary>
    
        <AccordionDetails>
          <TextField
             label="Solicitaçao Médicamentos"
             variant="standard"
             InputProps={{
                 sx: { borderBottom: "1px solid blue" },
              }}
             onChange={(e) => setSolicitaçaoMateriais(e.target.value)}
             value={SolicitaçaoMateriais}
             className = "w-full"
             required
                />
          </AccordionDetails>
        </Accordion>

        <Accordion>
        <AccordionSummary
           expandIcon={<ExpandMoreIcon color="primary"/>}
           aria-controls="panel1a-content"
           id="panel1a-header"
           >
            <h1> Solicitar Exames </h1>
          </AccordionSummary>
    

        <AccordionDetails>
          <TextField
             label="Solicitar Exames"
             variant="standard"
             InputProps={{
                 sx: { borderBottom: "1px solid blue" },
              }}
             onChange={(e) => setSolicitarExames(e.target.value)}
             value={SolicitarExames}
             className = "w-full"
             required
                />
          </AccordionDetails>
        </Accordion>
      </>
    )
}