import http from 'http'
import app from './app/index.js'
import dotenv from 'dotenv'
dotenv.config()

const httpServer = http.createServer(app)
const PORT = process.env.PORT || 5000

httpServer.listen(PORT, () => {
  console.log('Server listening', PORT)
})