import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import jwt from 'jsonwebtoken';

declare global {
  var signin: () => string[];
}

let mongo: any;

jest.mock('../nats-wrapper');

//hook
beforeAll(async () => {
  process.env.JWT_KEY = 'reioertbgr';
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  jest.clearAllMocks();
  //reset data
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

global.signin = () => {
  const token = jwt.sign(
    {
      id: new mongoose.Types.ObjectId().toHexString(),
      email: 'ouss@gmail.com',
    },
    process.env.JWT_KEY!
  );

  // encode it to base 64
  const base64 = Buffer.from(JSON.stringify({ jwt: token })).toString('base64');

  return [`session=${base64}`];
};

// global.signin = async () => {
//   // Build payload {id, email}
//   const payload = {
//     email: 'ouss@gmail.com',
//     password: 'bvrthgiutrbrtjbtr',
//   };

//   // Create JWT
//   const token = jwt.sign({ ...payload }, process.env.JWT_KEY!);

//   // Build session { jwt : MY_JWT}
//   const session = { jwt: token };

//   // TO JSON
//   const sessionJson = JSON.stringify(session);

//   // encode it to base 64
//   const base64 = Buffer.from(sessionJson).toString('base64');

//   return [`session=${base64}`];
// };
