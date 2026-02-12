/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 *   schemas:
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Mensaje de error
 *         status:
 *           type: integer
 *           description: Código de estado HTTP
 *       example:
 *         message: "Recurso no encontrado"
 *         status: 404
 *
 *     CreateClusterRequest:
 *       type: object
 *       required: [description]
 *       properties:
 *         description:
 *           type: string
 *           description: Descripción del cluster
 *       example:
 *         description: "Atletas Explosivos"
 *
 *     UpdateClusterRequest:
 *       type: object
 *       required: [id]
 *       properties:
 *         id:
 *           type: integer
 *         description:
 *           type: string
 *           description: Nueva descripción del cluster
 *       example:
 *         id: 7
 *         description: "Atletas de Resistencia"
 *
 *     ClusterResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         description:
 *           type: string
 *         creationDate:
 *           type: string
 *           format: date-time
 *       example:
 *         id: 7
 *         description: "Atletas Explosivos"
 *         creationDate: "2025-05-20T14:22:10.000Z"
 *
 * security:
 *   - bearerAuth: []
 */

/**
 * @swagger
 * tags:
 *   - name: Clusters
 *     description: Gestión de clusters (solo rol COACH)
 */

/**
 * @swagger
 * /api/cluster/:
 *   get:
 *     summary: Listar clusters
 *     description: Retorna todos los clusters. Requiere rol COACH.
 *     tags: [Clusters]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de clusters
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/ClusterResponse' }
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Requiere rol COACH }
 *       500: { description: Error interno }
 */

/**
 * @swagger
 * /api/cluster/{id}:
 *   get:
 *     summary: Obtener cluster por ID
 *     description: Retorna un cluster por su ID. Requiere rol COACH.
 *     tags: [Clusters]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: ID del cluster
 *     responses:
 *       200:
 *         description: Cluster encontrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ClusterResponse' }
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Requiere rol COACH }
 *       404: { description: Cluster no encontrado }
 *       500: { description: Error interno }
 */

/**
 * @swagger
 * /api/cluster/:
 *   post:
 *     summary: Crear cluster
 *     description: Crea un nuevo cluster. Requiere rol COACH.
 *     tags: [Clusters]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CreateClusterRequest' }
 *     responses:
 *       201:
 *         description: Cluster creado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ClusterResponse' }
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Requiere rol COACH }
 *       500: { description: Error interno }
 */

/**
 * @swagger
 * /api/cluster/:
 *   put:
 *     summary: Actualizar cluster
 *     description: Actualiza la descripción de un cluster existente. Requiere rol COACH.
 *     tags: [Clusters]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/UpdateClusterRequest' }
 *     responses:
 *       200:
 *         description: Cluster actualizado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ClusterResponse' }
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Requiere rol COACH }
 *       404: { description: Cluster no encontrado }
 *       500: { description: Error interno }
 */

/**
 * @swagger
 * /api/cluster/{id}:
 *   delete:
 *     summary: Eliminar cluster
 *     description: Elimina un cluster por ID. Requiere rol COACH.
 *     tags: [Clusters]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: ID del cluster
 *     responses:
 *       204:
 *         description: Eliminado sin contenido
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Requiere rol COACH }
 *       404: { description: Cluster no encontrado }
 *       500: { description: Error interno }
 */