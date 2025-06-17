import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/create-and-authenticate-user'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'

describe('Nearby Gyms (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to fetch nearby gyms', async () => {
		const { token } = await createAndAuthenticateUser()

		await request(app.server)
			.post('/gyms')
			.set('Authorization', `Bearer ${token}`)
			.send({
				title: 'Fit7five',
				description: 'Some description',
				phone: '12345678-043',
				latitude: -12.1875381,
				longitude: -38.9666731
			})

		//-12.1875381 -38.961198

		// latitude: -12.2691398,
		// 		longitude: -38.9598587

		await request(app.server)
			.post('/gyms')
			.set('Authorization', `Bearer ${token}`)
			.send({
				title: 'Sport Health',
				description: 'Some description',
				phone: '1234567-043',
				latitude: -12.2719592,
				longitude: -38.961198
			})

		const response = await request(app.server)
			.get('/gyms/nearby')
			.query({ latitude: -12.2719592, longitude: -38.961198 })
			.set('Authorization', `Bearer ${token}`)
			.send()

		expect(response.statusCode).toEqual(200)
		expect(response.body.gyms).toEqual([
			expect.objectContaining({ title: 'Sport Health' })
		])
	})
})
