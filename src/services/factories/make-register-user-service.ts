import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { RegisterUserServices } from '../register'

export function makeRegisterUserService() {
	const prismaUsersRepository = new PrismaUsersRepository()
	const registerUserService = new RegisterUserServices(prismaUsersRepository)

	return registerUserService
}
