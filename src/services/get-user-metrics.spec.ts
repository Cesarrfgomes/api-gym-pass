import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { GetUserMetricsService } from './get-user-metrics'

let checkInRepository: InMemoryCheckInsRepository
let sut: GetUserMetricsService

describe('Get user metrics services', () => {
	beforeEach(async () => {
		checkInRepository = new InMemoryCheckInsRepository()
		sut = new GetUserMetricsService(checkInRepository)
	})

	it('should be able to get check-ins count from metrics', async () => {
		await checkInRepository.create({
			gym_id: 'gym-01',
			user_id: 'user-01'
		})

		await checkInRepository.create({
			gym_id: 'gym-02',
			user_id: 'user-01'
		})

		const { checkInsCount } = await sut.execute({
			userId: 'user-01'
		})

		console.log(checkInsCount)

		expect(checkInsCount).toEqual(2)
	})
})
