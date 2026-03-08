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
 *           description: Estado activo/inactivo del jugador
 *       example:
 *         status: false
 *
 *     CreatePlayerRequest:
 *       type: object
 *       required:
 *         [firstName, lastName, birthDate, height, weight, highJump, rightUnipodalJump,
 *          leftUnipodalJump, bipodalJump, thirtyMetersTime, thousandMetersTime, position, credentialId]
 *       properties:
 *         firstName: { type: string }
 *         lastName: { type: string }
 *         birthDate:
 *           type: string
 *           format: date-time
 *           description: Fecha de nacimiento en ISO 8601
 *         height:
 *           type: number
 *           description: Altura en metros (ej. 1.78)
 *         weight:
 *           type: number
 *           description: Peso en kilogramos
 *         highJump: { type: number, description: Salto vertical (cm o unidad definida por tu dominio) }
 *         rightUnipodalJump: { type: number }
 *         leftUnipodalJump: { type: number }
 *         bipodalJump: { type: number }
 *         thirtyMetersTime: { type: number, description: Tiempo en 30m (s) }
 *         thousandMetersTime: { type: number, description: Tiempo en 1000m (s) }
 *         position: { type: string }
 *         credentialId:
 *           type: integer
 *           description: ID de la credencial existente con rol PLAYER
 *       example:
 *         firstName: "Juan"
 *         lastName: "Pérez"
 *         birthDate: "2005-04-10T00:00:00.000Z"
 *         height: 1.8
 *         weight: 75
 *         highJump: 55
 *         rightUnipodalJump: 45
 *         leftUnipodalJump: 44
 *         bipodalJump: 60
 *         thirtyMetersTime: 4.1
 *         thousandMetersTime: 210
 *         position: "Defensa Central"
 *         credentialId: 101
 *
 *     UpdatePlayerRequest:
 *       type: object
 *       required: [id]
 *       properties:
 *         id: { type: integer }
 *         firstName: { type: string }
 *         lastName: { type: string }
 *         birthDate: { type: string, format: date-time }
 *         height: { type: number, description: Altura en metros }
 *         weight: { type: number, description: Peso en kg }
 *         highJump: { type: number }
 *         rightUnipodalJump: { type: number }
 *         leftUnipodalJump: { type: number }
 *         bipodalJump: { type: number }
 *         thirtyMetersTime: { type: number }
 *         thousandMetersTime: { type: number }
 *         position: { type: string }
 *       example:
 *         id: 15
 *         weight: 76
 *         height: 1.81
 *         position: "Lateral Derecho"
 *
 *     PlayerResponse:
 *       type: object
 *       properties:
 *         id: { type: integer }
 *         firstName: { type: string }
 *         lastName: { type: string }
 *         birthDate: { type: string, format: date-time }
 *         height: { type: number }
 *         weight: { type: number }
 *         bmi:
 *           type: number
 *           description: Índice de masa corporal calculado como peso/(altura^2)
 *         highJump: { type: number }
 *         rightUnipodalJump: { type: number }
 *         leftUnipodalJump: { type: number }
 *         bipodalJump: { type: number }
 *         thirtyMetersTime: { type: number }
 *         thousandMetersTime: { type: number }
 *         position: { type: string }
 *         credentialId: { type: integer }
 *         status: { type: boolean }
 *       example:
 *         id: 15
 *         firstName: "Juan"
 *         lastName: "Pérez"
 *         birthDate: "2005-04-10T00:00:00.000Z"
 *         height: 1.8
 *         weight: 75
 *         bmi: 23.15
 *         highJump: 55
 *         rightUnipodalJump: 45
 *         leftUnipodalJump: 44
 *         bipodalJump: 60
 *         thirtyMetersTime: 4.1
 *         thousandMetersTime: 210
 *         position: "Defensa Central"
 *         credentialId: 101
 *         status: true
 *
 * security:
 *   - bearerAuth: []
 */

/**
 * @swagger
 * tags:
 *   - name: Players
 *     description: Gestión de jugadores
 */

/**
 * @swagger
 * /api/player/:
 *   get:
 *     summary: Listar jugadores activos
 *     description: Retorna todos los jugadores activos. Requiere rol COACH o PLAYER.
 *     tags: [Players]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de jugadores activos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/PlayerResponse' }
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Requiere rol COACH o PLAYER }
 *       500: { description: Error interno }
 */

