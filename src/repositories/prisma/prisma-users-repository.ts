import { prisma } from '@/lib/prisma'
import { Prisma, User } from '@prisma/client'
import { UsersRepository } from '../users-repository'

export class PrismaUsersRepository implements UsersRepository {
	async findUserById(id: string): Promise<User | null> {
		const user = await prisma.user.findUnique({ where: { id } })

		return user
	}
	async findUserByEmail(email: string): Promise<User | null> {
		const user = await prisma.user.findUnique({
			where: { email }
		})

		return user
	}

	async create(data: Prisma.UserCreateInput): Promise<User> {
		const user = await prisma.user.create({
			data
		})

		return user
	}
}
