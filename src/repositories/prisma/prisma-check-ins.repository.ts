import { CheckIn, Prisma } from '@prisma/client'
import { CheckInRepository } from '../check-ins-repository'
import { prisma } from '@/lib/prisma'
import dayjs from 'dayjs'

export class PrismaCheckInsRepository implements CheckInRepository {
	async findByUserIdOnDate(
		userId: string,
		date: Date
	): Promise<CheckIn | null> {
		const startOfTheDay = dayjs(date).startOf('date')
		const endOfTheDay = dayjs(date).endOf('date')

		const checkIn = await prisma.checkIn.findFirst({
			where: {
				user_id: userId,
				created_at: {
					gte: startOfTheDay.toDate(),
					lte: endOfTheDay.toDate()
				}
			}
		})

		return checkIn
	}
	async findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
		const checkIns = await prisma.checkIn.findMany({
			where: { user_id: userId },
			take: 20,
			skip: (page - 1) * 20
		})

		return checkIns
	}
	async findById(id: string): Promise<CheckIn | null> {
		const checkIn = await prisma.checkIn.findUnique({ where: { id } })

		if (!checkIn) {
			return null
		}

		return checkIn
	}

	async countByUserId(userId: string): Promise<number> {
		const count = await prisma.checkIn.count({ where: { user_id: userId } })

		return count
	}
	async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
		const checkIn = await prisma.checkIn.create({ data })

		return checkIn
	}
	async save(data: CheckIn): Promise<CheckIn> {
		const checkIn = await prisma.checkIn.update({
			where: { id: data.id },
			data
		})

		return checkIn
	}
}
