# Build stage for Frontend
FROM node:20 as build-stage
WORKDIR /app
COPY frontend2/package*.json ./
RUN npm install
COPY frontend2/ .
# In a unified deployment, we can set the API URL to relative
ENV VITE_API_URL=""
RUN npm run build

# Final stage for Backend
FROM python:3.10
WORKDIR /app
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ .
# Copy frontend build to static directory in backend
COPY --from=build-stage /app/dist ./static

# HF Spaces use port 7860 by default
EXPOSE 7860
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
