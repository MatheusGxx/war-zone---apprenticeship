import dotenv from 'dotenv'
dotenv.config()

export default {
    redisRead: {
        host: process.env.redisOn ?? 'localhost', // Usando o nome do serviço do Redis para operações de leitura
        port: 6379
    },
    redisWrite: {
        host: process.env.redisOn ?? 'localhost', // Usando o nome do serviço do Redis para operações de escrita
        port: 6379
    }
}
