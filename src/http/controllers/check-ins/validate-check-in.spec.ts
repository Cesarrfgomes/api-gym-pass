import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/create-and-authenticate-user'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { prisma } from '@/lib/prisma'

describe('Validate Check-in (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to validate one check-in', async () => {
		const { token } = await createAndAuthenticateUser()

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

		const checkIn = await prisma.checkIn.create({
			data: {
				gym_id: gym.id,
				user_id: user.id
			}
		})

		const response = await request(app.server)
			.patch(`/check-in/${checkIn.id}/validate`)
			.set('Authorization', `Bearer ${token}`)
			.send()

		expect(response.statusCode).toEqual(204)
	})
})
