import { UsersRepository } from '@/repositories/users-repository'
import { hash } from 'bcrypt'
import { UserAlreadyExistsError } from './errors/user-already-exists'
import { User } from '@prisma/client'

interface CreateUserDto {
	name: string
	email: string
	password: string
}

interface RegisterUserServiceResponse {
	user: User
}

export class RegisterUserServices {
	constructor(private usersRepository: UsersRepository) {}

	registerUserService = async ({
		name,
		email,
		password
	}: CreateUserDto): Promise<RegisterUserServiceResponse> => {
		const password_hash = await hash(password, 6)

		const userWithSameEmail = await this.usersRepository.findUserByEmail(
			email
		)

		if (userWithSameEmail) {
			throw new UserAlreadyExistsError()
		}

		const user = await this.usersRepository.create({
			name,
			email,
			password_hash
		})

		return { user }
	}
}
