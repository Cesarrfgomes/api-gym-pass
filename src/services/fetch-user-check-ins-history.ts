import { CheckInRepository } from '@/repositories/check-ins-repository'
import { CheckIn } from '@prisma/client'

interface FetchUserCheckInsHistoryRequest {
	userId: string
	page: number
}

interface FetchUserCheckInsHistoryResponse {
	checkIns: CheckIn[]
}

export class FetchUserCheckInsHistoryService {
	constructor(private checkInsRepository: CheckInRepository) {}

	async execute({
		userId,
		page
	}: FetchUserCheckInsHistoryRequest): Promise<FetchUserCheckInsHistoryResponse> {
		const checkIns = await this.checkInsRepository.findManyByUserId(
			userId,
			page
		)

		return { checkIns }
	}
}
