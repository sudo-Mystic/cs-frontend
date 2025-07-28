"use client"

import { useState, useEffect } from "react"

interface TypingEffectProps {
  words: string[]
  className?: string
}

export function TypingEffect({ words, className = "" }: TypingEffectProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [currentText, setCurrentText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    const currentWord = words[currentWordIndex]

    const timeout = setTimeout(
      () => {
        if (isPaused) {
          setIsPaused(false)
          setIsDeleting(true)
          return
        }

        if (isDeleting) {
          if (currentText === "") {
            setIsDeleting(false)
            setCurrentWordIndex((prev) => (prev + 1) % words.length)
          } else {
            setCurrentText(currentWord.substring(0, currentText.length - 1))
          }
        } else {
          if (currentText === currentWord) {
            setIsPaused(true)
          } else {
            setCurrentText(currentWord.substring(0, currentText.length + 1))
          }
        }
      },
      isPaused ? 2500 : isDeleting ? 80 : 120,
    )

    return () => clearTimeout(timeout)
  }, [currentText, currentWordIndex, isDeleting, isPaused, words])

  return (
    <span className={className}>
      {currentText}
      <span className="animate-pulse text-cloudseals-yellow ml-1">|</span>
    </span>
  )
}
