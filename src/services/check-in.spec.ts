import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInService } from './check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { MaxDistanceError } from './errors/max-distance-error'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'

let checkInRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInService

describe('Check-in services', () => {
	beforeEach(async () => {
		checkInRepository = new InMemoryCheckInsRepository()
		gymsRepository = new InMemoryGymsRepository()
		sut = new CheckInService(checkInRepository, gymsRepository)

		await gymsRepository.create({
			id: '123456',
			title: 'Fit5Cinco',
			description: 'Academia',
			phone: '',
			latitude: -12.2731597,
			longitude: -38.9545984
		})

		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('should be able create a check in', async () => {
		const { checkIn } = await sut.checkIn({
			userId: 'truvejano@minoxidil.com',
			gymId: '123456',
			userLatitude: -12.2731597,
			userLongitude: -38.9545984
		})

		expect(checkIn.id).toEqual(expect.any(String))
	})

	it('should not be able to check in twice in the same day', async () => {
		vi.setSystemTime(new Date(2024, 0, 20, 5, 0, 0))

		await sut.checkIn({
			userId: 'truvejano@minoxidil.com',
			gymId: '123456',
			userLatitude: -12.2731597,
			userLongitude: -38.9545984
		})

		await expect(() =>
			sut.checkIn({
				userId: 'truvejano@minoxidil.com',
				gymId: '123456',
				userLatitude: -12.2731597,
				userLongitude: -38.9545984
			})
		).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
	})

	it('should be able to check in twice but in different days', async () => {
		vi.setSystemTime(new Date(2024, 0, 20, 8, 0, 0))

		await sut.checkIn({
			userId: 'truvejano@minoxidil.com',
			gymId: '123456',
			userLatitude: -12.2731597,
			userLongitude: -38.9545984
		})

		vi.setSystemTime(new Date(2024, 0, 21, 8, 0, 0))

		const { checkIn } = await sut.checkIn({
			userId: 'truvejano@minoxidil.com',
			gymId: '123456',
			userLatitude: -12.2731597,
			userLongitude: -38.9545984
		})

		expect(checkIn.id).toEqual(expect.any(String))
	})

	it('should not be able to check in on distant gym', async () => {
		//-12.1791548,-38.9446881

		const { id } = await gymsRepository.create({
			title: 'Fit5Cinco',
			description: 'Academia',
			phone: '',
			latitude: -27.0747279,
			longitude: -49.4889672
		})

		await expect(() =>
			sut.checkIn({
				userId: 'truvejano@minoxidil.com',
				gymId: id,
				userLatitude: -12.2731597,
				userLongitude: -38.9545984
			})
		).rejects.toBeInstanceOf(MaxDistanceError)
	})
})
