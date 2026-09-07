# =========================
# Stage 1: Build React
# =========================
FROM node:20 AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ .
RUN npm run build


# =========================
# Stage 2: Build C++ Backend
# =========================
FROM ubuntu:24.04 AS backend-builder

RUN apt-get update && \
    apt-get install -y \
    g++ \
    cmake \
    ninja-build \
    libsqlite3-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app/backend

COPY backend/ .

RUN mkdir build && \
    cd build && \
    cmake -G Ninja .. && \
    ninja


# =========================
# Stage 3: Final Application
# =========================
FROM ubuntu:24.04

RUN apt-get update && \
    apt-get install -y \
    libsqlite3-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=backend-builder /app/backend/build/LibraXApi ./LibraXApi

COPY --from=backend-builder /app/backend/data ./data

COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

EXPOSE 10000

CMD ["./LibraXApi"]