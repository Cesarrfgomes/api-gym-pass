import { Prisma, CheckIn } from '@prisma/client'
import { CheckInRepository } from '../check-ins-repository'
import { randomUUID } from 'node:crypto'
import dayjs from 'dayjs'

export class InMemoryCheckInsRepository implements CheckInRepository {
	public checkIns: CheckIn[] = []

	async findById(id: string): Promise<CheckIn | null> {
		const checkIn = this.checkIns.find(item => item.id === id)

		if (!checkIn) {
			return null
		}

		return checkIn
	}

	async findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
		return this.checkIns
			.filter(item => item.user_id === userId)
			.slice((page - 1) * 20, page * 20)
	}

	async countByUserId(userId: string): Promise<number> {
		return this.checkIns.filter(item => item.user_id === userId).length
	}

	async findByUserIdOnDate(
		userId: string,
		date: Date
	): Promise<CheckIn | null> {
		const startOfTheDay = dayjs(date).startOf('date')
		const endOfTheDay = dayjs(date).endOf('date')

		const checkInOnSameDate = this.checkIns.find(item => {
			const checkInDate = dayjs(item.created_at)

			const isOnSameDate =
				checkInDate.isAfter(startOfTheDay) &&
				checkInDate.isBefore(endOfTheDay)

			return item.user_id === userId && isOnSameDate
		})

		if (!checkInOnSameDate) {
			return null
		}
		return checkInOnSameDate
	}

	async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
		const checkIn = {
			id: randomUUID(),
			user_id: data.user_id,
			gym_id: data.gym_id,
			validated_at: data.validated_at
				? new Date(data.validated_at)
				: null,
			created_at: new Date()
		}

		this.checkIns.push(checkIn)

		return checkIn
	}

	async save(checkIn: CheckIn): Promise<CheckIn> {
		const checkInIndex = this.checkIns.findIndex(
			item => item.id === checkIn.id
		)

		if (checkInIndex >= 0) {
			this.checkIns[checkInIndex] = checkIn
		}

		return checkIn
	}
}
