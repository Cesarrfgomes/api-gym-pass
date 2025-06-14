import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { AuthenticateService } from '@/services/authenticate'
import { InvalidCredentialsError } from '@/services/errors/invalid-credentials-error'
import { makeAuthenticateUserService } from '@/services/factories/make-authenticate-user-service'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export const authenticate = async (
	request: FastifyRequest,
	reply: FastifyReply
) => {
	const authenticateBodySchema = z.object({
		email: z.string().email(),
		password: z.string()
	})

	const { email, password } = authenticateBodySchema.parse(request.body)

	try {
		const authenticateService = makeAuthenticateUserService()

		await authenticateService.auth({
			email,
			password
		})
	} catch (err) {
		if (err instanceof InvalidCredentialsError) {
			return reply.status(400).send({ message: err.message })
		}

		throw err
	}

	return reply.status(200).send()
}
