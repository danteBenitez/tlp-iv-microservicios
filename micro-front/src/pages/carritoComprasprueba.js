// import { useState } from 'react'
// import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react'
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

// // Simulación de una función para guardar el producto en el carrito
// const guardarEnCarrito = async (productoId: number) => {
//   // Aquí iría la lógica para guardar el producto en el carrito en el backend
//   console.log(`Producto ${productoId} guardado en el carrito`)
//   return true
// }

// // Simulación de una función para realizar la compra
// const realizarCompra = async (productos: Producto[]) => {
//   // Aquí iría la lógica para procesar la compra en el backend
//   console.log('Compra realizada', productos)
//   return true
// }

// type Producto = {
//   id: number
//   nombre: string
//   precio: number
//   cantidad: number
// }

// export default function CarritoDeCompras() {
//   const [productos, setProductos] = useState<Producto[]>([
//     { id: 1, nombre: "Camiseta", precio: 20, cantidad: 1 },
//     { id: 2, nombre: "Pantalón", precio: 30, cantidad: 1 },
//   ])

//   const agregarProducto = async (productoId: number) => {
//     const exito = await guardarEnCarrito(productoId)
//     if (exito) {
//       setProductos(prevProductos =>
//         prevProductos.map(producto =>
//           producto.id === productoId
//             ? { ...producto, cantidad: producto.cantidad + 1 }
//             : producto
//         )
//       )
//     }
//   }

//   const disminuirCantidad = (productoId: number) => {
//     setProductos(prevProductos =>
//       prevProductos.map(producto =>
//         producto.id === productoId && producto.cantidad > 1
//           ? { ...producto, cantidad: producto.cantidad - 1 }
//           : producto
//       )
//     )
//   }

//   const eliminarProducto = (productoId: number) => {
//     setProductos(prevProductos =>
//       prevProductos.filter(producto => producto.id !== productoId)
//     )
//   }

//   const comprarTodo = async () => {
//     const exito = await realizarCompra(productos)
//     if (exito) {
//       setProductos([])
//       alert('¡Compra realizada con éxito!')
//     }
//   }

//   const total = productos.reduce((sum, producto) => sum + producto.precio * producto.cantidad, 0)

//   return (
//     <Card className="w-full max-w-3xl mx-auto">
//       <CardHeader>
//         <CardTitle className="text-2xl font-bold flex items-center">
//           <ShoppingCart className="mr-2" /> Carrito de Compras
//         </CardTitle>
//       </CardHeader>
//       <CardContent>
//         {productos.length === 0 ? (
//           <p className="text-center text-gray-500">El carrito está vacío</p>
//         ) : (
//           <ul className="space-y-4">
//             {productos.map(producto => (
//               <li key={producto.id} className="flex items-center justify-between border-b pb-2">
//                 <span className="font-medium">{producto.nombre}</span>
//                 <div className="flex items-center space-x-2">
//                   <span>${producto.precio}</span>
//                   <Button variant="outline" size="icon" onClick={() => disminuirCantidad(producto.id)}>
//                     <Minus className="h-4 w-4" />
//                   </Button>
//                   <span>{producto.cantidad}</span>
//                   <Button variant="outline" size="icon" onClick={() => agregarProducto(producto.id)}>
//                     <Plus className="h-4 w-4" />
//                   </Button>
//                   <Button variant="destructive" size="icon" onClick={() => eliminarProducto(producto.id)}>
//                     <Trash2 className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         )}
//       </CardContent>
//       <CardFooter className="flex justify-between items-center">
//         <span className="text-xl font-bold">Total: ${total}</span>
//         <Button onClick={comprarTodo} disabled={productos.length === 0}>
//           Comprar Todo
//         </Button>
//       </CardFooter>
//     </Card>
//   )
// }