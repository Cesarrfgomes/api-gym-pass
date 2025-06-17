import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { UserAlreadyExistsError } from '@/services/errors/user-already-exists'
import { makeRegisterUserService } from '@/services/factories/make-register-user-service'
import { makeCreateGymService } from '@/services/factories/make-create-gym-service'

export const createGym = async (
	request: FastifyRequest,
	reply: FastifyReply
) => {
	const createGymBodySchema = z.object({
		title: z.string(),
		description: z.string().nullable(),
		phone: z.string().nullable(),
		latitude: z.number().refine(value => {
			return Math.abs(value) <= 90
		}),
		longitude: z.number().refine(value => {
			return Math.abs(value) <= 180
		})
	})

	const { title, description, phone, latitude, longitude } =
		createGymBodySchema.parse(request.body)

	const createGym = makeCreateGymService()

	await createGym.createGymService({
		title,
		description,
		phone,
		latitude,
		longitude
	})

	return reply.status(201).send()
}
