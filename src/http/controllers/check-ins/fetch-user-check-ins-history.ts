import { makeFetchCheckInHistoryService } from '@/services/factories/make-fetch-user-check-in-history-service'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export const fetchUserCheckInsHistory = async (
	request: FastifyRequest,
	reply: FastifyReply
) => {
	const userCheckInHistoryQuerySchema = z.object({
		page: z.coerce.number().min(1).default(1)
	})

	const { page } = userCheckInHistoryQuerySchema.parse(request.query)

	const fetchUserCheckIn = makeFetchCheckInHistoryService()

	const { checkIns } = await fetchUserCheckIn.execute({
		page,
		userId: request.user.sub
	})

	return reply.status(200).send({ checkIns })
}