/**
 * @swagger
 * /api/player/inactive:
 *   get:
 *     summary: Listar jugadores (incluye inactivos)
 *     description: Retorna todos los jugadores, activos e inactivos. Requiere rol COACH o PLAYER.
 *     tags: [Players]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de jugadores (activos e inactivos)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/PlayerResponse' }
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Requiere rol COACH o PLAYER }
 *       500: { description: Error interno }
 */

/**
 * @swagger
 * /api/player/{id}:
 *   get:
 *     summary: Obtener jugador por ID (solo activos)
 *     description: Retorna un jugador activo por su ID. Requiere rol COACH o PLAYER.
 *     tags: [Players]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: ID del jugador
 *     responses:
 *       200:
 *         description: Jugador encontrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/PlayerResponse' }
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Requiere rol COACH o PLAYER }
 *       404: { description: Jugador no encontrado }
 *       500: { description: Error interno }
 */

/**
 * @swagger
 * /api/player/inactive/{id}:
 *   get:
 *     summary: Obtener jugador por ID (incluye inactivos)
 *     description: Retorna un jugador por su ID, aunque esté inactivo. Requiere rol COACH o PLAYER.
 *     tags: [Players]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: ID del jugador
 *     responses:
 *       200:
 *         description: Jugador encontrado (activo o inactivo)
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/PlayerResponse' }
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Requiere rol COACH o PLAYER }
 *       404: { description: Jugador no encontrado }
 *       500: { description: Error interno }
 */

/**
 * @swagger
 * /api/player/team/{id}:
 *   get:
 *     summary: Listar jugadores por equipo
 *     description: Retorna los jugadores asociados a un equipo por su ID. Requiere rol COACH.
 *     tags: [Players]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: ID del equipo
 *     responses:
 *       200:
 *         description: Lista de jugadores del equipo
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/PlayerResponse' }
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Requiere rol COACH }
 *       404: { description: No se encontraron jugadores para el equipo }
 *       500: { description: Error interno }
 */

/**
 * @swagger
 * /api/player/:
 *   post:
 *     summary: Crear jugador
 *     description: Crea un nuevo jugador asociado a una credencial existente con rol PLAYER. Requiere rol PLAYER.
 *     tags: [Players]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CreatePlayerRequest' }
 *     responses:
 *       201:
 *         description: Jugador creado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/PlayerResponse' }
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Requiere rol PLAYER }
 *       404:
 *         description: Credencial no encontrada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       409:
 *         description: Conflicto (rol de credencial no válido o credencial ya asignada)
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       500: { description: Error interno }
 */

/**
 * @swagger
 * /api/player/:
 *   put:
 *     summary: Actualizar jugador
 *     description: Actualiza datos y recalcula el BMI según altura/peso enviados. Requiere rol PLAYER.
 *     tags: [Players]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/UpdatePlayerRequest' }
 *     responses:
 *       200:
 *         description: Jugador actualizado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/PlayerResponse' }
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Requiere rol PLAYER }
 *       404: { description: Jugador no encontrado }
 *       500: { description: Error interno }
 */

/**
 * @swagger
 * /api/player/{id}:
 *   delete:
 *     summary: Eliminar jugador
 *     description: Elimina un jugador por ID. Requiere rol PLAYER.
 *     tags: [Players]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: ID del jugador
 *     responses:
 *       204:
 *         description: Eliminado sin contenido
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Requiere rol PLAYER }
 *       404: { description: Jugador no encontrado }
 *       500: { description: Error interno }
 */

/**
 * @swagger
 * /api/player/status/{id}:
 *   patch:
 *     summary: Actualizar estado (activo/inactivo)
 *     description: Actualiza el campo de estado del jugador. Requiere rol COACH o PLAYER.
 *     tags: [Players]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: ID del jugador
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/UpdateStatusRequest' }
 *     responses:
 *       200:
 *         description: Jugador actualizado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/PlayerResponse' }
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Requiere rol COACH o PLAYER }
 *       404: { description: Jugador no encontrado }
 *       500: { description: Error interno }
 */