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
 *     UpdateStatusRequest:
 *       type: object
 *       required: [status]
 *       properties:
 *         status:
 *           type: boolean
 *           description: Estado activo/inactivo de la asignación
 *       example:
 *         status: false
 *
 *     CreatePlayerTeamRequest:
 *       type: object
 *       required: [entryDate, playerId, teamId]
 *       properties:
 *         entryDate:
 *           type: string
 *           format: date-time
 *           description: Fecha de ingreso (no puede ser futura)
 *         exitDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Fecha de salida (opcional, > entryDate y no futura)
 *         playerId:
 *           type: integer
 *           description: ID del jugador existente
 *         teamId:
 *           type: integer
 *           description: ID del equipo existente
 *       example:
 *         entryDate: "2025-02-01T00:00:00.000Z"
 *         exitDate: null
 *         playerId: 15
 *         teamId: 3
 *
 *     UpdatePlayerTeamRequest:
 *       type: object
 *       required: [id]
 *       properties:
 *         id:
 *           type: integer
 *         entryDate:
 *           type: string
 *           format: date-time
 *         exitDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         playerId:
 *           type: integer
 *         teamId:
 *           type: integer
 *       example:
 *         id: 21
 *         exitDate: "2025-07-31T00:00:00.000Z"
 *
 *     PlayerTeamResponse:
 *       type: object
 *       properties:
 *         id: { type: integer }
 *         entryDate: { type: string, format: date-time }
 *         exitDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         playerId: { type: integer }
 *         teamId: { type: integer }
 *         status: { type: boolean }
 *       example:
 *         id: 21
 *         entryDate: "2024-08-01T00:00:00.000Z"
 *         exitDate: null
 *         playerId: 15
 *         teamId: 3
 *         status: true
 *
 * security:
 *   - bearerAuth: []
 */

/**
 * @swagger
 * tags:
 *   - name: PlayerTeams
 *     description: Asignación de jugadores a equipos
 */

/**
 * @swagger
 * /api/player-team/:
 *   get:
 *     summary: Listar asignaciones activas
 *     description: Retorna todas las asignaciones jugador–equipo activas. Requiere rol COACH o PLAYER.
 *     tags: [PlayerTeams]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de asignaciones activas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/PlayerTeamResponse' }
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Requiere rol COACH o PLAYER }
 *       500: { description: Error interno }
 */

/**
 * @swagger
 * /api/player-team/inactive:
 *   get:
 *     summary: Listar asignaciones (incluye inactivas)
 *     description: Retorna todas las asignaciones, activas e inactivas. Requiere rol COACH o PLAYER.
 *     tags: [PlayerTeams]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de asignaciones (activas e inactivas)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/PlayerTeamResponse' }
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Requiere rol COACH o PLAYER }
 *       500: { description: Error interno }
 */

/**
 * @swagger
 * /api/player-team/{id}:
 *   get:
 *     summary: Obtener asignación por ID (solo activas)
 *     description: Retorna una asignación activa por su ID. Requiere rol COACH o PLAYER.
 *     tags: [PlayerTeams]
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
 *             schema: { $ref: '#/components/schemas/PlayerTeamResponse' }
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Requiere rol COACH o PLAYER }
 *       404: { description: Asignación no encontrada }
 *       500: { description: Error interno }
 */

/**
 * @swagger
 * /api/player-team/inactive/{id}:
 *   get:
 *     summary: Obtener asignación por ID (incluye inactivas)
 *     description: Retorna una asignación por su ID, aunque esté inactiva. Requiere rol COACH o PLAYER.
 *     tags: [PlayerTeams]
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
 *         description: Asignación encontrada (activa o inactiva)
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/PlayerTeamResponse' }
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Requiere rol COACH o PLAYER }
 *       404: { description: Asignación no encontrada }
 *       500: { description: Error interno }
 */

/**
 * @swagger
 * /api/player-team/player/{playerId}:
 *   get:
 *     summary: Listar asignaciones por jugador
 *     description: Retorna las asignaciones asociadas a un jugador por su ID. Requiere rol COACH o PLAYER.
 *     tags: [PlayerTeams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: playerId
 *         required: true
 *         schema: { type: integer }
 *         description: ID del jugador
 *     responses:
 *       200:
 *         description: Lista de asignaciones del jugador
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/PlayerTeamResponse' }
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Requiere rol COACH o PLAYER }
 *       500: { description: Error interno }
 */

/**
 * @swagger
 * /api/player-team/:
 *   post:
 *     summary: Crear asignación player–team
 *     description: Crea una nueva asignación entre un jugador y un equipo (valida fechas y duplicados). Requiere rol COACH o PLAYER.
 *     tags: [PlayerTeams]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CreatePlayerTeamRequest' }
 *     responses:
 *       201:
 *         description: Asignación creada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/PlayerTeamResponse' }
 *       400:
 *         description: Datos inválidos o fechas inválidas (futuras o salida <= ingreso)
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Requiere rol COACH o PLAYER }
 *       404:
 *         description: Jugador o Equipo no encontrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       409:
 *         description: La relación player–team ya existe (duplicada)
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       500: { description: Error interno }
 */

/**
 * @swagger
 * /api/player-team/:
 *   put:
 *     summary: Actualizar asignación player–team
 *     description: Actualiza fechas o cambia el jugador/equipo asociado (valida duplicados y fechas). Requiere rol COACH o PLAYER.
 *     tags: [PlayerTeams]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/UpdatePlayerTeamRequest' }
 *     responses:
 *       200:
 *         description: Asignación actualizada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/PlayerTeamResponse' }
 *       400:
 *         description: Datos inválidos o fechas inválidas (futuras o salida <= ingreso)
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Requiere rol COACH o PLAYER }
 *       404:
 *         description: Asignación/Jugador/Equipo no encontrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       409:
 *         description: La relación player–team ya existe (duplicada)
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       500: { description: Error interno }
 */

/**
 * @swagger
 * /api/player-team/{id}:
 *   delete:
 *     summary: Eliminar asignación
 *     description: Elimina una asignación player–team por ID. Requiere rol COACH o PLAYER.
 *     tags: [PlayerTeams]
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
 *       403: { description: Acceso denegado - Requiere rol COACH o PLAYER }
 *       404: { description: Asignación no encontrada }
 *       500: { description: Error interno }
 */

/**
 * @swagger
 * /api/player-team/status/{id}:
 *   patch:
 *     summary: Actualizar estado (activo/inactivo)
 *     description: Actualiza el campo de estado de la asignación. Requiere rol COACH o PLAYER.
 *     tags: [PlayerTeams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: ID de la asignación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/UpdateStatusRequest' }
 *     responses:
 *       200:
 *         description: Asignación actualizada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/PlayerTeamResponse' }
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Requiere rol COACH o PLAYER }
 *       404: { description: Asignación no encontrada }
 *       500: { description: Error interno }
 */