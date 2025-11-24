/**
 * Extract frames from a video file or URL
 * @param videoSource - Video URL or File object
 * @param numFrames - Number of frames to extract (default: 3)
 * @returns Array of base64 encoded images
 */
export async function extractFramesFromVideo(
  videoSource: string | File,
  numFrames: number = 3
): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.crossOrigin = 'anonymous'
    video.muted = true
    video.playsInline = true

    // Handle video source
    if (typeof videoSource === 'string') {
      video.src = videoSource
    } else {
      video.src = URL.createObjectURL(videoSource)
    }

    const frames: string[] = []
    let currentFrame = 0

    video.addEventListener('loadedmetadata', () => {
      const duration = video.duration

      // Take frames from 1/4 and 3/4 points in the video
      const frameTimes = numFrames === 2
        ? [duration * 0.25, duration * 0.75] // Quarter and three-quarter points
        : Array.from({ length: numFrames }, (_, i) => (i + 1) * duration / (numFrames + 1)) // Evenly distributed

      const captureFrame = () => {
        if (currentFrame >= numFrames) {
          // Clean up
          if (typeof videoSource !== 'string') {
            URL.revokeObjectURL(video.src)
          }
          resolve(frames)
          return
        }

        // Seek to the next frame position
        const time = frameTimes[currentFrame]
        video.currentTime = time
      }

      video.addEventListener('seeked', () => {
        try {
          // Create canvas and extract frame
          const canvas = document.createElement('canvas')
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight
          const ctx = canvas.getContext('2d')

          if (!ctx) {
            reject(new Error('Failed to get canvas context'))
            return
          }

          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

          // Convert to base64
          const base64Frame = canvas.toDataURL('image/jpeg', 0.8).split(',')[1]
          frames.push(base64Frame)

          console.log(`Extracted frame ${currentFrame + 1}/${numFrames} at time ${video.currentTime.toFixed(2)}s (${base64Frame.length} chars)`)

          currentFrame++
          captureFrame()
        } catch (error) {
          reject(error)
        }
      })

      captureFrame()
    })

    video.addEventListener('error', (e) => {
      reject(new Error('Failed to load video'))
    })

    // Start loading the video
    video.load()
  })
}

/**
 * Check if a URL or path is a video file
 */
export function isVideoUrl(url: string): boolean {
  return /\.(mp4|webm|mov|avi)$/i.test(url)
}
