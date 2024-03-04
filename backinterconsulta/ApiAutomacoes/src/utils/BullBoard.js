import { ResumoQueue } from './Queues.js'
import { WhatsappQueue } from './Queues.js'
import { EmailQueue } from './Queues.js'
import { SendDocumentsQueue } from './Queues.js'
import { ProcessPlanilhaQueue } from './Queues.js'
import { ProcessConsolidadoQueue } from './Queues.js'
import { BulkMessageQueueWarn } from './Queues.js'
import { BulkMessageQueueConfirmation }  from './Queues.js'
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter.js'

export const BullBoard = (serverAdapter) => {
  return {
    queues: [
      new BullMQAdapter(ResumoQueue), 
      new BullMQAdapter(WhatsappQueue), 
      new BullMQAdapter(EmailQueue),
      new BullMQAdapter(SendDocumentsQueue),
      new BullMQAdapter(ProcessPlanilhaQueue), 
      new BullMQAdapter(ProcessConsolidadoQueue),
      new BullMQAdapter(BulkMessageQueueWarn),
      new BullMQAdapter(BulkMessageQueueConfirmation)
    ],
    serverAdapter: serverAdapter,
    options:{
      uiConfig:{
        boardTitle: 'Queues Inter',
      }
    }
  }
}

