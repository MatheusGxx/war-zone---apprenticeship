import nodemailer from 'nodemailer'
import { promisify } from 'util';
import fs from 'fs'
import { fileURLToPath } from 'url';
import { dirname, join } from 'path'
import { models } from '../../../MongoDB/Schemas/Schemas.js';
const readFileAsync = promisify(fs.readFile);

const Transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: 'interconsulta.org@gmail.com',
        pass: '@InterConsulta2024',
        clientId: '344062049191-2m2u2nustn7rupk8esk0254fq2f7308i.apps.googleusercontent.com',
        clientSecret: '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',
        refreshToken: '1//04f_NsWBQLOjTCgYIARAAGAQSNwF-L9IrlHVXcKL87AXZVoytuC7KLSpmZTDKafDyqpPzjqkpwR2L9Qd_bibNB5SGltJNVL-5jMw'
    }
})

export const sendEmail = async (to, subject, message) => {
    const mailOptions = {
        from: 'interconsulta.org@gmail.com',
        to: to,
        subject: subject,
        html: message,
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

        const Files = Documents.map((data) => {
            const getPaths = join(currentDir, '../../..', data)
            return getPaths
        });

        const fileReadPromises = Files.map(async documentPath => {
            try {
                const documentContent = await readFileAsync(documentPath);
                return {
                    filename: documentPath.split('\\').pop(),
                    content: documentContent
              
