"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, Play, AlertCircle } from "lucide-react"

export default function PythonRunner() {
  const [videoPath, setVideoPath] = useState("videos/tester3.mp4")
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const runPythonScript = async () => {
    setLoading(true)
    setResult(null)
    setError(null)

    try {
      const response = await fetch("/api/run-python", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ videoPath }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to run Python script")
      }

      setResult(data.result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Python Script Runner</CardTitle>
          <CardDescription>Run your Python script with a video file path parameter</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result && (
            <Alert>
              <AlertTitle>Python Script Output</AlertTitle>
              <AlertDescription className="whitespace-pre-wrap">{result}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={runPythonScript} disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Running Python Script...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Run Python Script
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
