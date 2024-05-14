import { type Mock, describe, expect, test, vi } from 'vitest'
import { faker } from '@faker-js/faker'
import { loader } from '~/routes/scrabble'
import { calculateScore, checkWord } from '~/services/scrabble-dictionary/index.server'
import { createRequest } from '~/test-utils'

vi.mock('~/services/scrabble-dictionary/index.server', () => ({
  calculateScore: vi.fn(),
  checkWord: vi.fn(),
}))

const CalculateScoreMock = calculateScore as Mock
const CheckWordMock = checkWord as Mock

describe('loader', () => {
  test('returns that a word is in the dictionary', async () => {
    const word = faker.lorem.word()
    const meaning = faker.lorem.sentence()
    const score = faker.number.int()
    const body = new URLSearchParams({ word })
    CheckWordMock.mockReturnValue(meaning)
    CalculateScoreMock.mockReturnValue(score)

    const request = createRequest({ pathname: `?${body.toString()}` })
    const response = await loader(request).json()

    expect(response.success).toBe(true)
    expect(response.meaning).toBe(meaning)
    expect(response.word).toBe(word.toUpperCase())
    expect(response.score).toBe(score)
  })

  test('returns that a word is not in the dictionary', async () => {
    const word = faker.lorem.word()
    const body = new URLSearchParams({ word })
    CheckWordMock.mockReturnValue(null)

    const request = createRequest({ pathname: `?${body.toString()}` })
    const response = await loader(request).json()

    expect(response.success).toBe(false)
    expect(response.meaning).toBe('')
    expect(response.word).toBe(word.toUpperCase())
    expect(response.score).toBe(0)
  })

  test('returns an empty response if no word is provided', async () => {
    const request = createRequest()
    const response = await loader(request).json()

    expect(response.success).toBe(false)
    expect(response.meaning).toBe('')
    expect(response.word).toBe('')
    expect(response.score).toBe(0)
  })
})
