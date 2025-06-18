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

		const { user } = await authenticateService.auth({
			email,
			password
		})

		const token = await reply.jwtSign(
			{
				role: user.role
			},
			{
				sign: {
					sub: user.id
				}
			}
		)

		const refreshToken = await reply.jwtSign(
			{
				role: user.role
			},
			{
				sign: {
					sub: user.id,
					expiresIn: '7d'
				}
			}
		)

		return reply
			.setCookie('refreshToken', refreshToken, {
				path: '/',
				secure: true,
				sameSite: true,
				httpOnly: true
			})
			.status(200)
			.send({ token })
	} catch (err) {
		if (err instanceof InvalidCredentialsError) {
			return reply.status(400).send({ message: err.message })
		}

		throw err
	}
}
