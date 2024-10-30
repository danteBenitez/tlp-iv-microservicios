# Instrucciones de inicialización del proyecto

## Con Docker Compose

1. Clonar el repositorio

```bash
git clone https://github.com/danteBenitez/tlp-iv-microservicios
```

2. Crear un archivo `.env.prod` en la raíz de cada microservicio siguiendo el `.env.example` correspondiente.

> [!CAUTION]
> Las variables puestas por defecto están configuradas para agilizar el desarrollo.
> Bajo ningún concepto deben utilizarse en un entorno de producción.

3. Inicializar los contenedores

```bash
docker-compose up -d
```
