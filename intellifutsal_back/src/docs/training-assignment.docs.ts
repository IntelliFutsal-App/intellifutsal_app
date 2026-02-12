/**
 * @swagger
 * components:
 *   schemas:
 *     TrainingAssignmentStatus:
 *       type: string
 *       description: Estado de la asignación de entrenamiento
 *       enum: [PENDING, ACTIVE, COMPLETED, CANCELLED]
 *
 *     CreateTrainingAssignmentRequest:
 *       type: object
 *       required: [trainingPlanId]
 *       properties:
 *         trainingPlanId:
 *           type: integer
 *           description: ID del plan de entrenamiento a asignar
 *         playerId:
 *           type: integer
 *           description: ID del jugador (si es una asignación individual)
 *         teamId:
 *           type: integer
 *           description: ID del equipo (si es una asignación grupal)
 *         startDate:
 *           type: string
 *           format: date-time
 *           description: Fecha de inicio de la asignación
 *         endDate:
 *           type: string
 *           format: date-time
 *           description: Fecha de fin de la asignación
 *       example:
 *         trainingPlanId: 5
 *         playerId: 12
 *         startDate: "2025-05-20T08:00:00.000Z"
 *         endDate: "2025-06-20T08:00:00.000Z"
 *
 *     TrainingAssignmentResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         trainingPlanId:
 *           type: integer
 *         playerId:
 *           type: integer
 *           nullable: true
 *         teamId:
 *           type: integer
 *           nullable: true
 *         assignedByCoachId:
 *           type: integer
 *           nullable: true
 *         status:
 *           $ref: '#/components/schemas/TrainingAssignmentStatus'
 *         startDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         endDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         approvedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         cancelledAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *       example:
 *         id: 10
 *         trainingPlanId: 5
 *         playerId: 12
 *         teamId: null
 *         assignedByCoachId: 1
 *         status: "ACTIVE"
 *         startDate: "2025-05-20T08:00:00.000Z"
 *         endDate: "2025-06-20T08:00:00.000Z"
 *         approvedAt: "2025-05-19T10:00:00.000Z"
 *         cancelledAt: null
 *         createdAt: "2025-05-19T09:30:00.000Z"
 */

/**
 * @swagger
 * tags:
 *   - name: TrainingAssignments
 *     description: Asignación de planes de entrenamiento a jugadores y equipos
 */

/**
 * @swagger
 * /api/training-assignment/player/me:
 *   get:
 *     summary: Listar asignaciones del jugador autenticado
 *     description: Retorna las asignaciones de entrenamiento del jugador autenticado. Requiere rol PLAYER.
 *     tags: [TrainingAssignments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de asignaciones del jugador
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/TrainingAssignmentResponse' }
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Requiere rol PLAYER }
 *       500: { description: Error interno }
 */

/**
 * @swagger
 * /api/training-assignment/team/{teamId}:
 *   get:
 *     summary: Listar asignaciones de un equipo
 *     description: Retorna las asignaciones de entrenamiento asociadas a un equipo. Requiere rol COACH.
 *     tags: [TrainingAssignments]
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
 *         description: Lista de asignaciones del equipo
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/TrainingAssignmentResponse' }
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Requiere rol COACH }
 *       404: { description: Equipo no encontrado }
 *       500: { description: Error interno }
 */

/**
 * @swagger
 * /api/training-assignment/{id}:
 *   get:
 *     summary: Obtener asignación por ID
 *     description: Retorna una asignación de entrenamiento por su ID. Requiere rol COACH o PLAYER.
 *     tags: [TrainingAssignments]
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
 *             schema: { $ref: '#/components/schemas/TrainingAssignmentResponse' }
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Rol insuficiente }
 *       404: { description: Asignación no encontrada }
 *       500: { description: Error interno }
 */

/**
 * @swagger
 * /api/training-assignment/:
 *   post:
 *     summary: Crear asignación de entrenamiento
 *     description: Crea una nueva asignación de un plan de entrenamiento a un jugador o equipo. Requiere rol COACH.
 *     tags: [TrainingAssignments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CreateTrainingAssignmentRequest' }
 *     responses:
 *       201:
 *         description: Asignación creada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/TrainingAssignmentResponse' }
 *       400:
 *         description: Datos inválidos o sin jugador/equipo asignado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Requiere rol COACH }
 *       404:
 *         description: Plan, jugador o equipo no encontrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       500: { description: Error interno }
 */

/**
 * @swagger
 * /api/training-assignment/activate/{id}:
 *   patch:
 *     summary: Activar asignación de entrenamiento
 *     description: Cambia el estado de una asignación a ACTIVE. Requiere rol COACH.
 *     tags: [TrainingAssignments]
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
 *         description: Asignación activada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/TrainingAssignmentResponse' }
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Requiere rol COACH }
 *       404: { description: Asignación no encontrada }
 *       500: { description: Error interno }
 */

/**
 * @swagger
 * /api/training-assignment/cancel/{id}:
 *   patch:
 *     summary: Cancelar asignación de entrenamiento
 *     description: Cambia el estado de una asignación a CANCELLED. Requiere rol COACH.
 *     tags: [TrainingAssignments]
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
 *         description: Asignación cancelada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/TrainingAssignmentResponse' }
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Requiere rol COACH }
 *       404: { description: Asignación no encontrada }
 *       500: { description: Error interno }
 */