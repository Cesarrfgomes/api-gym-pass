import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInService } from './check-in'

let checkInRepository: InMemoryCheckInsRepository
let sut: CheckInService

describe('Check-in services', () => {
	beforeEach(() => {
		checkInRepository = new InMemoryCheckInsRepository()
		sut = new CheckInService(checkInRepository)

		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it.skip('should be able create a check in', async () => {
		const { checkIn } = await sut.checkIn({
			userId: 'truvejano@minoxidil.com',
			gymId: '123456'
		})

		expect(checkIn.id).toEqual(expect.any(String))
	})

	it('should not be able to check in twice in the same day', async () => {
		vi.setSystemTime(new Date(2024, 0, 20, 8, 0, 0))

		await sut.checkIn({
			userId: 'truvejano@minoxidil.com',
			gymId: '123456'
		})

		await expect(() =>
			sut.checkIn({
				userId: 'truvejano@minoxidil.com',
				gymId: '123456'
			})
		).rejects.toBeInstanceOf(Error)
	})

	it.skip('should be able to check in twice but in different days', async () => {
		vi.setSystemTime(new Date(2024, 0, 20, 8, 0, 0))

		await sut.checkIn({
			userId: 'truvejano@minoxidil.com',
			gymId: '123456'
		})

		vi.setSystemTime(new Date(2024, 0, 21, 8, 0, 0))

		const { checkIn } = await sut.checkIn({
			userId: 'truvejano@minoxidil.com',
			gymId: '123456'
		})

		expect(checkIn.id).toEqual(expect.any(String))
	})
})
