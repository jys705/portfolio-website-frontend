import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const database = client.db('portfolio');
    const settings = database.collection('settings');
    
    const profileSetting = await settings.findOne({ key: 'profileImage' });
    
    return Response.json({ 
      success: true, 
      profileImage: profileSetting?.value || 'profile-img2.jpg' 
    });
  } catch (error) {
    console.error('Error fetching profile settings:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { profileImage } = await request.json();
    
    const client = await clientPromise;
    const database = client.db('portfolio');
    const settings = database.collection('settings');
    
    await settings.updateOne(
      { key: 'profileImage' },
      { $set: { key: 'profileImage', value: profileImage, updatedAt: new Date() } },
      { upsert: true }
    );
    
    return Response.json({ 
      success: true, 
      message: '프로필 이미지가 변경되었습니다.' 
    });
  } catch (error) {
    console.error('Error saving profile settings:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
