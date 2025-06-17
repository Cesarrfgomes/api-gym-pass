import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { SearchGymService } from '../search-gyms'

export function makeSearchGymsService() {
	const prismaGymsRepository = new PrismaGymsRepository()
	const service = new SearchGymService(prismaGymsRepository)

	return service
}
