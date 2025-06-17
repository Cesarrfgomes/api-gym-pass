import { FastifyReply, FastifyRequest } from 'fastify'
import { makeCheckInService } from '@/services/factories/make-check-in-service'
import { z } from 'zod'
import { makeValidateCheckInService } from '@/services/factories/make-validate-check-in-service'

export const validateCheckIn = async (
	request: FastifyRequest,
	reply: FastifyReply
) => {
	const validateCheckInParamsSchema = z.object({
		checkInId: z.string().uuid()
	})

	const { checkInId } = validateCheckInParamsSchema.parse(request.params)

	const validateCheckInService = makeValidateCheckInService()

	await validateCheckInService.checkIn({
		checkInId
	})

	return reply.status(204).send()
}
