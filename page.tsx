"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Loader2, AlertCircle } from "lucide-react"

interface ApiResponse {
  code: string
  demo: string
}

export default function Home() {
  const [prompt, setPrompt] = useState("")
  const [sent, setSent] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editPrompt, setEditPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    document.documentElement.classList.add("dark")
    return () => {
      document.documentElement.classList.remove("dark")
    }
  }, [])

  const handleSend = () => {
    if (prompt.trim()) {
      setSent(true)
      setTimeout(() => setSent(false), 3000)
    }
  }

  const handleEditSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)
    setError(null)
    setApiResponse(null)

    try {
      const response = await fetch("/api/edit-layout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: editPrompt }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`)
      }

      if (!data.code || !data.demo) {
        throw new Error("Invalid API response format")
      }

      setApiResponse(data as ApiResponse)
    } catch (err) {
      console.error("Error:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")

      if (err instanceof Error && err.message.includes("Failed to generate UI")) {
        setError(
          "The AI was unable to generate a UI based on your request. Please try rephrasing your prompt or providing more details.",
        )
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-900 text-gray-100">
      <div className="mb-8 bg-white rounded-full p-4 inline-block">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/company-logo-transparent-Fhy4Ib55elqZWdqN5eJSZOvWd11umy.png"
          alt="Company Logo"
          width={100}
          height={100}
          priority
          className="w-24 h-24 object-contain"
        />
      </div>
      <h1 className="text-3xl font-bold mb-8 text-blue-400">Universal Message Service</h1>
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardContent className="pt-6">
          <Input
            type="text"
            placeholder="Enter your message here"
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

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogTrigger asChild>
          <Button className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700">Edit Layout with v0</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px] w-11/12 max-h-[80vh] overflow-y-auto bg-gray-800 text-gray-100">
          <DialogHeader>
            <DialogTitle>Edit Layout</DialogTitle>
            <DialogDescription>What would you like to change?</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-2">
              <Textarea
                id="edit-prompt"
                placeholder="Describe your changes here"
                value={editPrompt}
                onChange={(e) => setEditPrompt(e.target.value)}
                className="min-h-[100px] bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
              />
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </DialogFooter>
          </form>
          {error && (
            <div className="flex items-start space-x-2 text-red-500 mt-4 text-sm bg-red-100 dark:bg-red-900 p-3 rounded-md">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              <p className="break-words">{error}</p>
            </div>
          )}
          {apiResponse && (
            <div className="mt-4 space-y-4 text-sm">
              <h3 className="font-semibold">Click on the buttons below to review your changes:</h3>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto">
                  <a href={apiResponse.demo} target="_blank" rel="noopener noreferrer">
                    Demo URL
                  </a>
                </Button>
                <Button asChild className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto">
                  <a href={apiResponse.code} target="_blank" rel="noopener noreferrer">
                    Demo Code
                  </a>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  )
}

