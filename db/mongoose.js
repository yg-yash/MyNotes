const mongoose = require('mongoose');
try {
  mongoose
    .connect('MONGO_URI', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((value) => console.log('mongodb connected'))
    .catch((error) => console.log('cant connect to mongo db', error));
} catch (e) {
  console.log('mongodb coudnt connect');
}
