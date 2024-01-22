import { ResumoQueue } from './Queues.js'
import { WhatsappQueue } from './Queues.js'
import { EmailQueue } from './Queues.js'
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter.js'

export const BullBoard = (serverAdapter) => {
  return {
    queues: [
      new BullMQAdapter(ResumoQueue), 
      new BullMQAdapter(WhatsappQueue), 
      new BullMQAdapter(EmailQueue)
    ],
    serverAdapter: serverAdapter,
    options:{
      uiConfig:{
        boardTitle: 'Queues Inter',
      }
    }
  }
}

