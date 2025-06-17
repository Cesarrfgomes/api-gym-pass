import { makeSearchGymsService } from '@/services/factories/make-search-gyms-service'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export const searchGyms = async (
	request: FastifyRequest,
	reply: FastifyReply
) => {
	const searchGymsParamsSchema = z.object({
		query: z.string(),
		page: z.coerce.number().min(1).default(1)
	})

	const { page, query } = searchGymsParamsSchema.parse(request.query)

	const searchGymsService = makeSearchGymsService()

	const { gyms } = await searchGymsService.SearchGymService({
		query,
		page
	})

	return reply.status(200).send({ gyms })
}
