import { FastifyInstance } from 'fastify'
import { verifyJWT } from '../middlewares/verify-jwt'
import { searchGyms } from '../controllers/gyms/search-gyms'
import { fetchNearbyGyms } from '../controllers/gyms/fetch-nearby-gyms'
import { createGym } from '../controllers/gyms/create-gym'
import { verifyUserRole } from '../middlewares/verify-user-role'

export const gymsRoutes = async (app: FastifyInstance) => {
	app.addHook('onRequest', verifyJWT)

	app.get('/gyms/search', searchGyms)
	app.get('/gyms/nearby', fetchNearbyGyms)
	app.post('/gyms', { onRequest: [verifyUserRole('ADMIN')] }, createGym)
}
