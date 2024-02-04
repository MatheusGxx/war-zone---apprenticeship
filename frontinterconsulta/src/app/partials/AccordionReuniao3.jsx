import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    TextField
  } from '@mui/material'
  
  import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
  
  export const AccordionReuniaoMédico3 = ({
    setSolicitaçaoMedicamentos,
    SolicitaçaoMedicamentos,
    setSolicitaçaoMateriais,
    SolicitaçaoMateriais,
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
  
        </>
      )
  }