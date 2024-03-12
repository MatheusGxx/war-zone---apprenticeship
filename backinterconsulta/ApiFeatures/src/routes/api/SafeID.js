import { Router } from 'express'
import { 
   generateChallenge,
   getSafeId, 
   generateToken,
   signatureStart,
   applyStamp,
   signatureFinish
} from '../../services/SafeIdService.js'
import { models } from '../../../MongoDB/Schemas/Schemas.js'
import { fileURLToPath } from 'url';
import { dirname, join } from 'path'
import fs from 'fs'

const router = Router()
const { verifier, challenge } = generateChallenge()

router.get('/authorize-safeid/:id',
    async (req, res) => {

      const url = await getSafeId(challenge)
    
      const { id } = req.params

      const savedURL = new models.SafeID({
        SafeID: [
          {
            link: url,
            idDoctor: id,
          }
        ]
      })
    
      console.log(`Salvando url e ID do médico no banco de dados: ${savedURL}`);

      await savedURL.save()

      return res.json({ url })
})  

router.get('/get-code-safeid', 
     async (req, res) => {

      try{
        
        const { code, state, error } = req.query
        console.log(`Code: ${code}`)

        const lastSavedURL = await models.SafeID.findOne().sort({ _id: -1 });
        console.log(`Salvando code no banco de dados: ${lastSavedURL}`)

        if (!lastSavedURL) {
          return res.status(404).json({ message: 'Nenhum SafeID encontrado' });
        }

        lastSavedURL.SafeID[lastSavedURL.SafeID.length -1].code = code

        const currentFilePath = fileURLToPath(import.meta.url);
        const currentDir = dirname(currentFilePath)
        
        const PDFPath = join(currentDir, '../../..', 'PDFTeste.pdf')
  
        const data = await generateToken(code, verifier, res)
        console.log(data)

        lastSavedURL.SafeID[lastSavedURL.SafeID.length -1].acessToken = data.access_token
        lastSavedURL.SafeID[lastSavedURL.SafeID.length -1].expires_in = data.expires_in
          
        const idSignatureStart = await signatureStart(data.access_token, PDFPath)
        console.log(idSignatureStart)
  
        lastSavedURL.SafeID[lastSavedURL.SafeID.length -1].idSignature= idSignatureStart

        await applyStamp(data.access_token, idSignatureStart)
      
        const PDFAssinado = await signatureFinish(data.access_token, idSignatureStart)

        lastSavedURL.SafeID[lastSavedURL.SafeID.length -1].PDFAssinado = PDFAssinado

        console.log(PDFAssinado)

        const PDFBuffer = Buffer.from(PDFAssinado, 'base64')
        console.log(`PDF em buffer:${PDFBuffer}`)
        
        const currentFilePath2 = fileURLToPath(import.meta.url);
        const currentDir2 = dirname(currentFilePath2)
        
        const PDFPath2 = join(currentDir2, '../../..', 'PDFOriginal.pdf')

        fs.writeFileSync(PDFPath2, PDFBuffer)
        
        console.log(`Arquivo do PDF assinado com certificado digital: ${PDFPath2}`)

        await lastSavedURL.save()
       
      }catch(error){
        return res.status(200).json({ message: 'Erro ao gerar Certificado digital usando a API do SafeID'})
      }  
  })


export default router
