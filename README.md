# Arquitectura de Microservicios

## Sobre el proyecto

El presente proyecto pretende ser un ejemplo de aplicación de la arquitectura de microservicios. La situación planteada tiene que ver con una empresa que ofrece un servicio de ventas por Internet. La aplicación permite:

- A los administradores:
  - Registrar sus proveedores, con datos sobre la compañía, su dirección y contacto.
  - Registrar productos y gestionar su stock correspondiente.
  - Llevar cuenta de las compras que realizan a sus proveedores, manejando el stock automáticamente.
- A los usuarios:
  - Acceder a los productos ofrecidos
  - Comprar uno o varios producto
  - Almacenar los productos que quieran en un carrito, para luego comprarlos de modo colectivo.
  - Acceder al estado de los envíos de los productos que compraron, se encuentren en stock, en transporte o hayan llegado a su destino.

## Sobre la arquitectura

El proyecto se divide en _7 microservicios_ principales que ofrecen las funcionalidades listadas. Además, estos microservicios se conectan a tres bases de datos, una de las cuales es NoSQL (MongoDB) y las dos restantes son instancias de PostgreSQL.

Un cliente de la plataforma se comunica con una _API Gateway_ configurada con NGINX, que actúa como _proxy inverso_ y direcciona las peticiones del exterior a la red privada de contenedores. Los contenedores se comunican entre sí mediante peticiones HTTP o también usando un _broker_ de mensajes RabbitMQ para ciertas funcionalidades.

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
docker-compose build --no-cache # para crear un build ignorando cache.
docker-compose up -d
```
