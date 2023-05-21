import 'dotenv/config'

import fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import multipart from '@fastify/multipart'

import { memoriesRoutes } from './routes/momories'
import { authRoutes } from './routes/auth'
import { upload } from './routes/upload'
import { resolve } from 'path'

const app = fastify()

app.register(cors, {
  origin: true, // todas URLs de front-end poderao acessar o nosso backend
})
app.register(jwt, {
  secret: 'spacetime',
})
app.register(multipart)
app.register(require('@fastify/static'), {
  root: resolve(__dirname, '../upload'),
  prefix: '/upload',
})

app.register(authRoutes)
app.register(upload)
app.register(memoriesRoutes)

app
  .listen({
    port: 3333,
    host: '0.0.0.0',
  })
  .then(() => {
    console.log('Http server running on port: 3333')
  })
