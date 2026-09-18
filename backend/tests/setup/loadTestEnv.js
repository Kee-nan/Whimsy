const path = require('path');
const result = require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '.env.test') });

if (result.error) {
  throw new Error(
    `Could not find or load backend/.env.test — confirm the file exists there. ` +
    `Original error: ${result.error.message}`
  );
}