import nodemailer from 'nodemailer'

const Transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: 'interconsulta.org@gmail.com',
        pass: '@InterConsulta2024',
        clientId: '344062049191-2m2u2nustn7rupk8esk0254fq2f7308i.apps.googleusercontent.com',
        clientSecret: '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',
        refreshToken: '1//04bU8qo3XK1usCgYIARAAGAQSNwF-L9Ir0q5ndBxWicrEOAdbVQ6B9jacyxwxoOoeIuoIv1fAR8gfN5495YE5GKtsYBi_2ndqsrs'
    }
})

export const sendEmail = async (to, subject, message) => {
    const mailOptions = {
        from: 'interconsulta.org@gmail.com',
        to: to,
        subject: subject,
        html: message
    }

    try {
      const info = await Transporter.sendMail(mailOptions);
      console.log(`E-mail enviado com sucesso para: ${info.accepted}`)
    } catch (error) {
        console.error('Erro ao enviar e-mail:', error);
    }
};
