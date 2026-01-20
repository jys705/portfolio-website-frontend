import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    console.log('[GET] Starting profileSettings request...');
    const client = await clientPromise;
    console.log('[GET] MongoDB client connected');
    
    const database = client.db('admin');
    const settings = database.collection('settings');
    
    const profileSetting = await settings.findOne({ key: 'profileImage' });
    console.log('[GET] Profile setting found:', profileSetting);
    
    return Response.json({ 
      success: true, 
      profileImage: profileSetting?.value || 'profile-img2.jpg' 
    });
  } catch (error) {
    console.error('[GET] Error fetching profile settings:', error);
    console.error('[GET] Error stack:', error.stack);
    return Response.json({ 
      success: false, 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    console.log('[POST] Starting profileSettings request...');
    
    const body = await request.json();
    console.log('[POST] Request body:', body);
    
    const { profileImage } = body;
    
    if (!profileImage) {
      console.error('[POST] No profileImage in request body');
      return Response.json({ 
        success: false, 
        error: 'profileImage is required' 
      }, { status: 400 });
    }
    
    console.log('[POST] Connecting to MongoDB...');
    const client = await clientPromise;
    console.log('[POST] MongoDB client connected');
    
    const database = client.db('admin');
    const settings = database.collection('settings');
    
    console.log('[POST] Updating settings with profileImage:', profileImage);
    const result = await settings.updateOne(
      { key: 'profileImage' },
      { $set: { key: 'profileImage', value: profileImage, updatedAt: new Date() } },
      { upsert: true }
    );
    
    console.log('[POST] Update result:', result);
    
    return Response.json({ 
      success: true, 
      message: '프로필 이미지가 변경되었습니다.' 
    });
  } catch (error) {
    console.error('[POST] Error saving profile settings:', error);
    console.error('[POST] Error stack:', error.stack);
    return Response.json({ 
      success: false, 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}
