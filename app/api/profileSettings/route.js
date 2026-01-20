import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

export async function GET() {
  let client;
  try {
    client = new MongoClient(uri);
    await client.connect();
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
  } finally {
    if (client) {
      await client.close();
    }
  }
}

export async function POST(request) {
  let client;
  try {
    const { profileImage } = await request.json();
    
    client = new MongoClient(uri);
    await client.connect();
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
  } finally {
    if (client) {
      await client.close();
    }
  }
}
