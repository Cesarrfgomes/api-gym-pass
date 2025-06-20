import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { CreateGymService } from '../create-gym'

export function makeCreateGymService() {
	const prismaGymsRepository = new PrismaGymsRepository()
	const service = new CreateGymService(prismaGymsRepository)

	return service
}
