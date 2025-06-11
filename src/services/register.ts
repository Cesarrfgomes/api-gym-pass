import { UsersRepository } from '@/repositories/users-repository'
import { hash } from 'bcrypt'
import { UserAlreadyExistsError } from './errors/user-alredy-exists'

interface CreateUserDto {
	name: string
	email: string
	password: string
}

export class RegisterUserServices {
	constructor(private usersRepository: UsersRepository) {}

	registerUserService = async ({ name, email, password }: CreateUserDto) => {
		const password_hash = await hash(password, 6)

		const userWithSameEmail = await this.usersRepository.findUserByEmail(
			email
		)

		if (userWithSameEmail) {
			throw new UserAlreadyExistsError()
		}

		await this.usersRepository.create({ name, email, password_hash })
	}
}
