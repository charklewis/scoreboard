import { useEffect, useState } from 'react'

import sound from './alarm.mp3'

const serverMock = { play: () => {}, currentTime: 0, addEventListener: () => {}, removeEventListener: () => {} }

function useAlarm() {
  const [audio] = useState(typeof Audio === 'undefined' ? serverMock : new Audio(sound))

  useEffect(() => {
    let playCount = 0
    const handleEnded = () => {
      playCount += 1
      if (playCount < 2) {
        audio.currentTime = 0
        audio.play()
      }
    }
    audio.addEventListener('ended', handleEnded)
    return () => {
      audio.removeEventListener('ended', handleEnded)
    }
  }, [audio])

  return {
    play: () => {
      audio.play()
    },
  }
}

export { useAlarm }
