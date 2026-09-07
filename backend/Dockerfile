FROM ubuntu:24.04

RUN apt-get update && \
    apt-get install -y \
    g++ \
    cmake \
    ninja-build \
    libsqlite3-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY . .

RUN mkdir build && \
    cd build && \
    cmake -G Ninja .. && \
    ninja

EXPOSE 10000

CMD ["./build/LibraXApi"]