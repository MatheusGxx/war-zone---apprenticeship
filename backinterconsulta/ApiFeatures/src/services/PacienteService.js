import { models } from "../../MongoDB/Schemas/Schemas.js"
import { GPT } from "../utils/Functions/IA.js"
import { EspecialidadesAtendidas } from '../utils/EspecialidadesAtendidas.js'

export const GetDoença = async (doenca, res) => {

  doenca 

  try {

    const prompt = `Chatgpt me fale como evitar ter ${doenca} e tambem diga o que acontece se nao
    procurar um médico para tratar e no final fale que no Interconsulta nós temos os melhores médicos
    para tratar essa doença deixando claro o nome da doença, para ele finalizar o cadastro, gere um 
    texto curto de no maximo 8 linhas`

    const especialidadeSugerida = await GPT(prompt, 250, 0.2)

    const responseIA = especialidadeSugerida.content

    return res.status(200).json(responseIA);
  } catch (e) {
    console.log(e)
  }
}


export const EspecialidadesDisponiveis = async (body, res) =>{

  const { doenca, id } = body

  try{
    const ModelPaciente = await models.ModelRegisterMédico.find({
      $or: [
        { 'DoencasAndSintomas.Doenca': { $in: doenca } },
        { 'DoencasAndSintomas.Sintomas': { $in: doenca } },
      ],
    })
    
    if(id){
      const getPaciente = await models.ModelRegisterPaciente.findById(id)
      getPaciente.Doenca = doenca
      getPaciente.GifDoenca=  `icons-doencas/${doenca}.gif`
      getPaciente.save()

      if(ModelPaciente.length > 0){
        return res.status(200).json({ NewDoenca: getPaciente.Doenca, ModelPaciente })
      }else{
        return res.status(404).json({ message: 'Nao Atendemos essa Doença Ainda'})
      }
    }

  if (ModelPaciente.length > 0) {
    return res.status(200).json({ ModelPaciente })
  } else {
    return res.status(404).json({ message: 'Nao Atendemos essa Doença ainda' })
  } 
  }catch(error){
   console.log(error)
  }
}



export const getEspecialista = async (body, res) =>{

  const { slugIdentificador } = body

  try{ 
    const ModelEspecialista = await models.ModelRegisterMédico.findOne({ Slug: slugIdentificador})

    if(ModelEspecialista){
      return res.status(200).json({ ModelEspecialista })
    }else{
      return res.status(404).json({ message: 'Médico nao cadastrado =/ '})
    }
  }catch(error){
    console.log(error)
  }
}


export const GetRecomendacoesEspecialistas = async (body, res) => {
  const { slugIdentificador } = body
   
  try{
    const ModelEspecialista = await models.ModelRegisterMédico.findOne({ Slug: slugIdentificador })

  if (ModelEspecialista) {
      const ExtractAreadeAtuaçaoModel = ModelEspecialista.AreadeAtuacao

      const QueryEspecialidadesDB = await models.ModelRegisterMédico.find({
          AreadeAtuacao: ExtractAreadeAtuaçaoModel ,
          Slug: { $ne: slugIdentificador } //  $ne = Nao igual a
      })

      return res.status(200).json({ QueryEspecialidadesDB })
  }else{
     return res.status(404).json({ message:'Atualmente nao Temos médico para essa Especialidade'})
  }
  }catch(error){
    console.log(error)
  }
}

export const GetPaciente = async(body, res) => {
  const { id } = body
  
  try{
    const ModelPaciente = await models.ModelRegisterPaciente.findById(id)

  if(ModelPaciente){
    return res.status(200).json({ ModelPaciente })
  }else{  
    return res.json({ message: 'Paciente nao cadastrado no Banco de dados'})
  }
  }catch(error){
    console.log(error)
  }
}

