import { Gym } from '@prisma/client'
import { GymsRepository } from '@/repositories/gyms-repository'

interface FetchNearbyGymsRequest {
	userLatitude: number
	userLongitude: number
}

interface FetchNearbyGymsServiceResponse {
	gyms: Gym[]
}

export class FetchNearbyGymsService {
	constructor(private gymsRepository: GymsRepository) {}

	FetchNearbyGymsService = async ({
		userLatitude,
		userLongitude
	}: FetchNearbyGymsRequest): Promise<FetchNearbyGymsServiceResponse> => {
		const gyms = await this.gymsRepository.findManyNearby({
			latitude: userLatitude,
			longitude: userLongitude
		})

		return { gyms }
	}
}
