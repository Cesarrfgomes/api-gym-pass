import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/create-and-authenticate-user'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { prisma } from '@/lib/prisma'

describe('Check-in history (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to fetch user check-ins history list', async () => {
		const { token } = await createAndAuthenticateUser(app, true)

		const user = await prisma.user.findFirstOrThrow()

		const gym = await prisma.gym.create({
			data: {
				title: 'Fit7five',
				description: 'Some description',
				phone: '12345678-043',
				latitude: -12.2718048,
				longitude: -38.96098
			}
		})

		await prisma.checkIn.createMany({
			data: [
				{
					gym_id: gym.id,
					user_id: user.id
				},
				{
					gym_id: gym.id,
					user_id: user.id
				}
			]
		})

		const response = await request(app.server)
			.get(`/check-ins/history`)
			.set('Authorization', `Bearer ${token}`)
			.send()

		expect(response.statusCode).toEqual(200)
	})
})
