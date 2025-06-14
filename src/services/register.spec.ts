import { beforeEach, describe, expect, it } from 'vitest'
import { RegisterUserServices } from './register'
import { compare } from 'bcrypt'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists'

let usersRepository: InMemoryUsersRepository
let userService: RegisterUserServices

describe('Register use services', () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository()
		userService = new RegisterUserServices(usersRepository)
	})
	it('should be able to register', async () => {
		const { user } = await userService.registerUserService({
			name: 'Cesar',
			email: 'tuvejano1@minoxidil.com',
			password: '123456'
		})

		expect(user.id).toEqual(expect.any(String))
	})

	it('should hash user password upon registration', async () => {
		const { user } = await userService.registerUserService({
			name: 'Cesar',
			email: 'tuvejano1@minoxidil.com',
			password: '123456'
		})

		const isPasswordCorrectlyHashed = await compare(
			'123456',
			user.password_hash
		)

		expect(isPasswordCorrectlyHashed).toBeTruthy()
	})

	it('should not be able to register user with same email twice', async () => {
		const email = 'truvejano@minoxidil.com'

		await userService.registerUserService({
			name: 'Cesar',
			email,
			password: '123456'
		})

		await expect(() =>
			userService.registerUserService({
				name: 'Cesar',
				email,
				password: '123456'
			})
		).rejects.toBeInstanceOf(UserAlreadyExistsError)
	})
})
