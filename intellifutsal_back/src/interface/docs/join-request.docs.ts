/**
 * @swagger
 * components:
 *   schemas:
 *     CreateJoinRequestRequest:
 *       type: object
 *       required: [teamId]
 *       properties:
 *         teamId:
 *           type: integer
 *           description: ID del equipo al que el jugador desea unirse
 *       example:
 *         teamId: 3
 *
 *     UpdateJoinRequestStatusRequest:
 *       type: object
 *       properties:
 *         reviewComment:
 *           type: string
 *           description: Comentario del director técnico sobre la solicitud
 *       example:
 *         reviewComment: "El jugador no encaja en la categoría actual del equipo"
 *
 *     JoinRequestStatus:
 *       type: string
 *       description: Estado de la solicitud
 *       enum: [PENDING, APPROVED, REJECTED, CANCELLED]
 *
 *     JoinRequestResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         playerId:
 *           type: integer
 *         teamId:
 *           type: integer
 *         coachId:
 *           type: integer
 *           nullable: true
 *         status:
 *           $ref: '#/components/schemas/JoinRequestStatus'
 *         reviewComment:
 *           type: string
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         reviewedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         id: 10
 *         playerId: 5
 *         teamId: 3
 *         coachId: 1
 *         status: "PENDING"
 *         reviewComment: null
 *         createdAt: "2025-05-20T14:22:10.000Z"
 *         reviewedAt: null
 *         updatedAt: "2025-05-20T14:22:10.000Z"
 */

/**
 * @swagger
 * tags:
 *   - name: JoinRequests
 *     description: Gestión de solicitudes de ingreso a equipos
 */

/**
 * @swagger
 * /api/join-request/:
 *   get:
 *     summary: Listar solicitudes de ingreso
 *     description: Retorna todas las solicitudes de ingreso. Requiere rol COACH.
 *     tags: [JoinRequests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de solicitudes de ingreso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/JoinRequestResponse' }
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Requiere rol COACH }
 *       500: { description: Error interno }
 */

/**
 * @swagger
 * /api/join-request/{id}:
 *   get:
 *     summary: Obtener solicitud por ID
 *     description: Retorna una solicitud de ingreso por su ID. Requiere rol COACH.
 *     tags: [JoinRequests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: ID de la solicitud
 *     responses:
 *       200:
 *         description: Solicitud encontrada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/JoinRequestResponse' }
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Requiere rol COACH }
 *       404: { description: Solicitud no encontrada }
 *       500: { description: Error interno }
 */

/**
 * @swagger
 * /api/join-request/player/me:
 *   get:
 *     summary: Listar solicitudes del jugador autenticado
 *     description: Retorna las solicitudes de ingreso del jugador autenticado. Requiere rol PLAYER.
 *     tags: [JoinRequests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de solicitudes del jugador
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/JoinRequestResponse' }
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Requiere rol PLAYER }
 *       500: { description: Error interno }
 */

/**
 * @swagger
 * /api/join-request/team/{teamId}:
 *   get:
 *     summary: Listar solicitudes pendientes de un equipo
 *     description: Retorna las solicitudes de ingreso pendientes para un equipo específico. Requiere rol COACH.
 *     tags: [JoinRequests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema: { type: integer }
 *         description: ID del equipo
 *     responses:
 *       200:
 *         description: Lista de solicitudes pendientes del equipo
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/JoinRequestResponse' }
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Requiere rol COACH }
 *       404: { description: Equipo no encontrado }
 *       500: { description: Error interno }
 */

/**
 * @swagger
 * /api/join-request/:
 *   post:
 *     summary: Crear solicitud de ingreso a un equipo
 *     description: Crea una nueva solicitud de ingreso para el jugador autenticado. Requiere rol PLAYER.
 *     tags: [JoinRequests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CreateJoinRequestRequest' }
 *     responses:
 *       201:
 *         description: Solicitud creada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/JoinRequestResponse' }
 *       400:
 *         description: Datos inválidos o solicitud duplicada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Requiere rol PLAYER }
 *       404: { description: Equipo no encontrado }
 *       500: { description: Error interno }
 */

/**
 * @swagger
 * /api/join-request/approve/{id}:
 *   patch:
 *     summary: Aprobar solicitud de ingreso
 *     description: Aprueba una solicitud de ingreso y agrega al jugador al equipo. Requiere rol COACH.
 *     tags: [JoinRequests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: ID de la solicitud a aprobar
 *     responses:
 *       200:
 *         description: Solicitud aprobada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/JoinRequestResponse' }
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Requiere rol COACH o el DT no pertenece al equipo }
 *       404: { description: Solicitud no encontrada }
 *       500: { description: Error interno }
 */

/**
 * @swagger
 * /api/join-request/reject/{id}:
 *   patch:
 *     summary: Rechazar solicitud de ingreso
 *     description: Rechaza una solicitud de ingreso. Requiere rol COACH.
 *     tags: [JoinRequests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: ID de la solicitud a rechazar
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/UpdateJoinRequestStatusRequest' }
 *     responses:
 *       200:
 *         description: Solicitud rechazada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/JoinRequestResponse' }
 *       400:
 *         description: Datos inválidos o estado no permitido
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Requiere rol COACH o el DT no pertenece al equipo }
 *       404: { description: Solicitud no encontrada }
 *       500: { description: Error interno }
 */

/**
 * @swagger
 * /api/join-request/cancel/{id}:
 *   patch:
 *     summary: Cancelar solicitud de ingreso
 *     description: Cancela una solicitud de ingreso del jugador autenticado. Requiere rol PLAYER.
 *     tags: [JoinRequests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: ID de la solicitud a cancelar
 *     responses:
 *       200:
 *         description: Solicitud cancelada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/JoinRequestResponse' }
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Requiere rol PLAYER o la solicitud no pertenece al jugador }
 *       404: { description: Solicitud no encontrada }
 *       500: { description: Error interno }
 */

/**
 * @swagger
 * /api/join-request/{id}:
 *   delete:
 *     summary: Eliminar solicitud de ingreso
 *     description: Elimina una solicitud de ingreso por ID (uso de mantenimiento). Requiere rol COACH.
 *     tags: [JoinRequests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: ID de la solicitud
 *     responses:
 *       204:
 *         description: Eliminado sin contenido
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Requiere rol COACH }
 *       404: { description: Solicitud no encontrada }
 *       500: { description: Error interno }
 */