import express from 'express'
import cors from 'cors'
import { db } from '../config/baseDatos.js'
import { rutaUsuario } from './router/usuario.js'
import { rutaAutorizacion } from './router/autorizacion.js'
import { rutaRol } from './router/rol.js'
import { rutaCategoria } from './router/categoria.js'
import { rutaProveedor } from './router/preoveedor.js'
import { rutaCompra } from './router/compra.js'
import { rutaProducto } from './router/producto.js'
import { rutaVariante } from './router/variante.js'
import { rutaBitacora } from './router/bitacora.js'
import { decodificarToken } from '../middleware/descodificarToken.js'

const App = ({
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
  const port = process.env.PORT || 3000

  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  // ✅ lista de dominios permitidos (frontend)
  const allowedOrigins = [
    'http://localhost:5173',
    'https://test-d3f1.vercel.app',
    'https://test-d3f1-pdes0x9c1-dennis-projects-b90ec4aa.vercel.app'
  ]

  // ✅ configuración CORS
  app.use(
    cors({
      origin: function (origin, callback) {
        if (!origin) return callback(null, true)
        if (allowedOrigins.includes(origin)) {
          return callback(null, true)
        } else {
          return callback(new Error('Not allowed by CORS'))
        }
      },
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true
    })
  )

  db()

  // rutas
  app.use('/usuario', decodificarToken, rutaUsuario({ usuarioServicio }))
  app.use('/autorizacion', rutaAutorizacion({ autorizacionServicio }))
  app.use('/rol', decodificarToken, rutaRol({ rolServicio, bitacoraServicio }))
  app.use('/categorias', decodificarToken, rutaCategoria({ categoriaServicio }))
  app.use('/proveedores', decodificarToken, rutaProveedor({ proveedorServicio }))
  app.use('/productos', decodificarToken, rutaProducto({ productoServicio }))
  app.use('/variantes', decodificarToken, rutaVariante({ varianteServicio }))
  app.use('/compras', decodificarToken, rutaCompra({ compraServicio, bitacoraServicio }))
  app.use('/bitacora', rutaBitacora({ bitacoraServicio }))
  app.listen(port, () => {
    console.log(`Servidor ejecutándose en el puerto ${port}`)
  })
  return app
}

export default App
