// 'use client'

// import { useState } from 'react'
// import { Truck, Package2 } from 'lucide-react'
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Badge } from "@/components/ui/badge"

// export default function Component({ productName = "Producto de ejemplo", initialStatus = "en_camino" }) {
//   const [status, setStatus] = useState(initialStatus)

//   return (
//     <Card className="w-full max-w-md mx-auto">
//       <CardHeader>
//         <CardTitle>Estado de Envío</CardTitle>
//         <CardDescription>{productName}</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="flex flex-col items-center space-y-4">
//           {status === "en_camino" ? (
//             <Truck className="w-16 h-16 text-blue-500" />
//           ) : (
//             <Package2 className="w-16 h-16 text-green-500" />
//           )}
//           <Badge variant={status === "en_camino" ? "secondary" : "success"} className="text-lg py-1 px-3">
//             {status === "en_camino" ? "En camino" : "Entregado"}
//           </Badge>
//           <Select onValueChange={setStatus} value={status}>
//             <SelectTrigger className="w-full">
//               <SelectValue placeholder="Seleccionar estado" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="en_camino">En camino</SelectItem>
//               <SelectItem value="entregado">Entregado</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }