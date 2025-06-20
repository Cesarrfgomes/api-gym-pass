import { Prisma, User } from '@prisma/client'
import { UsersRepository } from '../users-repository'

export class InMemoryUsersRepository implements UsersRepository {
	public users: User[] = []

	async findUserById(id: string): Promise<User | null> {
		const user = this.users.find(user => {
			return user.id === id
		})

		if (!user) {
			return null
		}

		return user
	}

	async findUserByEmail(email: string): Promise<User | null> {
		const user = this.users.find(user => {
			return user.email === email
		})

		if (!user) {
			return null
		}

		return user
	}

	async create(data: Prisma.UserCreateInput): Promise<User> {
		const user = {
			id: 'user-1',
			name: data.name,
			email: data.email,
			password_hash: data.password_hash,
			created_at: new Date()
		}

		this.users.push(user)

		return user
	}
}
