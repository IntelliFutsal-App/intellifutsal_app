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
 *     CreatePlayerClusterRequest:
 *       type: object
 *       required: [playerId, clusterId]
 *       properties:
 *         playerId:
 *           type: integer
 *           description: ID del jugador existente
 *         clusterId:
 *           type: integer
 *           description: ID del cluster existente
 *       example:
 *         playerId: 15
 *         clusterId: 7
 *
 *     UpdatePlayerClusterRequest:
 *       type: object
 *       required: [id]
 *       properties:
 *         id:
 *           type: integer
 *         playerId:
 *           type: integer
 *         clusterId:
 *           type: integer
 *       example:
 *         id: 21
 *         clusterId: 8
 *
 *     PlayerClusterResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         playerId:
 *           type: integer
 *         clusterId:
 *           type: integer
 *       example:
 *         id: 21
 *         playerId: 15
 *         clusterId: 7
 *
 * security:
 *   - bearerAuth: []
 */

/**
 * @swagger
 * tags:
 *   - name: PlayerClusters
 *     description: Asignación de clusters a jugadores (solo rol COACH)
 */

/**
 * @swagger
 * /api/player-cluster/:
 *   get:
 *     summary: Listar asignaciones player–cluster
 *     description: Retorna todas las asignaciones. Requiere rol COACH.
 *     tags: [PlayerClusters]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de asignaciones
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/PlayerClusterResponse' }
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Requiere rol COACH }
 *       500: { description: Error interno }
 */

/**
 * @swagger
 * /api/player-cluster/{id}:
 *   get:
 *     summary: Obtener asignación por ID
 *     description: Retorna una asignación player–cluster por su ID. Requiere rol COACH.
 *     tags: [PlayerClusters]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: ID de la asignación
 *     responses:
 *       200:
 *         description: Asignación encontrada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/PlayerClusterResponse' }
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Requiere rol COACH }
 *       404: { description: Asignación no encontrada }
 *       500: { description: Error interno }
 */

/**
 * @swagger
 * /api/player-cluster/:
 *   post:
 *     summary: Crear asignación player–cluster
 *     description: Crea una nueva asignación entre un jugador y un cluster. Requiere rol COACH.
 *     tags: [PlayerClusters]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CreatePlayerClusterRequest' }
 *     responses:
 *       201:
 *         description: Asignación creada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/PlayerClusterResponse' }
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Requiere rol COACH }
 *       404:
 *         description: Jugador o cluster no encontrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       409:
 *         description: La relación player–cluster ya existe (duplicada)
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       500: { description: Error interno }
 */

/**
 * @swagger
 * /api/player-cluster/:
 *   put:
 *     summary: Actualizar asignación player–cluster
 *     description: Actualiza el jugador y/o cluster en una asignación existente (valida duplicados). Requiere rol COACH.
 *     tags: [PlayerClusters]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/UpdatePlayerClusterRequest' }
 *     responses:
 *       200:
 *         description: Asignación actualizada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/PlayerClusterResponse' }
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Requiere rol COACH }
 *       404:
 *         description: Asignación/Jugador/Cluster no encontrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       409:
 *         description: La relación player–cluster ya existe (duplicada)
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       500: { description: Error interno }
 */

/**
 * @swagger
 * /api/player-cluster/{id}:
 *   delete:
 *     summary: Eliminar asignación
 *     description: Elimina una asignación player–cluster por ID. Requiere rol COACH.
 *     tags: [PlayerClusters]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: ID de la asignación
 *     responses:
 *       204:
 *         description: Eliminado sin contenido
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Requiere rol COACH }
 *       404: { description: Asignación no encontrada }
 *       500: { description: Error interno }
 */