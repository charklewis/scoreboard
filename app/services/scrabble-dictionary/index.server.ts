import { characterScore } from './character-score'
import { dictionary } from './word-list.server'

function checkWord(value: string) {
  const key = value.trim().toUpperCase()
  const word = dictionary[key as keyof typeof dictionary]
  return word || null
}

function calculateScore(word: string) {
  return word
    .split('')
    .reduce((acc, char) => acc + characterScore[char.toUpperCase() as keyof typeof characterScore], 0)
}

export { checkWord, calculateScore }
