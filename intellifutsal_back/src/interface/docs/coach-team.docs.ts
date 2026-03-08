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
 *     CreateCoachTeamRequest:
 *       type: object
 *       required: [assignmentDate, coachId, teamId]
 *       properties:
 *         assignmentDate:
 *           type: string
 *           format: date-time
 *           description: Fecha de inicio de la asignación (no puede ser futura)
 *         endDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Fecha de fin (opcional, debe ser posterior a assignmentDate y no futura)
 *         coachId:
 *           type: integer
 *           description: ID del coach existente
 *         teamId:
 *           type: integer
 *           description: ID del equipo existente
 *       example:
 *         assignmentDate: "2025-05-01T00:00:00.000Z"
 *         endDate: null
 *         coachId: 12
 *         teamId: 3
 *
 *     UpdateCoachTeamRequest:
 *       type: object
 *       required: [id]
 *       properties:
 *         id:
 *           type: integer
 *         assignmentDate:
 *           type: string
 *           format: date-time
 *         endDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         coachId:
 *           type: integer
 *         teamId:
 *           type: integer
 *       example:
 *         id: 7
 *         endDate: "2025-07-31T00:00:00.000Z"
 *
 *     CoachTeamResponse:
 *       type: object
 *       properties:
 *         id: { type: integer }
 *         assignmentDate: { type: string, format: date-time }
 *         endDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         coachId: { type: integer }
 *         teamId: { type: integer }
 *         status: { type: boolean }
 *       example:
 *         id: 7
 *         assignmentDate: "2024-08-01T00:00:00.000Z"
 *         endDate: null
 *         coachId: 12
 *         teamId: 3
 *         status: true
 *
 * security:
 *   - bearerAuth: []
 */

/**
 * @swagger
 * tags:
 *   - name: CoachTeams
 *     description: Asignación de entrenadores a equipos (solo rol COACH)
 */

/**
 * @swagger
 * /api/coach-team/:
 *   get:
 *     summary: Listar asignaciones activas
 *     description: Retorna todas las asignaciones activas coach–team. Requiere rol COACH.
 *     tags: [CoachTeams]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de asignaciones activas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/CoachTeamResponse' }
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Requiere rol COACH }
 *       500: { description: Error interno }
 */

/**
 * @swagger
 * /api/coach-team/inactive:
 *   get:
 *     summary: Listar asignaciones (incluye inactivas)
 *     description: Retorna todas las asignaciones, activas e inactivas. Requiere rol COACH.
 *     tags: [CoachTeams]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de asignaciones (activas e inactivas)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/CoachTeamResponse' }
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Requiere rol COACH }
 *       500: { description: Error interno }
 */

/**
 * @swagger
 * /api/coach-team/{id}:
 *   get:
 *     summary: Obtener asignación por ID (solo activas)
 *     description: Retorna una asignación activa por su ID. Requiere rol COACH.
 *     tags: [CoachTeams]
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
 *             schema: { $ref: '#/components/schemas/CoachTeamResponse' }
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Requiere rol COACH }
 *       404: { description: Asignación no encontrada }
 *       500: { description: Error interno }
 */

/**
 * @swagger
 * /api/coach-team/inactive/{id}:
 *   get:
 *     summary: Obtener asignación por ID (incluye inactivas)
 *     description: Retorna una asignación por su ID, aunque esté inactiva. Requiere rol COACH.
 *     tags: [CoachTeams]
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
 *             schema: { $ref: '#/components/schemas/CoachTeamResponse' }
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Requiere rol COACH }
 *       404: { description: Asignación no encontrada }
 *       500: { description: Error interno }
 */

/**
 * @swagger
 * /api/coach-team/coach/{coachId}:
 *   get:
 *     summary: Listar asignaciones por coach
 *     description: Retorna las asignaciones asociadas a un coach por su ID. Requiere rol COACH.
 *     tags: [CoachTeams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: coachId
 *         required: true
 *         schema: { type: integer }
 *         description: ID del coach
 *     responses:
 *       200:
 *         description: Lista de asignaciones del coach
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/CoachTeamResponse' }
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Requiere rol COACH }
 *       500: { description: Error interno }
 */

/**
 * @swagger
 * /api/coach-team/:
 *   post:
 *     summary: Crear asignación coach–team
 *     description: Crea una nueva asignación entre un coach y un equipo. Requiere rol COACH.
 *     tags: [CoachTeams]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CreateCoachTeamRequest' }
 *     responses:
 *       201:
 *         description: Asignación creada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/CoachTeamResponse' }
 *       400:
 *         description: Datos inválidos o fechas inválidas (futuras o fin <= inicio)
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Requiere rol COACH }
 *       404:
 *         description: Coach o Team no encontrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       409:
 *         description: La relación coach–team ya existe (duplicada)
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       500: { description: Error interno }
 */

/**
 * @swagger
 * /api/coach-team/:
 *   put:
 *     summary: Actualizar asignación coach–team
 *     description: Actualiza fechas o cambia el coach/team asociado (valida duplicados y fechas). Requiere rol COACH.
 *     tags: [CoachTeams]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/UpdateCoachTeamRequest' }
 *     responses:
 *       200:
 *         description: Asignación actualizada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/CoachTeamResponse' }
 *       400:
 *         description: Datos inválidos o fechas inválidas (futuras o fin <= inicio)
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Requiere rol COACH }
 *       404:
 *         description: Asignación/Coach/Team no encontrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       409:
 *         description: La relación coach–team ya existe (duplicada)
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       500: { description: Error interno }
 */

/**
 * @swagger
 * /api/coach-team/{id}:
 *   delete:
 *     summary: Eliminar asignación
 *     description: Elimina una asignación por ID. Requiere rol COACH.
 *     tags: [CoachTeams]
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

/**
 * @swagger
 * /api/coach-team/status/{id}:
 *   patch:
 *     summary: Actualizar estado (activo/inactivo)
 *     description: Actualiza el campo de estado de la asignación. Requiere rol COACH.
 *     tags: [CoachTeams]
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
 *             schema: { $ref: '#/components/schemas/CoachTeamResponse' }
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Requiere rol COACH }
 *       404: { description: Asignación no encontrada }
 *       500: { description: Error interno }
 */