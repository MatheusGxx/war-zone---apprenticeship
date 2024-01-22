import express from 'express'
import cors from 'cors'
import db from '../MongoDB/connect.js'
import { createBullBoard } from '@bull-board/api'
import { ExpressAdapter } from '@bull-board/express'
import { BullBoard } from './utils/BullBoard.js'
import routes from './routes/index.js'

const serverAdapter = new ExpressAdapter()
serverAdapter.setBasePath('/admin/queues')
const bullBoardConfig = BullBoard(serverAdapter)
createBullBoard(bullBoardConfig)

const app = express()

app.use('/admin/queues', serverAdapter.getRouter())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
db.connect()
app.use(cors())
app.use(routes)

const PortServer = 8081

app.listen(PortServer, () => console.log(`API de Automaçoes aberta na porta, ${PortServer}`))
