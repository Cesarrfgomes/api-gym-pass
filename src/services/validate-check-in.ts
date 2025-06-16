import { CheckIn } from '@prisma/client'
import { CheckInRepository } from '@/repositories/check-ins-repository'
import { NotFoundCheckIn } from './errors/check-in-not-found-error'
import { LateCheckInValidationError } from './errors/late-check-in-validation-error'
import dayjs from 'dayjs'

interface ValidateCheckInRequest {
	checkInId: string
}

interface ValidateCheckInServiceResponse {
	checkIn: CheckIn
}

export class ValidateCheckInService {
	constructor(private checkInsRepository: CheckInRepository) {}

	async checkIn({
		checkInId
	}: ValidateCheckInRequest): Promise<ValidateCheckInServiceResponse> {
		const checkIn = await this.checkInsRepository.findById(checkInId)

		if (!checkIn) {
			throw new NotFoundCheckIn()
		}

		const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
			checkIn.created_at,
			'minutes'
		)

		if (distanceInMinutesFromCheckInCreation > 20) {
			throw new LateCheckInValidationError()
		}

		checkIn.validated_at = new Date()

		await this.checkInsRepository.save(checkIn)

		return { checkIn }
	}
}
