import { randomUUID } from 'node:crypto'
import { FastifyInstance } from 'fastify'
import { extname, resolve } from 'node:path'
import { createWriteStream } from 'node:fs'
import { promisify } from 'node:util'
import { pipeline } from 'node:stream'

const pump = promisify(pipeline)

export async function upload(app: FastifyInstance) {
  app.post('/upload', async (request, reply) => {
    const upload = await request.file({
      limits: {
        fileSize: 5_242_800, // 5mb
      },
    })

    if (!upload) {
      return reply.status(400).send()
    }

    const mimeTypeRegex = /^(image|video)\/[a-zA-z]+/
    const isValidFileFormat = mimeTypeRegex.test(upload.mimetype)

    if (!isValidFileFormat) {
      return reply.status(400).send()
    }

    const fileId = randomUUID()
    const extension = extname(upload.filename)

    const fileName = fileId.concat(extension)

    const writeStream = createWriteStream(
      resolve(__dirname, '../../upload/', fileName),
    )

    await pump(upload.file, writeStream)

    const fullUrl = request.protocol.concat('://').concat(request.hostname)
    const fileUrl = new URL(`/upload/${fileName}`, fullUrl).toString()

    return { fileUrl }
  })
}