export const getBlood = async (params, res) =>{
  const { id } = params

  try{
    const getPaciente = await models.ModelRegisterPaciente.findById(id)

    const TipoSanguineo = getPaciente.TipoSanguineo
    const Cidade = getPaciente.Cidade
    
    let Compativeis
    let QueryCompativeis
  
    switch(TipoSanguineo){
      case 'A+':
        Compativeis = ['A+', 'A-', 'O+', 'O-']
  
         QueryCompativeis = await models.ModelCasosClinicos.find({
          TipoSanguineo: { $in: Compativeis },
          'Historico.Cidade': Cidade
        })
  
         res.status(200).json({ QueryCompativeis, TipoSanguineo, Cidade})
       break
       
       case 'A-':
  
       Compativeis = ['A-', 'O-']
  
       QueryCompativeis = await models.ModelCasosClinicos.find({
         TipoSanguineo: { $in: Compativeis},
         Cidade: Cidade
       })
  
        res.status(200).json({ QueryCompativeis, TipoSanguineo, Cidade})
      
       break
  
       case 'B+':
  
       Compativeis = ['B+', 'B-', 'O+', 'O-']
  
       QueryCompativeis = await models.ModelCasosClinicos.find({
         TipoSanguineo: { $in: Compativeis},
          'Historico.Cidade': Cidade
       })
  
        res.status(200).json({ QueryCompativeis, TipoSanguineo, Cidade })
      
       break
  
       case 'B-':
  
       Compativeis = ['B-', 'O-']
  
       QueryCompativeis = await models.ModelCasosClinicos.find({
         TipoSanguineo: { $in: Compativeis},
         'Historico.Cidade': Cidade
       })
  
        res.status(200).json({ QueryCompativeis, TipoSanguineo, Cidade})
  
       break
  
       case 'AB+':
  
      QueryCompativeis = await models.ModelCasosClinicos.find({ TipoSanguineo: { $exists: true } })
  
      res.status(200).json({ QueryCompativeis, TipoSanguineo, Cidade})
        
      
       break
  
       case 'AB-':
  
       Compativeis = ['A-', 'B-', 'AB-', 'O-']
  
       QueryCompativeis = await models.ModelCasosClinicos.find({
         TipoSanguineo: { $in: Compativeis},
         'Historico.Cidade': Cidade
       })
  
        res.status(200).json({ QueryCompativeis, TipoSanguineo, Cidade})
      
       break
  
       case 'O+':
  
       Compativeis = ['O+', ' O-']
  
       QueryCompativeis = await models.ModelCasosClinicos.find({
         TipoSanguineo: { $in: Compativeis},
         'Historico.Cidade': Cidade
       })
  
        res.status(200).json({ QueryCompativeis, TipoSanguineo, Cidade})
      
       break
  
       case 'O-':
  
       Compativeis = ['O-']
  
       QueryCompativeis = await models.ModelCasosClinicos.find({
         TipoSanguineo: { $in: Compativeis},
         'Historico.Cidade': Cidade
       })
  
        res.status(200).json({ QueryCompativeis, TipoSanguineo, Cidade})
      
       break
  
       default:
        res.status(404).json({ QueryCompativeis: 'Infelizmente por hora nao temos pessoas compativeis com o seu Sangue na sua cidade.'})
    }
  }catch(error){
    console.log(error)
  }
}

export const getMedicoStatus = async (id, res) => {

  try {
    const getMedico = await models.ModelRegisterMédico.find({ _id: { $in: id } });

    if (getMedico.length > 0) {
      const statusArray = getMedico.map(doctor => doctor.online)
      res.status(200).json({ status: statusArray });
    } else {
      // Handle the case where no doctors are found
      res.status(404).json({ message: 'Médicos não encontrados no banco de dados do Interconsulta =/' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
}

export const UpdateOnlineDoctor = async (body, res) => {
  const { id, status } = body

  try {
    const updatedDoctor = await models.ModelRegisterMédico.findByIdAndUpdate(
      id,
      { $set: { online: status } },
      { new: true }
    );

    if (updatedDoctor) {
      return res.status(200).json({ updatedDoctor });
    } else {
      return res.status(404).json({ message: 'Médico não está cadastrado no Interconsulta =/' });
    }
  } catch (error) {
    console.error('Erro ao atualizar médico:', error);
    return res.status(500).json({ message: 'Erro interno ao atualizar médico' });
  }
};


export const GetDataSintomasAndDoenca = async (res) => {
  try {
    const getDoencas = await models.List.find({});
    const Doencas = getDoencas.map(data => data.DoencasESintomas.map(data => data.Doenca)).flat();
    const Sintomas = getDoencas.map(data => data.DoencasESintomas.map(data => data.Sintomas.map(data => data))).flat(2);
    
    const arr = [...Doencas, ...Sintomas];

    res.status(200).json({ arr });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao obter dados de doenças e sintomas.' });
  }
}



export const VerifyDataPatient = async (body, res) => {
    const { id } = body

    try{

      if(id === ''){
        return res.status(400).json({ message: 'Paciente nao esta logado'})
      }

      const getDataPatient = await models.ModelRegisterPaciente.findById(id)

      if(!getDataPatient){
        return res.status(200).json({ message: 'Paciente Nao esta cadastrado no Interconsulta'})
      }

    const CPFPatient = getDataPatient.CPF
    const Data = getDataPatient.Data
    const Genero = getDataPatient.Genero
    const NomeAcompanhante = getDataPatient.NomeAcompanhante
    const TelefoneAcompanhante =  getDataPatient.TelefoneAcompanhante
    const EmailAcompanhante = getDataPatient.EmailAcompanhante


    if(CPFPatient && Data && Genero && NomeAcompanhante && TelefoneAcompanhante && EmailAcompanhante){
       return res.status(200).json({ valid: true })
    }else{
       return res.json({ valid: false })
    }
    }catch(error){
      console.log(error)
    }
}

export const ValidatorPatientConsulta = async (id, res) => {
  try{
    const getPatient = await models.ModelRegisterPaciente.findById(id)
    const ConsultasSolicitadas = getPatient.ConsultasSolicitadasPacientes

    if(!getPatient){
       return res.status(400).json({ message: 'Paciente nao existe no Interconsulta'})
    }

    res.status(200).json({ ConsultasSolicitadas: ConsultasSolicitadas})
  }catch(error){
    return res.status(500).json({ message: 'Erro ao Validar ao verificar se paciente ja solicitou uma consulta.'})
  }
}