import express from 'express'
import cors from 'cors'
import path from 'path'
import router from './router/router'
import {errorHandler} from './middlewares/errorHandler'

const app = express()

app.use(express.json())
app.use('/files', express.static(path.join(__dirname, 'files')))
console.log(__dirname)
app.use(cors())
app.use('/api', router)
app.use(errorHandler)

export default app
