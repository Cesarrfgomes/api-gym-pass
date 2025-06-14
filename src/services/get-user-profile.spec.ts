import { beforeEach, describe, expect, it } from 'vitest'
import { hash } from 'bcrypt'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { GetUserProfileService } from './get-user-profile'
import { NotFoundUser } from './errors/user-not-found'

let usersRepository: InMemoryUsersRepository
let userService: GetUserProfileService

describe('Get user profile service', () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository()
		userService = new GetUserProfileService(usersRepository)
	})

	it('should bu able to get a user profile', async () => {
		const createdUser = await usersRepository.create({
			id: 'userid',
			name: 'Cesar',
			email: 'truvejano@minoxidil.com',
			password_hash: await hash('123456', 6)
		})

		const { user } = await userService.getUserProfile({
			userId: createdUser.id
		})

		expect(user).toEqual(createdUser)
	})

	it('should not be able to get a user profile with wrong id', async () => {
		await usersRepository.create({
			name: 'Cesar',
			email: 'truvejano@minoxidil.com',
			password_hash: await hash('123456', 6)
		})

		await expect(() =>
			userService.getUserProfile({ userId: 'userid' })
		).rejects.instanceOf(NotFoundUser)
	})
})
