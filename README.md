# Project Tracker Frontend

## .env файл
Нужно создать `.env` файл в корне проекта:

```
NEXT_PUBLIC_BACKEND_SERVER=http://26.87.181.231:8000/v1 # адрес backend'a
NEXT_PUBLIC_BACKEND_WS_SERVER=ws://26.87.181.231:8000/v1 # адрес websocket'ов backend'a

FRONTEND_CPUS=8 # количество ядер на контейнер с frontend'ом
FRONTEND_MEMORY=8G # количество RAM на контейнер с frontend'ом
```
