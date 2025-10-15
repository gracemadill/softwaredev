FROM node:18-bullseye

WORKDIR /app

# Install OCR dependencies
RUN apt-get update && \
    apt-get install -y python3 python3-pip tesseract-ocr libtesseract-dev poppler-utils && \
    rm -rf /var/lib/apt/lists/*

COPY package.json ./
RUN npm install --production

COPY requirements.txt ./requirements.txt
RUN pip3 install --no-cache-dir -r requirements.txt

COPY . .

ENV PORT=4000
EXPOSE 4000

CMD ["npm", "run", "start"]
