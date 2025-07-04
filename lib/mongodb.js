import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
const options = {}

let client
let clientPromise

if (process.env.NODE_ENV === 'development') {
  // 개발 환경에서는 전역 변수를 사용하여 HMR 중에 연결을 보존합니다
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  // 프로덕션 환경에서는 새 클라이언트를 생성합니다
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export default clientPromise 