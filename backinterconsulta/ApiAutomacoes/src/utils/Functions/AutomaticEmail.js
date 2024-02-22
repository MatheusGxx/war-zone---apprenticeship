import nodemailer from 'nodemailer'

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
        html: message
    }

    try {
      const info = await Transporter.sendMail(mailOptions);
      console.log(`E-mail enviado com sucesso para: ${info.accepted}`)
    } catch (error) {
        console.error('Erro ao enviar e-mail:', error);
    }
};
