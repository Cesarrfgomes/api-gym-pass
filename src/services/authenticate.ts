import { UsersRepository } from '@/repositories/users-repository'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'
import { compare } from 'bcrypt'
import { User } from '@prisma/client'

interface AuthenticateDto {
	email: string
	password: string
}

interface AuthenticateServiceResponse {
	user: User
}
export class AuthenticateService {
	constructor(private usersRepository: UsersRepository) {}

	async auth({
		email,
		password
	}: AuthenticateDto): Promise<AuthenticateServiceResponse> {
		const user = await this.usersRepository.findUserByEmail(email)

		if (!user) {
			throw new InvalidCredentialsError()
		}

		const doesPasswordMatches = await compare(password, user.password_hash)

		if (!doesPasswordMatches) {
			throw new InvalidCredentialsError()
		}

		return { user }
	}
}
