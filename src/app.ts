import fastify from 'fastify'
import { z } from 'zod'
import { prisma } from './lib/prisma'
import { usersRoutes } from './http/routes/users'

export const app = fastify()

app.register(usersRoutes)
