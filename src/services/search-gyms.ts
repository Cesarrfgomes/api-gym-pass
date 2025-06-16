import { Gym } from '@prisma/client'
import { GymsRepository } from '@/repositories/gyms-repository'

interface SearchGymRequest {
	query: string
	page: number
}

interface SearchGymServiceResponse {
	gyms: Gym[]
}

export class SearchGymService {
	constructor(private gymsRepository: GymsRepository) {}

	SearchGymService = async ({
		query,
		page
	}: SearchGymRequest): Promise<SearchGymServiceResponse> => {
		const gyms = await this.gymsRepository.searchMany(query, page)

		return { gyms }
	}
}
