import { type LoaderFunctionArgs, json } from '@remix-run/node'

import { calculateScore, checkWord } from '~/services/scrabble-dictionary/index.server'

function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const word = url.searchParams.get('word')
  if (!word) return json({ success: false, word: '', score: 0, meaning: '' })
  const meaning = checkWord(word)
  if (!meaning) return json({ success: false, word: word.toUpperCase(), score: 0, meaning: '' })
  const score = calculateScore(word)
  return json({ success: true, meaning, word: word.toUpperCase(), score })
}

export { loader }
