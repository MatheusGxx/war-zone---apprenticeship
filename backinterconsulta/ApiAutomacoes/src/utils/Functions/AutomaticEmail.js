import nodemailer from 'nodemailer'

const Transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: 'interconsulta.org@gmail.com',
        pass: '@InterConsulta2024',
        clientId: '344062049191-7okfjjoeq54l8k8ekv0e4lleb75muv31.apps.googleusercontent.com',
        clientSecret: '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',
        refreshToken: '1//04mpC4q1QMJvtCgYIARAAGAQSNwF-L9Ir6DoMY6BXsBFaKsjQ-YugmG3fazaFOsdCoFKYDMLgzeqiHGuFDZZi87vFJRkIKCEf_bs'
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
