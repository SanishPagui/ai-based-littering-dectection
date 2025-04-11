import { type NextRequest, NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"
import path from "path"

// Convert exec to Promise-based
const execPromise = promisify(exec)

export async function POST(request: NextRequest) {
  try {
    const { videoPath } = await request.json()

    if (!videoPath) {
      return NextResponse.json({ error: "Video path is required" }, { status: 400 })
    }

    // Sanitize the input to prevent command injection
    // This is a simple example - you may need more robust validation
    if (videoPath.includes(";") || videoPath.includes("&") || videoPath.includes("|")) {
      return NextResponse.json({ error: "Invalid video path" }, { status: 400 })
    }

    // Path to your Python script - adjust as needed
    // This assumes your Python script is in the root of your project
    const pythonScriptPath = path.join(process.cwd(), "scripts", "detector/run.py")

    // Command to execute the Python script with the video path as an argument
    const command = `python detector/run.py`

    // Execute the Python script
    const { stdout, stderr } = await execPromise(command)

    if (stderr) {
      console.error("Python script error:", stderr)
      return NextResponse.json({ error: "Python script execution failed", details: stderr }, { status: 500 })
    }

    return NextResponse.json({ result: stdout })
  } catch (error) {
    console.error("API route error:", error)
    return NextResponse.json({ error: "Failed to run Python script", details: String(error) }, { status: 500 })
  }
}
