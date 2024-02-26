import nodemailer from 'nodemailer'
import { promisify } from 'util';
import fs from 'fs'
import { fileURLToPath } from 'url';
import { dirname, join } from 'path'

const readFileAsync = promisify(fs.readFile);

const Transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: 'interconsulta.org@gmail.com',
        pass: '@InterConsulta2024',
        clientId: '344062049191-2m2u2nustn7rupk8esk0254fq2f7308i.apps.googleusercontent.com',
        clientSecret: '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',
        refreshToken: '1//043kChSbRis2JCgYIARAAGAQSNwF-L9Ir5MxAnx6V4893yqE8JC8QrwzGMEKGGopfhQZ8L41F1XyYlO9WNqeLpLnc76DtCrVJ400'
    }
})

export const sendEmail = async (to, subject, message) => {
    const mailOptions = {
        from: 'interconsulta.org@gmail.com',
        to: to,
        subject: subject,
        attachments: []
    }

    try {
      const info = await Transporter.sendMail(mailOptions);
      console.log(`E-mail enviado com sucesso para: ${info.accepted}`)
    } catch (error) {
        console.error('Erro ao enviar e-mail:', error);
    }
};



export const sendDocumentsinEmail = async (to, subject, Documents) => {
    const mailOptions = {
        from: 'interconsulta.org@gmail.com',
        to: to,
        subject: subject,
        attachments: []
    }
    try {
        const currentFilePath = fileURLToPath(import.meta.url)
        const currentDir = dirname(currentFilePath)
        const PathSignature = join(currentDir, '../../..', 'SignedDocuments')

        const Files = Documents.map((data) => {
            const getPaths = join(PathSignature, data)
            return getPaths
        });

        const fileReadPromises = Files.map(async documentPath => {
            try {
                const documentContent = await readFileAsync(documentPath); // Use await para esperar pela leitura do arquivo
                return {
                    filename: documentPath.split('\\').pop(),
                    content: documentContent
                }
            } catch (error) {
                console.error('Erro ao ler arquivo:', error);
                throw error; // Rejeitar a Promise se ocorrer um erro na leitura do arquivo
            }
        });
        
        mailOptions.attachments = await Promise.all(fileReadPromises);
        const info = await Transporter.sendMail(mailOptions)
        console.log(`Email enviado com sucesso para: ${info.accepted}`);
    } catch(error) {
        console.error(error);
    }
}