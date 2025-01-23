"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

export default function Home() {
  const [prompt, setPrompt] = useState("")
  const [sent, setSent] = useState(false)

  useEffect(() => {
    // Add dark class to html element
    document.documentElement.classList.add("dark")
    return () => {
      // Remove dark class when component unmounts
      document.documentElement.classList.remove("dark")
    }
  }, [])

  const handleSend = () => {
    if (prompt.trim()) {
      setSent(true)
      setTimeout(() => setSent(false), 3000) // Hide the message after 3 seconds
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-900 text-gray-100">
      <h1 className="text-3xl font-bold mb-8 text-blue-400">Universal Message Service</h1>
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardContent className="pt-6">
          <Input
            type="text"
            placeholder="Enter your prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={handleSend} className="bg-blue-600 hover:bg-blue-700">
            Send
          </Button>
          {sent && <p className="text-green-400">This has been sent!</p>}
        </CardFooter>
      </Card>
    </main>
  )
}

