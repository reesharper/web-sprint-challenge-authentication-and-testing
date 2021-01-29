// Write your tests here
const request = require('supertest')
const db = require('../data/dbConfig')
const server = require('./server')

const rees = { username: 'rees', password: '1234' }
const chaz = { username: 'chaz', password: '1234' }

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})
beforeEach(async () => {
  await db('users').truncate()
})
afterAll(async () => {
  await db.destroy()
})

test('sanity', () => {
  expect(23).toBe(23)
})

describe('server', () => {
  describe('[POST] /api/auth/register', () => {
    it('responds with the correct status code', async () => { 
      const res = await request(server).post("/api/auth/register").send(rees)
      expect(res.status).toBe(201)
    }, 30000)
    it('responds with the newly created user', async () => {
      let res
      res = await request(server).post("/api/auth/register").send(rees)
      expect(res.body).toMatchObject({ id: 1, username: 'rees', password: res.body.password })

      res = await request(server).post("/api/auth/register").send(chaz)
      expect(res.body).toMatchObject({ id: 2, username: 'chaz', password: res.body.password })
    }, 30000)
  })
  describe('[POST] /api/auth/login', () => {
    it('responds with the correct status code', async () => { 
      await request(server).post("/api/auth/register").send(rees)
      const res = await request(server).post("/api/auth/login").send(rees)
      expect(res.status).toBe(200)
    }, 30000)
    it('responds with the correct message', async () => {
      await request(server).post("/api/auth/register").send(chaz)
      const res = await request(server).post("/api/auth/login").send(chaz)
      expect(res.status).toBe(200)
    }, 30000)
  })
})

