# Gunakan image Node.js versi LTS
FROM node:20-alpine

# Set working directory di container
WORKDIR /app

# Copy file package.json dan package-lock.json (kalau ada)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy semua file project ke dalam container
COPY . .

# Jalankan server (ganti dengan perintah kamu, misalnya npm run start:dev)
CMD ["npm", "run", "start:dev"]

# Container akan expose port 3000 (atau port backend kamu)
EXPOSE 5000
