import { FastifyInstance } from 'fastify'
import { verifyJWT } from '../middlewares/verify-jwt'
import { createCheckIn } from '../controllers/check-ins/create-check-in'
import { validateCheckIn } from '../controllers/check-ins/validate-check-in'
import { fetchUserCheckInsHistory } from '../controllers/check-ins/fetch-user-check-ins-history'
import { getUserMetrics } from '../controllers/check-ins/get-user-metrics'
import { verifyUserRole } from '../middlewares/verify-user-role'

export const checkInsRoutes = async (app: FastifyInstance) => {
	app.addHook('onRequest', verifyJWT)

	app.get('/check-ins/history', fetchUserCheckInsHistory)
	app.get('/check-ins/metrics', getUserMetrics)

	app.post('/gyms/:gymId/check-ins', createCheckIn)
	app.patch(
		'/check-in/:checkInId/validate',
		{ onRequest: verifyUserRole('ADMIN') },
		validateCheckIn
	)
}
