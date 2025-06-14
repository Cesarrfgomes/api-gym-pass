import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { AuthenticateService } from '../authenticate'

export function makeAuthenticateUserService() {
	const prismaUsersRepository = new PrismaUsersRepository()
	const authenticateUserService = new AuthenticateService(
		prismaUsersRepository
	)

	return authenticateUserService
}
