import { beforeEach, describe, expect, it } from 'vitest'
import { hash } from 'bcrypt'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateService } from './authenticate'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateService

describe('Authenticate services', () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository()
		sut = new AuthenticateService(usersRepository)
	})
	it('should be able to authenticate', async () => {
		await usersRepository.create({
			name: 'Cesar',
			email: 'truvejano@minoxidil.com',
			password_hash: await hash('123456', 6)
		})

		const { user } = await sut.auth({
			email: 'truvejano@minoxidil.com',
			password: '123456'
		})

		expect(user.id).toEqual(expect.any(String))
	})

	it('should not be able to authenticate', async () => {
		await expect(
			sut.auth({
				email: 'truvejano@minoxidil.com',
				password: '123456'
			})
		).rejects.instanceOf(InvalidCredentialsError)
	})

	it('should not be able to authenticate with wrong password', async () => {
		await usersRepository.create({
			name: 'Cesar',
			email: 'truvejano@minoxidil.com',
			password_hash: await hash('123456', 6)
		})

		await expect(
			sut.auth({
				email: 'truvejano@minoxidil.com',
				password: '12342ssss56'
			})
		).rejects.instanceOf(InvalidCredentialsError)
	})
})
