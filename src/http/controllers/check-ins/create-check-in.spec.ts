import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/create-and-authenticate-user'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { prisma } from '@/lib/prisma'

describe('Create Check-in (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to create one check-in', async () => {
		const { token } = await createAndAuthenticateUser(app)

		const gym = await prisma.gym.create({
			data: {
				title: 'Fit7five',
				description: 'Some description',
				phone: '12345678-043',
				latitude: -12.2718048,
				longitude: -38.96098
			}
		})

		const response = await request(app.server)
			.post(`/gyms/${gym.id}/check-ins`)
			.set('Authorization', `Bearer ${token}`)
			.send({
				latitude: -12.2715191,
				longitude: -38.9611181
			})
		expect(response.statusCode).toEqual(201)
	})
})
