import { createContext, useContext, useState } from 'react'

/////////////// ---------- EndRegisterStateOk -----------///////////
const EndRegisterContext = createContext()
export const useEndRegister = () => useContext(EndRegisterContext)
export const EndRegisterProvider = ({ children, registerEndOk, setRegisterEndOk }) => (
  <EndRegisterContext.Provider value={{ registerEndOk, setRegisterEndOk }}>
    {children}
  </EndRegisterContext.Provider>
)

///////////////////// ----------- Context Blood ------------------ ////////////////
const BloodContext = createContext()
export const useBlood = () => useContext(BloodContext)
export const BloodProvider = ({ children, blood, setBlood }) => (
  <BloodContext.Provider value={{ blood, setBlood }}>
    {children}
  </BloodContext.Provider>
)

////////////////// ----------------- Horarios Provider ----------------------- ///////////////
const HorariosContext = createContext()
export const useHorariosDoctor = () => useContext(HorariosContext)
export const HorariosProvider = ({ children, horariosDoctor, setHorariosDoctor }) => (
  <HorariosContext.Provider value={{ horariosDoctor, setHorariosDoctor }}>
    {children}
  </HorariosContext.Provider>
)

////////////////////// ----- Context Warning Reuniao Acabando ----- //////////////////
const ReuniaoAcabandoContext = createContext()
export const useReuniaoAcabando = () => useContext(ReuniaoAcabandoContext)
export const ReuniaoAcabandoProvider = ({ children, reuniaoAcabando, setReuniaoAcabando }) => (
  <ReuniaoAcabandoContext.Provider value={{ reuniaoAcabando, setReuniaoAcabando }}>
    {children}
  </ReuniaoAcabandoContext.Provider>
)

///////////////////// ----------- Context Receita Simples ------------------ ////////////////
const ReceitaSimplesContext = createContext()
export const useReceitaSimples = () => useContext(ReceitaSimplesContext)
export const ReceitaSimplesProvider = ({ children, receitaSimples, setReceitaSimples }) => (
  <ReceitaSimplesContext.Provider value={{ receitaSimples, setReceitaSimples }}>
    {children}
  </ReceitaSimplesContext.Provider>
)

////////////////// ----------------- Context Receita Controlada ----------------------- ///////////////
const ReceitaControladaContext = createContext()
export const useReceitaControlada = () => useContext(ReceitaControladaContext)
export const ReceitaControladaProvider = ({ children, receitaControlada, setReceitaControlada }) => (
  <ReceitaControladaContext.Provider value={{ receitaControlada, setReceitaControlada }}>
    {children}
  </ReceitaControladaContext.Provider>
)

////////////////////////////// -------------------- Context Atestado --------------------------- ///////////////////////
const AtestadoContext = createContext()
export const useAtestado = () => useContext(AtestadoContext)
export const AtestadoProvider = ({ children, atestado, setAtestado }) => (
  <AtestadoContext.Provider value={{ atestado, setAtestado }}>
    {children}
  </AtestadoContext.Provider>
)

//////////////////////////// --------------------------- Exame Provider -------------------------- //////////////////////////
const ExameContext = createContext()
export const useExame = () => useContext(ExameContext)
export const ExameProvider = ({ children, exame, setExame }) => (
  <ExameContext.Provider value={{ exame, setExame }}>
    {children}
  </ExameContext.Provider>
)
