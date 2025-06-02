require('dotenv').config();

const app = require('./app');
const PORT = process.env.PORT || 4010;

app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`);
});
