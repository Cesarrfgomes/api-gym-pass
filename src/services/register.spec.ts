import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { describe, expect, it } from 'vitest'
import { RegisterUserServices } from './register'
import { compare } from 'bcrypt'

describe('Register use services', () => {
	it('should hash user password upon registration', async () => {
		const prismaUserRepository = new PrismaUsersRepository()
		const userService = new RegisterUserServices(prismaUserRepository)

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
})
