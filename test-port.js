const express = require('express');
const app = express();
const port = 5055;

app.get('/', (req, res) => {
  res.send('It works!');
});

app.listen(port, () => {
  console.log(`✅ Listening at http://localhost:${port}`);
});

setInterval(() => {
  console.log('🟢 Server is still alive...');
}, 5000);
