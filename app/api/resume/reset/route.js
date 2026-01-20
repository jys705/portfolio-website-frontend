import { list, del } from '@vercel/blob';
import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';

// 이력서 초기화 (모든 blob 파일 삭제 + MongoDB 설정 제거)
export async function POST() {
  try {
    console.log('[RESET] Starting resume reset...');
    
    // 1. Vercel Blob에서 모든 PDF 파일 삭제
    const { blobs } = await list();
    console.log('[RESET] Found blobs:', blobs.length);
    
    let deletedCount = 0;
    for (const blob of blobs) {
      if (blob.pathname.endsWith('.pdf')) {
        console.log('[RESET] Deleting blob:', blob.pathname);
        await del(blob.url);
        deletedCount++;
      }
    }
    
    console.log('[RESET] Deleted', deletedCount, 'PDF files from Blob');
    
    // 2. MongoDB에서 resumeUrl 설정 제거
    const client = await clientPromise;
    const database = client.db('portfolioDB');
    const settings = database.collection('settings');
    
    await settings.deleteOne({ key: 'resumeUrl' });
    console.log('[RESET] Removed resumeUrl from MongoDB');
    
    return NextResponse.json({
      success: true,
      message: '이력서가 초기화되었습니다.',
      deletedFiles: deletedCount
    });
    
  } catch (error) {
    console.error('[RESET] Error resetting resume:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
