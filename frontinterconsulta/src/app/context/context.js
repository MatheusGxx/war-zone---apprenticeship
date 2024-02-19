import { createContext, useContext, useState } from 'react'

/////////////////////// ----------- Context Data Horary Doctor ------------ /////////////
const HistoricoContext = createContext()

export const HistoricoProvider = ({ children }) =>{
  const [historico, setHistorico ] = useState([])

  return(
    <HistoricoContext.Provider value={{ historico, setHistorico }}>
      {children}
    </HistoricoContext.Provider>
  )
}

export const useHistorico =  () => {
   const context = useContext(HistoricoContext)

   if(!context){
    throw new Error("useHistorico deve ser usado dentro um HistoricoProvider")
   }

   return context
}

/////////////// ---------- EndRegisterStateOk -----------///////////

const EndRegister = createContext()

export const RegisterEndProvider = ({ children }) => {

  const[registerEndOk, setRegisterEndOk] = useState(false)

  return(
    <EndRegister.Provider value={{registerEndOk, setRegisterEndOk}}>
        {children}
    </EndRegister.Provider>
  )
}

export const useEndRegister = () => {
  const context = useContext(EndRegister)

  if(!context){
    throw new Error('useRegisterEnd deve ser usado dentro de um RegisterEndProvider')
  }

  return context
}

///////////////////// ----------- Context Blood ------------------ ////////////////

const Blood = createContext()

export const BloodProvider = ({children}) => {
   const[blood, setBlood] = useState(false)
   
   return(
    <Blood.Provider value={{ blood, setBlood}}>
       {children}
    </Blood.Provider>
   )
}

export const useBlood = () => {
  const context = useContext(Blood)

  if(!context){
     throw new Error('useBlood deve ser usado dentro de um BloodProvider')
  }

  return context
}


////////////////// ----------------- Horarios Provider ----------------------- ///////////////

const Historico = createContext()

export const ProviderHistoricoDoctor = ({children}) => {
   const[historico, setHistorico] = useState(false)
   
   return(
    <Historico.Provider value={{ historico, setHistorico}}>
       {children}
    </Historico.Provider>
   )
}

export const useHistoricoDoctor = () => {
  const context = useContext(Historico)

  if(!context){
     throw new Error('useHistoricoProvider deve ser usado dentro de um ProviderHistoricoDoctor')
  }

  return context
}

////////////////////// ----- Context Warning Reuniao Acabando ----- //////////////////

const ReuniaoAcabando = createContext()

export const ReuniaoAcabandoProvider = ({ children }) => {
  const [reuniaoAcabando, setReuniaoAcabando] = useState(false)
  
  return(
    <ReuniaoAcabando.Provider value={{reuniaoAcabando, setReuniaoAcabando}}>
          {children}
    </ReuniaoAcabando.Provider>
  )
}

export const UseReuniaoAcabando = () =>{
  const context = useContext(ReuniaoAcabando)

  if(!context){
    throw new Error('useReuniaoAcabando deve ser usado dentro de um ReuniaoAcabandoProvider')
  }

  return context
}


///////////////////// ----------- Context Receita Simples ------------------ ////////////////

const ReceitaSimples = createContext()

export const ReceitaSimplesProvider = ({children}) => {
   const[receitaSimples, setReceitaSimples] = useState(null)
   
   return(
    <ReceitaSimples.Provider value={{ receitaSimples, setReceitaSimples}}>
       {children}
    </ReceitaSimples.Provider>
   )
}

export const useReceitaSimples = () => {
  const context = useContext(ReceitaSimples)

  if(!context){
     throw new Error('useReceitaSimples deve ser usado dentro de um ReceitaSimplesProvider')
  }

  return context
}


////////////////// ----------------- Context Receita Controlada ----------------------- ///////////////

const ReceitaControlada = createContext()

export const ReceitaControladaProvider = ({children}) => {
   const[receitaControlada, setReceitaControlada] = useState(null)
   
   return(
    <ReceitaControlada.Provider value={{ receitaControlada, setReceitaControlada }}>
       {children}
    </ReceitaControlada.Provider>
   )
}

export const useReceitaControlada = () => {
  const context = useContext(ReceitaControlada)

  if(!context){
     throw new Error('useReceitaControlada deve ser usado dentro de um ReceitaControladaProvider')
  }

  return context
}


////////////////////////////// -------------------- Context Atestado --------------------------- ///////////////////////

const Atestado = createContext()

export const AtestadoProvider = ({ children }) => {
  const [atestado, setAtestado] = useState(null)

  return(
    <Atestado.Provider value={{ atestado, setAtestado}}>
         {children}
    </Atestado.Provider>
  )
}

export const useAtestado = () => {
  const context = useContext(Atestado)

  if(!context){
    throw new Error('useAtestado deve ser usado dentro de um AtestadoProvider')
  }

  return context
}

//////////////////////////// --------------------------- Exame Provider -------------------------- //////////////////////////

const Exame = createContext()

export const ExameProvider = ({ children }) => {
  const [exame, setExame] = useState(null)
  
  return(
    <Exame.Provider value={{ exame, setExame}}>
         {children}
    </Exame.Provider>
  )
}

export const useExame = () => {
  const context = useContext(Exame)

  if(!context){
    throw new Error('useExame só pode ser usado dentro de um ExameProvider')
  }

  return context
}







