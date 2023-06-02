const request = require('supertest')

const baseUrl = 'http://localhost:3000'

describe('POST /api/wills/create', () => {
  it('should create a new will', async () => {
    const user = {
      email: 'gusfring@gmail.com',
    }

    // Will data
    const will = {
      owner: user,
    }

    // Make request to create a will
    const response = await request(baseUrl).post('/api/wills/create').send(will)
    expect(response.body).toEqual({
      will: {
        owner: {
          email: 'gusfring@gmail.com',
        },
      },
    })
  })
})
