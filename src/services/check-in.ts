import { UsersRepository } from '@/repositories/users-repository'
import { CheckIn } from '@prisma/client'
import { NotFoundUser } from './errors/user-not-found'
import { CheckInRepository } from '@/repositories/check-ins-repository'

interface CheckInRequest {
	userId: string
	gymId: string
}

interface CheckInServiceResponse {
	checkIn: CheckIn
}

export class CheckInService {
	constructor(private checkInsRepository: CheckInRepository) {}

	async checkIn({
		userId,
		gymId
	}: CheckInRequest): Promise<CheckInServiceResponse> {
		const checkInOnSameDate =
			await this.checkInsRepository.findByUserIdOnDate(userId, new Date())

		console.log(checkInOnSameDate)

		if (checkInOnSameDate) {
			throw new Error('')
		}

		const checkIn = await this.checkInsRepository.create({
			gym_id: gymId,
			user_id: userId
		})

		console.log(checkIn)

		return { checkIn }
	}
}
