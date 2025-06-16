import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { SearchGymService } from './search-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymService

describe('Search gyms services', () => {
	beforeEach(async () => {
		gymsRepository = new InMemoryGymsRepository()
		sut = new SearchGymService(gymsRepository)
	})

	it('should be able to search for gyms', async () => {
		await gymsRepository.create({
			title: 'Sport health Gym',
			description: 'Academia',
			phone: '',
			latitude: -27.1747279,
			longitude: -49.4889672
		})

		await gymsRepository.create({
			title: 'Fit7five',
			description: 'Academia',
			phone: '',
			latitude: -27.0747279,
			longitude: -49.4889672
		})

		const { gyms } = await sut.SearchGymService({
			query: 'Fit7five',
			page: 1
		})

		expect(gyms).toHaveLength(1)
	})

	it('should be able to fetch paginated gyms search', async () => {
		for (let i = 0; i < 45; i++) {
			await gymsRepository.create({
				title: `Fit7five ${i}`,
				description: 'Academia',
				phone: '',
				latitude: -27.1747279,
				longitude: -49.4889672
			})
		}

		const { gyms } = await sut.SearchGymService({
			query: 'Fit7five',
			page: 3
		})

		expect(gyms).toHaveLength(5)
	})
})
