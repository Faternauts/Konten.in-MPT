import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const brand = formData.get('brand') as string;
    const title = formData.get('title') as string;
    const location = formData.get('location') as string;
    const category = formData.get('category') as string;
    const companyId = formData.get('companyId') as string;

    if (!file || !brand || !title || !location || !category || !companyId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate file type
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    
    if (!isImage && !isVideo) {
      return NextResponse.json(
        { error: 'Only image and video files are allowed' },
        { status: 400 }
      );
    }

    // Upload to Supabase Storage
    const fileType = isVideo ? 'video' : 'image';
    const fileExt = file.name.split('.').pop();
    const fileName = `${randomUUID()}.${fileExt}`;
    const filePath = `${fileType}s/${fileName}`;

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Supabase Storage
    console.log('Attempting to upload to Supabase storage:', { filePath, fileType });
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('ads')
      .upload(filePath, buffer, {
        contentType: file.type,
        cacheControl: '3600'
      });

    if (uploadError) {
      console.error('Error uploading to Supabase storage:', {
        message: uploadError.message,
        error: uploadError,
        filePath
      });
      
      // Fallback: return a placeholder URL so the ad can still be saved
      // For now, we'll save to localStorage and later upload to storage
      return NextResponse.json({
        success: true,
        filename: URL.createObjectURL(file), // Temporary object URL
        brand,
        title,
        location,
        category,
        isVideo: isVideo,
        fileType: file.type,
        storageFailed: true
      });
    }

    console.log('Upload successful:', uploadData);

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('ads')
      .getPublicUrl(filePath);

    console.log('Public URL:', publicUrl);

    return NextResponse.json({
      success: true,
      filename: publicUrl,
      brand,
      title,
      location,
      category,
      isVideo: isVideo,
      fileType: file.type
    });

  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
