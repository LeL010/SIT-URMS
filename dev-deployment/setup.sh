# !/bin/bash

# Make Directories
mkdir {client,server}


npm init -y
# Install server dependencies
npm install express mysql2 sequelize cors dotenv yup
npm i nodemon --save-dev
npm install bcrypt jsonwebtoken


npm create vite .
# Install client dependencies
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material
npm install @mui/x-data-grid
npm install @mui/x-date-pickers

npm install react-router-dom
npm install react-toastify
npm install axios
npm install dayjs
npm install formik yup

# Start the server
# node server.js

# Start the client
# npm start