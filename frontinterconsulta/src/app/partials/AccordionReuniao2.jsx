import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  TextField
} from '@mui/material'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

export const AccordionReuniaoMédico2 = ({
  setMedicaçao,
  Medicaçao,
  setAtestado,
  atestado,
  setSolicitarExames,
  SolicitarExames,
}) =>{
    return(
      <>

        <Accordion>
          <AccordionSummary
           expandIcon={<ExpandMoreIcon color="primary" />}
           aria-controls="panel1a-content"
           id="panel1a-header"
           >
            <h1> Prescrição </h1>
          </AccordionSummary>
    
        <AccordionDetails>
          <TextField
             label="Prescrição"
             variant="standard"
             InputProps={{
                sx: { borderBottom: "1px solid blue" },
             }}
              onChange={(e) => setMedicaçao(e.target.value)}
              value={Medicaçao}
              className = "w-full"
              multiline={4}
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
            <h1> Atestado </h1>
          </AccordionSummary>
    
        <AccordionDetails>
          <TextField
             label="Atestado"
             variant="standard"
             InputProps={{
                 sx: { borderBottom: "1px solid blue" },
              }}
             onChange={(e) => setAtestado(e.target.value)}
             value={atestado}
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
             multiline={4}
             required
                />
          </AccordionDetails>
        </Accordion>
      </>
    )
}