import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { frames, prompt, companyName } = body;

    if (!frames || !Array.isArray(frames) || frames.length === 0) {
      return NextResponse.json(
        { error: 'Missing or invalid frames array' },
        { status: 400 }
      );
    }

    if (!prompt) {
      return NextResponse.json(
        { error: 'Missing prompt' },
        { status: 400 }
      );
    }

    console.log('=== VIDEO EDIT REQUEST ===');
    console.log('Number of frames received:', frames.length);
    console.log('Prompt:', prompt);
    console.log('Company:', companyName);

    if (frames.length < 2) {
      return NextResponse.json(
        { error: 'At least 2 frames (first and last) are required' },
        { status: 400 }
      );
    }

    // Use first and last frames for Veo image-to-video generation
    const firstFrame = frames[0];
    const lastFrame = frames[frames.length - 1];

    console.log('First frame size:', firstFrame.length, 'chars');
    console.log('Last frame size:', lastFrame.length, 'chars');
    console.log('First frame preview:', firstFrame.substring(0, 50) + '...');
    console.log('Last frame preview:', lastFrame.substring(0, 50) + '...');

    const projectId = process.env.GCP_PROJECT_ID;
    const accessToken = process.env.GCP_ACCESS_TOKEN;

    if (!projectId || !accessToken) {
      throw new Error('GCP_PROJECT_ID and GCP_ACCESS_TOKEN required for Veo video generation');
    }

    // Construct the full prompt with company name context
    const fullPrompt = companyName
      ? ` Create a 4-second advertisement video for the Brand: ${companyName} , and include details/instructions  from the following prompt by a user who wants to edit/recreate the ad : ${prompt}.`
      : `${prompt}. Create a 4-second advertisement video.`;

    console.log('Generating video with Veo 3.1 from first and last frames...');
    console.log('Full prompt:', fullPrompt);

    // Call Vertex AI Veo endpoint
    const generateResponse = await fetch(
      `https://us-central1-aiplatform.googleapis.com/v1/projects/${projectId}/locations/us-central1/publishers/google/models/veo-3.1-generate-preview:predictLongRunning`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          instances: [{
            prompt: fullPrompt,
            image: {
              bytesBase64Encoded: firstFrame,
              mimeType: 'image/jpeg'
            },
            lastFrame: {
              bytesBase64Encoded: lastFrame,
              mimeType: 'image/jpeg'
            }
          }],
          parameters: {
            sampleCount: 1,
            durationSeconds: 4, // Veo 3 only supports 4, 6, or 8 seconds
            generateAudio: false, // Required for Veo 3
            resolution: "720p" // 720p or 1080p (Veo 3 only)
          }
        })
      }
    );

    if (!generateResponse.ok) {
      const errorText = await generateResponse.text();
      console.error('Vertex AI error response:', errorText);
      throw new Error(`Vertex AI error (${generateResponse.status}): ${errorText}`);
    }

    const operationData = await generateResponse.json();
    console.log('=== OPERATION STARTED ===');
    console.log('Operation name:', operationData.name);
    console.log('Operation keys:', Object.keys(operationData));

    const operationName = operationData.name;
    if (!operationName) {
      throw new Error('No operation name returned');
    }

    // Poll for completion (max 10 minutes)
    console.log('Polling for video generation completion...');
    let completed = false;
    let videoData;

    for (let i = 0; i < 60; i++) {
      await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds

      // Extract operation ID from the full operation name
      const operationId = operationName.split('/').pop();

      const statusResponse = await fetch(
        `https://us-central1-aiplatform.googleapis.com/v1/projects/${projectId}/locations/us-central1/publishers/google/models/veo-3.1-generate-preview:fetchPredictOperation`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            operationName: operationName
          })
        }
      );

      if (!statusResponse.ok) {
        console.error('Status check failed:', await statusResponse.text());
        continue;
      }

      videoData = await statusResponse.json();
      console.log(`Poll ${i + 1}/60 - Status:`, videoData.done ? 'Done' : 'In progress');

      if (videoData.done) {
        completed = true;
        break;
      }
    }

    if (!completed) {
      throw new Error('Video generation timed out after 10 minutes');
    }

    // Extract video from response
    console.log('=== RESPONSE DEBUGGING ===');
    console.log('Top level keys:', Object.keys(videoData));

    // Helper function to recursively find base64 data
    function findBase64Data(obj: any, path = ''): string | null {
      if (typeof obj === 'string' && obj.length > 1000) {
        // Likely base64 data (long string)
        console.log(`Found large string at: ${path}`);
        return obj;
      }
      if (typeof obj === 'object' && obj !== null) {
        for (const key in obj) {
          const result = findBase64Data(obj[key], path ? `${path}.${key}` : key);
          if (result) return result;
        }
      }
      return null;
    }

    let videoBytesBase64;
    let videoGcsUri;

    // Try all possible paths
    const possiblePaths = [
      { path: 'response.candidates[0].content.parts[0].inlineData.data', value: videoData.response?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data },
      { path: 'response.candidates[0].content.parts[0].inlineData', value: videoData.response?.candidates?.[0]?.content?.parts?.[0]?.inlineData },
      { path: 'response.candidates[0].content.parts[0]', value: videoData.response?.candidates?.[0]?.content?.parts?.[0] },
      { path: 'response.videos[0].gcsUri', value: videoData.response?.videos?.[0]?.gcsUri },
      { path: 'response.predictions[0].bytesBase64Encoded', value: videoData.response?.predictions?.[0]?.bytesBase64Encoded },
    ];

    console.log('Checking possible paths:');
    possiblePaths.forEach(({ path, value }) => {
      if (value !== undefined && value !== null) {
        console.log(`✓ ${path}:`, typeof value, typeof value === 'object' ? Object.keys(value) : `length=${String(value).length}`);
      }
    });

    // Veo 3 response structure - base64 inline data
    if (videoData.response?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data) {
      videoBytesBase64 = videoData.response.candidates[0].content.parts[0].inlineData.data;
      console.log('✓ Found video at: response.candidates[0].content.parts[0].inlineData.data');
    }
    // Veo 3 response structure - Cloud Storage URI
    else if (videoData.response?.videos?.[0]?.gcsUri) {
      videoGcsUri = videoData.response.videos[0].gcsUri;
      console.log('✓ Found video at: response.videos[0].gcsUri');
      throw new Error('Cloud Storage URIs not supported yet. Please configure to return inline bytes.');
    }
    // Fallback: recursively search for base64 data
    else {
      console.log('Standard paths failed, searching recursively...');
      videoBytesBase64 = findBase64Data(videoData);
      if (videoBytesBase64) {
        console.log('✓ Found video data via recursive search');
      }
    }

    if (!videoBytesBase64 && !videoGcsUri) {
      console.error('=== FAILED TO EXTRACT VIDEO ===');
      console.error('Full response (first 2000 chars):', JSON.stringify(videoData, null, 2).substring(0, 2000));
      throw new Error('No video bytes or GCS URI in response');
    }

    console.log('Video data length:', videoBytesBase64?.length || 0);

    console.log('Video generated successfully');

    return NextResponse.json({
      success: true,
      editedVideo: videoBytesBase64,
      mimeType: 'video/mp4'
    });

  } catch (error) {
    console.error('Error in edit-video API:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate video',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
