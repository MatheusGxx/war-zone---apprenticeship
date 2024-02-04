import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    TextField
  } from '@mui/material'
  
  import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
  
  export const AccordionReuniaoMédico = ({
    setFicha,
    ficha,
    setDiagnóstico,
    Diagnóstico,
    setTratamento,
    Tratamento,
    setFerramenta,
    FerramentaTerapeutica,
    setProgresso,
    Progresso,
  }) =>{
      return(
        <>
          <Accordion>
              <AccordionSummary
               expandIcon={<ExpandMoreIcon color="primary"/>}
               aria-controls="panel1a-content"
               id="panel1a-header"
               >
                <h1> Ficha do Paciente </h1>
              </AccordionSummary>
            <AccordionDetails>
              <TextField
                 label="Ficha do Paciente"
                 variant="standard"
                 InputProps={{
                    sx: { borderBottom: "1px solid blue" },
                }}
                 onChange={(e) => setFicha(e.target.value)}
                 value={ficha}
                 className = "w-full"
                 required
                 multiline={4}
                 />
              </AccordionDetails>
            </Accordion>
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
             expandIcon={<ExpandMoreIcon color="primary" />}
             aria-controls="panel1a-content"
             id="panel1a-header"
             >
              <h1> Tratamento </h1>
            </AccordionSummary>
      
          <AccordionDetails>
            <TextField
               label="Tratamento"
               variant="standard"
               InputProps={{
                  sx: { borderBottom: "1px solid blue" },
               }}
                onChange={(e) => setTratamento(e.target.value)}
                value={Tratamento}
                className = "w-full"
                multiline={4}
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
        </>
      )
  }