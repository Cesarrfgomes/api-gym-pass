import { Gym } from '@prisma/client'
import { GymsRepository } from '@/repositories/gyms-repository'

interface CreateGymDto {
	title: string
	description: string | null
	phone: string | null
	latitude: number
	longitude: number
}

interface RegisterGymServiceResponse {
	gym: Gym
}

export class CreateGymService {
	constructor(private gymsRepository: GymsRepository) {}

	createGymService = async ({
		title,
		description,
		phone,
		longitude,
		latitude
	}: CreateGymDto): Promise<RegisterGymServiceResponse> => {
		const gym = await this.gymsRepository.create({
			title,
			description,
			phone,
			longitude,
			latitude
		})

		return { gym }
	}
}
