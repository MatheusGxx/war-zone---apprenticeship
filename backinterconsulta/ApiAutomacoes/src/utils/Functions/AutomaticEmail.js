import nodemailer from 'nodemailer'
import { promisify } from 'util';
import fs from 'fs'
import { fileURLToPath } from 'url';
import { dirname, join } from 'path'
import { models } from '../../../MongoDB/Schemas/Schemas.js';
const readFileAsync = promisify(fs.readFile)

const Transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: 'interconsulta.org@gmail.com',
        pass: '@InterConsulta2024',
        clientId: '344062049191-2m2u2nustn7rupk8esk0254fq2f7308i.apps.googleusercontent.com',
        clientSecret: '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',
        refreshToken: '1//04kNWv2suyP9aCgYIARAAGAQSNwF-L9IrSoesGygr9i4MRKgA9cl94tGjDji5VJeYOjwKq7abG50LOixOVkgH3CiJ5Pn6u4ZG_D4'
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


export const BulkMessageEmailPatientPublic = async (dataPatient, NomeUnidade,) => {

    const delay = 1000

    await Promise.all(
        dataPatient.map(async (data, index) => {
            await new Promise((resolve, reject) => {
                setTimeout(async () => {
                    try {
                        const mailOptions = {
                            from: 'interconsulta.org@gmail.com',
                            to: data.Email,
                            subject: `${NomeUnidade} Informa`,
                            html: `<p>${data.NomePaciente},\n\n🌷 A Secretaria de Saúde ${NomeUnidade} tem uma novidade especial para você! Estamos em busca de um especialista em ${data.Especialidade} para cuidar do seu bem-estar com todo carinho. 🩹</p>`

                        };
                        await Transporter.sendMail(mailOptions);
                        console.log(`Email enviado para ${data.NomePaciente}`);
                        resolve();
                    } catch (error) {
                        console.error(`Erro ao enviar email para ${data.NomePaciente}: `, error);
                        reject(error);
                    }
                }, index * delay);
            });
        })
    );
};


export const BulkMessageEmailPatientPublicConfirmation = async (consultas, NomeUnidade, EndereçoUnidade) => {

    const delay = 1000

    await Promise.all(
        consultas.map(async (data, index) => {
            await new Promise((resolve, reject) => {
                setTimeout(async () => {
                    try {
                        const mailOptions = {
                            from: 'interconsulta.org@gmail.com',
                            to: data.EmailSolicitante,
                            subject: `${data.Solicitante}, Parabens o ${NomeUnidade} conseguiu uma consulta para voce!`,
                            html: `<p>🌟 Olá ${data.Solicitante}!\n\nA Secretaria de Saúde ${NomeUnidade} do município tem uma notícia especial para você! Sua consulta está agendada com ${data.Solicitado}, especialista em ${data.EspecialidadeSolicitado}, no dia ${data.Data} às ${data.Inicio}. Sua presença é fundamental! Estamos trabalhando arduamente para atender a todos os cidadãos. Seja consciente, não falte, ou se necessário, cancele com antecedência. Lembre-se, outros pacientes também aguardam por atendimento. 🌷\n\nEntre Nesse Link agora para confirmar a sua consulta: https://interconsulta.org/accept-medical?response=${encodeURIComponent(data.NomeUnidadeSolicitante)}&namePatient=${encodeURIComponent(data.Solicitante)}&date=${encodeURIComponent(data.Data)}&start=${encodeURIComponent(data.Inicio)}&upload=${encodeURIComponent(data.FotoUnidadeSolicitante)}&id=${encodeURIComponent(data._id)}
                            `
                        }
                        await Transporter.sendMail(mailOptions);
                        console.log(`Email enviado para ${data.Solicitante}`);
                        resolve();
                    } catch (error) {
                        console.error(`Erro ao enviar email para ${data.Solicitante}`, error);
                        reject(error);
                    }
                }, index * delay)
            })
        })
    )
}

export const BulkMessageEmailDoctorPublicConfirmation = async (body) => {
    const { IDSMedicos, NomeUnidade, } = body
    
    const getDoctors = await models.ModelRegisterMédico.find({ _id: { $in: IDSMedicos }})

    const DataDoctors = getDoctors.map((data) => ({
     Email: data.email,
     NomeEspecialista: data.NomeEspecialista
   }))

   const delay = 1000

    await Promise.all(
     DataDoctors.map(async (data, index) => {
         await new Promise((resolve, reject) => {
             setTimeout(async () => {
                 try {
                     const mailOptions = {
                         from: 'interconsulta.org@gmail.com',
                         to: data.Email,
                         subject: `${data.NomeEspecialista}, voce tem um Aviso do ${NomeUnidade}`,
                         html: `<p>${data.NomeEspecialista}, Tem paciente novo do ${NomeUnidade} na sua Agenda! </p>`
                     };
                     await Transporter.sendMail(mailOptions);
                     console.log(`Email enviado para ${data.NomeEspecialista}`);
                     resolve();
                 } catch (error) {
                     console.error(`Erro ao enviar email para ${data.NomeEspecialista}: `, error);
                     reject(error);
                 }
             }, index * delay)
         })
     })
 )
}