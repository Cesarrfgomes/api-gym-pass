import { FastifyInstance } from 'fastify'
import { registerUser } from '../controllers/users/register'
import { authenticate } from '../controllers/users/authenticate'
import { profile } from '../controllers/users/profile'
import { verifyJWT } from '../middlewares/verify-jwt'
import { refreshToken } from '../controllers/users/refreshToken'

export const usersRoutes = async (app: FastifyInstance) => {
	app.post('/users', registerUser)
	app.post('/sessions', authenticate)

	app.patch('/token/refresh', refreshToken)

	app.get('/me', { onRequest: [verifyJWT] }, profile)
}
