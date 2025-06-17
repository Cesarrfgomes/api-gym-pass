import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins.repository'
import { FetchUserCheckInsHistoryService } from '../fetch-user-check-ins-history'

export function makeFetchCheckInHistoryService() {
	const prismaCheckInsRepository = new PrismaCheckInsRepository()
	const service = new FetchUserCheckInsHistoryService(
		prismaCheckInsRepository
	)

	return service
}
