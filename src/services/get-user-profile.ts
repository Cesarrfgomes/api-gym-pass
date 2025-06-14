import { UsersRepository } from '@/repositories/users-repository'
import { User } from '@prisma/client'
import { NotFoundUser } from './errors/user-not-found'

interface GetUserProfileRequest {
	userId: string
}

interface GetUserProfileServiceResponse {
	user: User
}
export class GetUserProfileService {
	constructor(private usersRepository: UsersRepository) {}

	async getUserProfile({
		userId
	}: GetUserProfileRequest): Promise<GetUserProfileServiceResponse> {
		const user = await this.usersRepository.findUserById(userId)

		if (!user) {
			throw new NotFoundUser()
		}

		return { user }
	}
}
