import fastify from 'fastify'
import { usersRoutes } from './http/routes/users'
import fastifyCookie from '@fastify/cookie'
import { ZodError } from 'zod/v4'
import { env } from './env'
import fastifyJwt from '@fastify/jwt'
import { gymsRoutes } from './http/routes/gyms'
import { checkInsRoutes } from './http/routes/check-ins'

export const app = fastify()

app.register(fastifyCookie)

app.register(fastifyJwt, {
	secret: env.JWT_SECRET,
	cookie: {
		cookieName: 'refreshToken',
		signed: false
	},
	sign: {
		expiresIn: '10m'
	}
})

app.register(usersRoutes)
app.register(gymsRoutes)
app.register(checkInsRoutes)

app.setErrorHandler((error, _, reply) => {
	if (error instanceof ZodError) {
		return reply.status(400).send({
			message: 'Validation error:',
			issues: error.format()
		})
	}

	if (env.NODE_NEV !== 'production') {
		console.error(error)
	} else {
		// TODO: Here we should log to an external tool like DataDog/NewRelic/Sentry
	}

	return reply.status(500).send({ message: 'Internal server error.' })
})
