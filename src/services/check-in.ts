import { UsersRepository } from '@/repositories/users-repository'
import { CheckIn } from '@prisma/client'
import { NotFoundUser } from './errors/user-not-found'
import { CheckInRepository } from '@/repositories/check-ins-repository'
import { GymsRepository } from '@/repositories/gyms-repository'
import { NotFoundGym } from './errors/gym-not-found'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'
import { MaxDistanceError } from './errors/max-distance-error'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'

interface CheckInRequest {
	userId: string
	gymId: string
	userLatitude: number
	userLongitude: number
}

interface CheckInServiceResponse {
	checkIn: CheckIn
}

export class CheckInService {
	constructor(
		private checkInsRepository: CheckInRepository,
		private gymsRepository: GymsRepository
	) {}

	async checkIn({
		userId,
		gymId,
		userLatitude,
		userLongitude
	}: CheckInRequest): Promise<CheckInServiceResponse> {
		const gym = await this.gymsRepository.findById(gymId)

		if (!gym) {
			throw new NotFoundGym()
		}

		const distance = getDistanceBetweenCoordinates(
			{
				latitude: userLatitude,
				longitude: userLongitude
			},
			{
				latitude: gym.latitude.toNumber(),
				longitude: gym.longitude.toNumber()
			}
		)

		console.log(distance)

		const MAX_DISTANCE_IN_KILOMETERS = 0.1

		if (distance > MAX_DISTANCE_IN_KILOMETERS) {
			throw new MaxDistanceError()
		}

		const checkInOnSameDate =
			await this.checkInsRepository.findByUserIdOnDate(userId, new Date())

		if (checkInOnSameDate) {
			throw new MaxNumberOfCheckInsError()
		}

		const checkIn = await this.checkInsRepository.create({
			gym_id: gymId,
			user_id: userId
		})

		return { checkIn }
	}
}
