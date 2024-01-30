import nodemailer from 'nodemailer'

const Transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: 'interconsulta.org@gmail.com',
        pass: '@InterConsulta2024',
        clientId: '344062049191-m8scc33258dk9j18vct372cgv9o6m40a.apps.googleusercontent.com',
        clientSecret: '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',
        refreshToken: '1//04wlLgCOD6CflCgYIARAAGAQSNwF-L9IrTa-_RI7EGqlFEvBdZiGPxxFd9E4b0B48oHytrHsd1rhyB4Y7-XTLc-P9cbN8NeYlpnE'
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
