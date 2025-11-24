import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    // Initialize variables at the top
    let base64Image: string;
    let mimeType: string;
    
    const { imageUrl, prompt } = await request.json();

    if (!imageUrl || !prompt) {
      return NextResponse.json(
        { error: 'Missing imageUrl or prompt' },
        { status: 400 }
      );
    }

    // Initialize Gemini API
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('Missing GEMINI_API_KEY in environment variables');
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    if (imageUrl.startsWith('data:')) {
      // Handle data URL
      const matches = imageUrl.match(/^data:([^;]+);base64,(.+)$/);
      if (!matches) {
        return NextResponse.json(
          { error: 'Invalid data URL format' },
          { status: 400 }
        );
      }
      mimeType = matches[1];
      base64Image = matches[2];
    } else if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      // Handle remote URL
      const imageResponse = await fetch(imageUrl);
      const imageBuffer = await imageResponse.arrayBuffer();
      base64Image = Buffer.from(imageBuffer).toString('base64');
      mimeType = imageUrl.includes('.jpg') || imageUrl.includes('.jpeg') 
        ? 'image/jpeg' 
        : imageUrl.includes('.png') 
        ? 'image/png' 
        : 'image/jpeg';
    } else {
      // Handle local file path (from public directory)
      const filePath = join(process.cwd(), 'public', imageUrl);
      const imageBuffer = await readFile(filePath);
      base64Image = imageBuffer.toString('base64');
      mimeType = imageUrl.includes('.jpg') || imageUrl.includes('.jpeg') 
        ? 'image/jpeg' 
        : imageUrl.includes('.png') 
        ? 'image/png' 
        : 'image/jpeg';
    }

    // Log the request details after image processing
    if (base64Image && mimeType) {
      console.log('Request details:', {
        model: 'gemini-2.5-flash-image',
        prompt,
        imageFormat: mimeType,
        imageSize: base64Image.length
      });
    } else {
      console.error('Image processing failed - no base64Image or mimeType');
      return NextResponse.json(
        { error: 'Failed to process image' },
        { status: 500 }
      );
    }

    // Call Gemini 2.5 Flash Image (Nano Banana) API for image editing
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            role: "user",
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: mimeType,
                  data: base64Image
                }
              }
            ]
          }],
          generationConfig: {
            temperature: 0.7,
            candidateCount: 1,
            maxOutputTokens: 2048
          }
        })
      }
    );

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.text();
      console.error('Gemini API error:', errorData);
      
      // Let's try using the standard Gemini Pro Vision model instead
      console.log('Falling back to Gemini Pro Vision...');
      const visionResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Analyze this image and describe how it would look with the following edit: "${prompt}"`
              }, {
                inlineData: {
                  mimeType: mimeType,
                  data: base64Image
                }
              }]
            }],
            generationConfig: {
              temperature: 0.4,
              candidateCount: 1,
              maxOutputTokens: 2048
            }
          })
        }
      );

      if (!visionResponse.ok) {
        const visionError = await visionResponse.text();
        console.error('Vision API error:', visionError);
        return NextResponse.json(
          { 
            error: 'Failed to process image',
            details: visionError
          },
          { status: 500 }
        );
      }

      const visionData = await visionResponse.json();
      console.log('Vision API response:', visionData);

      // For now, return the original image with the analysis
      return NextResponse.json({
        editedImage: base64Image,
        mimeType: mimeType,
        message: 'Image analyzed successfully',
        analysis: visionData.candidates?.[0]?.content?.parts?.[0]?.text || 'No analysis available'
      });
    }

    const geminiData = await geminiResponse.json();
    console.log('Gemini response structure:', JSON.stringify(geminiData, null, 2));

    // Check if there are candidates
    if (!geminiData.candidates || geminiData.candidates.length === 0) {
      console.error('No candidates in Gemini response, but got usage stats:', geminiData.usageMetadata);
      return NextResponse.json({
        error: 'Gemini did not generate any content',
        details: geminiData
      }, { status: 500 });
    }

    const candidate = geminiData.candidates[0];
    const parts = candidate.content?.parts || [];

    // Look for generated image data
    let generatedImageData = null;
    let textResponse = null;

    for (const part of parts) {
      if (part.inlineData) {
        generatedImageData = part.inlineData;
        console.log('Found generated image data with mime type:', part.inlineData.mimeType);
      }
      if (part.text) {
        textResponse = part.text;
        console.log('Found text response:', part.text);
      }
    }

    if (generatedImageData) {
      // We got a generated image - return it
      return NextResponse.json({
        editedImage: generatedImageData.data,
        mimeType: generatedImageData.mime_type || 'image/png',
        message: 'Image generated successfully by Gemini 2.5 Flash Image',
        analysis: textResponse || 'Image generated based on your prompt'
      });
    } else if (textResponse) {
      // We got text only - return original image with analysis
      return NextResponse.json({
        editedImage: base64Image,
        mimeType: mimeType,
        message: 'Image analyzed by Gemini',
        analysis: textResponse
      });
    }
    
    return NextResponse.json(
      { error: 'No response from Gemini' },
      { status: 500 }
    );

  } catch (error) {
    console.error('Error editing image:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

