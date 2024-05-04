import { type LoaderFunctionArgs, json } from '@remix-run/node'
import { calculateScore, checkWord } from '~/services/scrabble-dictionary/index.server'

function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const word = url.searchParams.get('word')
  if (!word) return json({ error: 'No word provided' }, { status: 400 })
  const meaning = checkWord(word)
  if (meaning) {
    const score = calculateScore(word)
    return json({ success: true, meaning: meaning, word: word.toUpperCase(), score })
  }
  return json({ success: false, word: word.toUpperCase(), score: 0 })
}

export { loader }
