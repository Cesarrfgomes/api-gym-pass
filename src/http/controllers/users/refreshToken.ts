import { FastifyReply, FastifyRequest } from 'fastify'

export const refreshToken = async (
	request: FastifyRequest,
	reply: FastifyReply
) => {
	await request.jwtVerify({ onlyCookie: true })

	const { role } = request.user

	const token = await reply.jwtSign(
		{ role },
		{
			sign: {
				sub: request.user.sub
			}
		}
	)

	const refreshToken = await reply.jwtSign(
		{ role },
		{
			sign: {
				sub: request.user.sub,
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
}
