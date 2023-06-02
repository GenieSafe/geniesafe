import { User, Will } from '@prisma/client'

const request = require('supertest')

const baseUrl = 'http://localhost:3000'

describe('POST /api/wills/create', () => {
  it('should create a new will', async () => {
    const owner: User = {
      id: 0,
      email: 'gusfring@gmail.com',
      password: '123',
      walletAddress: null,
    }

    // Will data
    const will: Will = {
      ownerId: owner.id,
      id: 0,
      activated: false,
      validated: false,
      deployedAt: null,
      deployedAtBlock: null,
      createdAt: null,
      updatedAt: null,
    }

    // Make request to create a will
    const response = await request(baseUrl).post('/api/wills/create').send(will)
    expect(response.body).toEqual({
      will: will,
    })
  })
})
