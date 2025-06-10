import { FastifyInstance } from 'fastify'
import { registerUser } from '../controllers/register'

export const usersRoutes = async (app: FastifyInstance) => {
	app.post('/users', registerUser)
}
