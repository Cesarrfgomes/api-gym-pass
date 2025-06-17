import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins.repository'
import { GetUserMetricsService } from '../get-user-metrics'

export function makeGetUserMetricsService() {
	const prismaCheckInsRepository = new PrismaCheckInsRepository()
	const service = new GetUserMetricsService(prismaCheckInsRepository)

	return service
}
