import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { RegisterUserServices } from '@/services/register'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { UserAlreadyExistsError } from '@/services/errors/user-alredy-exists'

export const registerUser = async (
	request: FastifyRequest,
	reply: FastifyReply
) => {
	const registerUserBodySchema = z.object({
		name: z.string(),
		email: z.string().email(),
		password: z.string().min(6)
	})

	const { name, email, password } = registerUserBodySchema.parse(request.body)

	try {
		const prismaUsersRepository = new PrismaUsersRepository()
		const registerUserService = new RegisterUserServices(
			prismaUsersRepository
		)
		await registerUserService.registerUserService({
			name,
			email,
			password
		})
	} catch (err) {
		if (err instanceof UserAlreadyExistsError) {
			return reply.status(409).send({ message: err.message })
		}

		throw err
	}

	return reply.status(201).send()
}
