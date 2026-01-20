import { put } from '@vercel/blob';
import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';

// 이력서 업로드
export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // 파일 타입 검증
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { success: false, error: 'Only PDF files are allowed' },
        { status: 400 }
      );
    }

    // 파일 크기 제한 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'File size must be less than 10MB' },
        { status: 400 }
      );
    }

    console.log('[POST] Uploading resume to Vercel Blob...');
    
    // Vercel Blob에 업로드
    const blob = await put(`resume-${Date.now()}.pdf`, file, {
      access: 'public',
      addRandomSuffix: false,
    });

    console.log('[POST] Resume uploaded to Blob:', blob.url);

    // MongoDB에 URL 저장
    const client = await clientPromise;
    const database = client.db('portfolioDB');
    const settings = database.collection('settings');

    await settings.updateOne(
      { key: 'resumeUrl' },
      { 
        $set: { 
          key: 'resumeUrl', 
          url: blob.url,
          filename: file.name,
          uploadedAt: new Date(),
          size: file.size
        } 
      },
      { upsert: true }
    );

    console.log('[POST] Resume URL saved to MongoDB');

    return NextResponse.json({
      success: true,
      message: '이력서가 업로드되었습니다.',
      url: blob.url,
      filename: file.name
    });

  } catch (error) {
    console.error('[POST] Error uploading resume:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// 이력서 URL 조회
export async function GET() {
  try {
    const client = await clientPromise;
    const database = client.db('portfolioDB');
    const settings = database.collection('settings');

    const resumeSetting = await settings.findOne({ key: 'resumeUrl' });

    if (!resumeSetting || !resumeSetting.url) {
      // 기본 이력서 경로 반환
      return NextResponse.json({
        success: true,
        url: '/정연승_이력서.pdf',
        filename: '정연승_이력서.pdf',
        isDefault: true
      });
    }

    return NextResponse.json({
      success: true,
      url: resumeSetting.url,
      filename: resumeSetting.filename || '이력서.pdf',
      uploadedAt: resumeSetting.uploadedAt,
      isDefault: false
    });

  } catch (error) {
    console.error('[GET] Error fetching resume:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
