import mongoose from 'mongoose';
import app from './app';

/* Database connection */
(async () => {
  if (!process.env.JWT_KEY) throw new Error('JWT_KEY must be defined');
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI must be defined');

  try {
    await mongoose.connect(process.env.MONGO_URI, {});
    console.log('DB Connected 🌕 🌕 🌕');
  } catch (err) {
    console.log('❌ ❌ ❌ ❌ ❌ ', err);
  }
})();
/* Database connection */

app.listen(3000, () => {
  console.log('Listenning on port 3000 🌕 🌕 🌕 🌕 !!!!!!');
});
