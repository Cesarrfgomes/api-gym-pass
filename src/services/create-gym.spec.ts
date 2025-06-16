import { beforeEach, describe, expect, it } from 'vitest'
import { RegisterUserServices } from './register'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { CreateGymService } from './create-gym'

let gymsRepository: InMemoryGymsRepository
let gymsService: CreateGymService

describe('Create gym service', () => {
	beforeEach(() => {
		gymsRepository = new InMemoryGymsRepository()
		gymsService = new CreateGymService(gymsRepository)
	})
	it('should be able to create a gym', async () => {
		const { gym } = await gymsService.createGymService({
			title: 'Fit5Cinco',
			description: 'Academia',
			phone: '',
			latitude: -27.0747279,
			longitude: -49.4889672
		})

		expect(gym.id).toEqual(expect.any(String))
	})
})
