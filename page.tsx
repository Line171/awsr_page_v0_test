"use client"

import { Inter } from "next/font/google"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Lambda Function Caller with GitHub Source",
  description: "A simple app to call AWS Lambda function using a source file from GitHub",
}

export default function Home() {
  const [prompt, setPrompt] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [response, setResponse] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const callLambda = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt")
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/hello", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, imageUrl: imageUrl.trim() || undefined }),
      })
      if (!res.ok) {
        throw new Error("Failed to call Lambda function")
      }
      const data = await res.json()
      setResponse(data)
    } catch (err) {
      setError("Error calling Lambda function")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
          <h1 className="text-3xl font-bold mb-8">Lambda Function Caller with GitHub Source</h1>
          <p className="mb-4 text-center">This app uses a source file from a GitHub repository.</p>
          <div className="w-full max-w-md mb-4 space-y-2">
            <Input
              type="text"
              placeholder="Enter your prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Enter image URL (optional)"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
            <Button onClick={callLambda} disabled={isLoading} className="w-full">
              {isLoading ? "Calling API..." : "Call API"}
            </Button>
          </div>
          {error && (
            <div className="mt-4 p-4 bg-red-100 text-red-700 rounded shadow w-full max-w-md">
              <h2 className="text-xl font-semibold mb-2">Error:</h2>
              <p>{error}</p>
            </div>
          )}
          {response && (
            <div className="mt-4 p-4 bg-white rounded shadow w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">API Response:</h2>

              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Code:</h3>
                <a
                  href={response.code}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline break-all"
                >
                  {response.code}
                </a>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Demo:</h3>
                <a
                  href={response.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline break-all"
                >
                  {response.demo}
                </a>
              </div>
            </div>
          )}
        </div>
      </body>
    </html>
  )
}

