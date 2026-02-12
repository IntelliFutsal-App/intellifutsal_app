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
 *     CreateTeamRequest:
 *       type: object
 *       required: [name, category]
 *       properties:
 *         name:
 *           type: string
 *         category:
 *           type: string
 *           description: Categoría del equipo (p. ej. "Sub-20", "Profesional")
 *       example:
 *         name: "Juvenil A"
 *         category: "Sub-20"
 *
 *     UpdateTeamRequest:
 *       type: object
 *       required: [id]
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         category:
 *           type: string
 *       example:
 *         id: 3
 *         name: "Juvenil A"
 *         category: "Sub-21"
 *
 *     UpdateStatusRequest:
 *       type: object
 *       required: [status]
 *       properties:
 *         status:
 *           type: boolean
 *           description: Estado activo/inactivo del equipo
 *       example:
 *         status: false
 *
 *     TeamResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         category:
 *           type: string
 *         status:
 *           type: boolean
 *       example:
 *         id: 3
 *         name: "Juvenil A"
 *         category: "Sub-20"
 *         status: true
 *
 * security:
 *   - bearerAuth: []
 */

/**
 * @swagger
 * tags:
 *   - name: Teams
 *     description: Gestión de equipos
 */

/**
 * @swagger
 * /api/team/:
 *   get:
 *     summary: Listar equipos activos
 *     description: Retorna todos los equipos activos. Requiere rol COACH o PLAYER.
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de equipos activos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/TeamResponse' }
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Requiere rol COACH o PLAYER }
 *       500: { description: Error interno }
 */

/**
 * @swagger
 * /api/team/inactive:
 *   get:
 *     summary: Listar equipos (incluye inactivos)
 *     description: Retorna todos los equipos, activos e inactivos. Requiere rol COACH o PLAYER.
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de equipos (activos e inactivos)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/TeamResponse' }
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Requiere rol COACH o PLAYER }
 *       500: { description: Error interno }
 */

/**
 * @swagger
 * /api/team/{id}:
 *   get:
 *     summary: Obtener equipo por ID (solo activos)
 *     description: Retorna un equipo activo por su ID. Requiere rol COACH.
 *     tags: [Teams]
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
 *         description: Equipo encontrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/TeamResponse' }
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Requiere rol COACH }
 *       404: { description: Equipo no encontrado }
 *       500: { description: Error interno }
 */

/**
 * @swagger
 * /api/team/inactive/{id}:
 *   get:
 *     summary: Obtener equipo por ID (incluye inactivos)
 *     description: Retorna un equipo por su ID, aunque esté inactivo. Requiere rol COACH.
 *     tags: [Teams]
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
 *         description: Equipo encontrado (activo o inactivo)
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/TeamResponse' }
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Requiere rol COACH }
 *       404: { description: Equipo no encontrado }
 *       500: { description: Error interno }
 */

/**
 * @swagger
 * /api/team/:
 *   post:
 *     summary: Crear equipo
 *     description: Crea un nuevo equipo. Requiere rol COACH.
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CreateTeamRequest' }
 *     responses:
 *       201:
 *         description: Equipo creado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/TeamResponse' }
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Requiere rol COACH }
 *       409:
 *         description: Nombre de equipo ya existe
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       500: { description: Error interno }
 */

/**
 * @swagger
 * /api/team/:
 *   put:
 *     summary: Actualizar equipo
 *     description: Actualiza nombre y/o categoría de un equipo existente. Requiere rol COACH.
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/UpdateTeamRequest' }
 *     responses:
 *       200:
 *         description: Equipo actualizado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/TeamResponse' }
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Requiere rol COACH }
 *       404: { description: Equipo no encontrado }
 *       409:
 *         description: Nombre de equipo ya existe
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       500: { description: Error interno }
 */

/**
 * @swagger
 * /api/team/{id}:
 *   delete:
 *     summary: Eliminar equipo
 *     description: Elimina un equipo por ID. Requiere rol COACH.
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: ID del equipo
 *     responses:
 *       204:
 *         description: Eliminado sin contenido
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Requiere rol COACH }
 *       404: { description: Equipo no encontrado }
 *       500: { description: Error interno }
 */

/**
 * @swagger
 * /api/team/status/{id}:
 *   patch:
 *     summary: Actualizar estado (activo/inactivo)
 *     description: Actualiza el campo de estado del equipo. Requiere rol COACH.
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: ID del equipo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/UpdateStatusRequest' }
 *     responses:
 *       200:
 *         description: Equipo actualizado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/TeamResponse' }
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Requiere rol COACH }
 *       404: { description: Equipo no encontrado }
 *       500: { description: Error interno }
 */