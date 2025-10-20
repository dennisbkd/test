import express from 'express'
import { db } from '../config/baseDatos.js'
import { rutaUsuario } from './router/usuario.js'
import { rutaAutorizacion } from './router/autorizacion.js'
import { rutaRol } from './router/rol.js'
import { rutaCategoria } from './router/categoria.js'
import { rutaProveedor } from './router/preoveedor.js'
import { rutaCompra } from './router/compra.js'

import cors from 'cors'
import { rutaProducto } from './router/producto.js'
import { rutaVariante } from './router/variante.js'
import { decodificarToken } from '../middleware/descodificarToken.js'
import { rutaBitacora } from './router/bitacora.js'

export const App = ({
  usuarioServicio,
  autorizacionServicio,
  rolServicio,
  bitacoraServicio,
  categoriaServicio,
  proveedorServicio,
  productoServicio,
  varianteServicio,
  compraServicio
}) => {
  const app = express()
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  const allowedOrigins = [
    'http://localhost:5173', // dev local
    'https://test-d3f1.vercel.app' // dominio estable de frontend
  ]

  app.use(cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true) // permite requests sin origin (ej. Postman)
      if (allowedOrigins.includes(origin) || /\.vercel\.app$/.test(origin)) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    credentials: true
  }))

  db()

  app.use('/usuario', decodificarToken, rutaUsuario({ usuarioServicio }))
  app.use('/autorizacion', rutaAutorizacion({ autorizacionServicio }))
  app.use('/rol', decodificarToken, rutaRol({ rolServicio, bitacoraServicio }))
  app.use('/categorias', decodificarToken, rutaCategoria({ categoriaServicio }))
  app.use('/proveedores', decodificarToken, rutaProveedor({ proveedorServicio }))
  app.use('/productos', decodificarToken, rutaProducto({ productoServicio }))
  app.use('/variantes', decodificarToken, rutaVariante({ varianteServicio }))
  app.use('/compras', decodificarToken, rutaCompra({ compraServicio, bitacoraServicio }))
  app.use('/bitacora', rutaBitacora({ bitacoraServicio }))
  // app.listen(port, () => {
  //   console.log(`Example app listening on port ${port}`)
  // })
}
