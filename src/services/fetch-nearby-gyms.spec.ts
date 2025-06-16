import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { FetchNearbyGymsService } from './fetch-nearby-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsService

describe('Fetch nearby gyms services', () => {
	beforeEach(async () => {
		gymsRepository = new InMemoryGymsRepository()
		sut = new FetchNearbyGymsService(gymsRepository)
	})

	it('should be able to search for gyms', async () => {
		await gymsRepository.create({
			title: 'Near Gym',
			description: 'Academia',
			phone: '',
			latitude: -12.2692816,
			longitude: -38.9595612
		})

		await gymsRepository.create({
			title: 'Far Gym',
			description: 'Academia',
			phone: '',
			latitude: -27.0747279,
			longitude: -49.4889672
		})

		const { gyms } = await sut.FetchNearbyGymsService({
			userLatitude: -12.271485,
			userLongitude: -38.9613354
		})

		expect(gyms).toHaveLength(1)
		expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })])
	})
})
