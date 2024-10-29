# Instrucciones de inicialización del proyecto

## Con Docker Compose

1. Clonar el repositorio

```bash
git clone https://github.com/danteBenitez/tlp-iv-microservicios
```

2. Crear un archivo `.env.prod` en la raíz de cada microservicio siguiendo el `.env.example` correspondiente:

3. Inicializar los contenedores

```bash
docker-compose build --no-cache # para crear un build ignorando cache.
docker-compose up -d
```
