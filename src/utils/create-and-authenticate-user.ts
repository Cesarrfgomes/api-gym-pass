import { app } from '@/app'
import request from 'supertest'

export const createAndAuthenticateUser = async () => {
	await request(app.server).post('/users').send({
		name: 'Jhon Doe',
		email: 'truvejano@minoxidil.com',
		password: '123456'
	})

	const authResponse = await request(app.server).post('/sessions').send({
		email: 'truvejano@minoxidil.com',
		password: '123456'
	})

	const { token } = authResponse.body

	return { token }
}
