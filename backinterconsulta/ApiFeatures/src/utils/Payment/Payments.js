import { nanoid } from 'nanoid'

export const Pix = async (Payment,client, ValorConsulta,getPaciente) => {
    try {
      const payment = new Payment(client);
      const paymentMessage = await payment.create({
        body: { 
          transaction_amount: ValorConsulta,
          token: 'APP_USR-1485714438717131-011321-a805841cf5cb2ccf3b83011440e05639-505908896',
          description: `Consulta Médica para o Paciente ${getPaciente.nome}`,
          installments: 1,
          payment_method_id: 'pix',
          payer: {
            email: `${getPaciente.email}`,
            identification: {
              type: `${getPaciente.CPF}`,
              number: `${getPaciente.telefone}`
            }
          }
        },
        requestOptions: { idempotencyKey: nanoid() }
      })
  
      return paymentMessage
    } catch (error) {
      console.error(error)
    }
  }

export const CartãoDeCrédito = async (Payment, client, ValorConsulta, getPaciente, idPayment) =>{
    const payment = new Payment(client)

    const paymentMessage = await payment.create({
      body: { 
          transaction_amount: ValorConsulta,
          token: 'APP_USR-1485714438717131-011321-a805841cf5cb2ccf3b83011440e05639-505908896',
          description: `Consulta Médica para o Paciente ${getPaciente.nome}`,
          installments: 1,
          payment_method_id: idPayment,
              payer: {
              email: `${getPaciente.nome}`,
              identification: {
          type: `${getPaciente.CPF}`,
          number: `${getPaciente.telefone}`
      }}},
      requestOptions: { idempotencyKey: `${getPaciente._id}` }
  })


  return paymentMessage
 
}