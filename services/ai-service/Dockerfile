FROM python:3.10-slim

# Install system libraries needed by OpenCV and PaddleOCR
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .

# Install python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Pre-download SpaCy lightweight NER english model
RUN python -m spacy download en_core_web_sm

# Create folder for PaddleOCR model cache
RUN mkdir -p /root/.paddleocr

COPY . .

EXPOSE 8059

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8059"]
