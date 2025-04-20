const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const studentSchema = new mongoose.Schema({}, { strict: false });
const Student = mongoose.model('Student', studentSchema, 'students'); // 'students' = collection name

Student.find({})
  .then(docs => {
    docs.forEach((doc, i) => {
      console.log(`\nStudent ${i + 1}:`);
      console.log(JSON.stringify(doc, null, 2));
    });
        mongoose.disconnect();
  })
  .catch(err => {
    console.error(err);
    mongoose.disconnect();
  });

