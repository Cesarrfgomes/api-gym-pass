import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { ValidateCheckInService } from './validate-check-in'
import { NotFoundCheckIn } from './errors/check-in-not-found-error'
import { LateCheckInValidationError } from './errors/late-check-in-validation-error'

let checkInsRepository: InMemoryCheckInsRepository
let sut: ValidateCheckInService

describe('Validate check-in services', () => {
	beforeEach(async () => {
		checkInsRepository = new InMemoryCheckInsRepository()
		sut = new ValidateCheckInService(checkInsRepository)

		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('should be able validate the check-in', async () => {
		const createdCheckIn = await checkInsRepository.create({
			gym_id: 'gym-01',
			user_id: 'user-01'
		})

		const { checkIn } = await sut.checkIn({ checkInId: createdCheckIn.id })

		expect(checkIn.validated_at).toEqual(expect.any(Date))
		expect(checkInsRepository.checkIns[0].validated_at).toEqual(
			expect.any(Date)
		)
	})

	it('should not be able to validate inexistent check-in', async () => {
		await expect(() => sut.checkIn({ checkInId: '12' })).rejects.instanceOf(
			NotFoundCheckIn
		)
	})

	it('should not be able to validate check-in after 20 minutes of its creation', async () => {
		vi.setSystemTime(new Date(2025, 0, 1, 19, 40))

		const createdCheckIn = await checkInsRepository.create({
			gym_id: 'gym-01',
			user_id: 'user-01'
		})

		const twentyOneMinutesInMs = 1000 * 60 * 21

		vi.advanceTimersByTime(twentyOneMinutesInMs)

		await expect(() =>
			sut.checkIn({ checkInId: createdCheckIn.id })
		).rejects.instanceOf(LateCheckInValidationError)
	})
})
