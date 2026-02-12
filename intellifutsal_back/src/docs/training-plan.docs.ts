/**
 * @swagger
 * components:
 *   schemas:
 *     TrainingPlanStatus:
 *       type: string
 *       description: Estado del plan de entrenamiento
 *       enum: [PENDING_APPROVAL, APPROVED, REJECTED, ARCHIVED]
 *
 *     CreateTrainingPlanRequest:
 *       type: object
 *       required: [title, description]
 *       properties:
 *         title:
 *           type: string
 *           description: Título del plan de entrenamiento
 *         description:
 *           type: string
 *           description: Descripción detallada del plan de entrenamiento
 *         difficulty:
 *           type: string
 *           description: Dificultad estimada (p. ej. EASY, MEDIUM, HARD)
 *         durationMinutes:
 *           type: integer
 *           description: Duración estimada del entrenamiento en minutos
 *         focusArea:
 *           type: string
 *           description: Área principal de enfoque (físico, táctico, etc.)
 *         clusterId:
 *           type: integer
 *           description: ID del cluster físico asociado (si aplica)
 *       example:
 *         title: "Plan de resistencia aeróbica"
 *         description: "Plan enfocado en mejorar la capacidad aeróbica en jugadores de medio campo..."
 *         difficulty: "MEDIUM"
 *         durationMinutes: 60
 *         focusArea: "physical"
 *         clusterId: 2
 *
 *     UpdateTrainingPlanStatusRequest:
 *       type: object
 *       properties:
 *         approvalComment:
 *           type: string
 *           description: Comentario del entrenador al aprobar o rechazar el plan
 *       example:
 *         approvalComment: "Plan aprobado, ajusta la carga en la semana 3 si hay fatiga."
 *
 *     TrainingPlanResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         createdByCoachId:
 *           type: integer
 *           nullable: true
 *         generatedByAi:
 *           type: boolean
 *         difficulty:
 *           type: string
 *           nullable: true
 *         durationMinutes:
 *           type: integer
 *           nullable: true
 *         focusArea:
 *           type: string
 *           nullable: true
 *         clusterId:
 *           type: integer
 *           nullable: true
 *         status:
 *           $ref: '#/components/schemas/TrainingPlanStatus'
 *         approvalComment:
 *           type: string
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         approvedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         rejectedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *       example:
 *         id: 7
 *         title: "Plan táctico 4-3-3 presión alta"
 *         description: "Plan orientado a implementar presión alta en bloque medio con transiciones rápidas..."
 *         createdByCoachId: 1
 *         generatedByAi: true
 *         difficulty: "MEDIUM"
 *         durationMinutes: 90
 *         focusArea: "team-tactical"
 *         clusterId: null
 *         status: "APPROVED"
 *         approvalComment: "Aprobado para el próximo microciclo"
 *         createdAt: "2025-05-20T14:22:10.000Z"
 *         approvedAt: "2025-05-21T10:10:00.000Z"
 *         rejectedAt: null
 */

/**
 * @swagger
 * tags:
 *   - name: TrainingPlans
 *     description: Gestión de planes de entrenamiento (manuales y generados por IA)
 */

/**
 * @swagger
 * /api/training-plan/:
 *   get:
 *     summary: Listar planes de entrenamiento
 *     description: Retorna todos los planes de entrenamiento registrados. Requiere rol COACH.
 *     tags: [TrainingPlans]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de planes de entrenamiento
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/TrainingPlanResponse' }
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Requiere rol COACH }
 *       500: { description: Error interno }
 */

/**
 * @swagger
 * /api/training-plan/{id}:
 *   get:
 *     summary: Obtener plan de entrenamiento por ID
 *     description: Retorna un plan de entrenamiento por su ID. Requiere rol COACH.
 *     tags: [TrainingPlans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: ID del plan de entrenamiento
 *     responses:
 *       200:
 *         description: Plan encontrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/TrainingPlanResponse' }
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Requiere rol COACH }
 *       404: { description: Plan no encontrado }
 *       500: { description: Error interno }
 */

/**
 * @swagger
 * /api/training-plan/manual:
 *   post:
 *     summary: Crear plan de entrenamiento manual
 *     description: Crea un nuevo plan de entrenamiento definido por el entrenador. Requiere rol COACH.
 *     tags: [TrainingPlans]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CreateTrainingPlanRequest' }
 *     responses:
 *       201:
 *         description: Plan creado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/TrainingPlanResponse' }
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
 * /api/training-plan/player/ai/{playerId}:
 *   post:
 *     summary: Generar plan de entrenamiento mediante IA para un jugador
 *     description: Genera un plan de entrenamiento personalizado usando IA para un jugador específico. Requiere rol COACH.
 *     tags: [TrainingPlans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: playerId
 *         required: true
 *         schema: { type: integer }
 *         description: ID del jugador objetivo
 *     responses:
 *       201:
 *         description: Plan generado por IA
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/TrainingPlanResponse' }
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Requiere rol COACH }
 *       404: { description: Jugador no encontrado }
 *       500: { description: Error interno o fallo en el servicio de IA }
 */

/**
 * @swagger
 * /api/training-plan/team/ai/{teamId}:
 *   post:
 *     summary: Generar plan de entrenamiento mediante IA para un equipo
 *     description: Genera un plan de entrenamiento táctico para un equipo completo usando IA. Requiere rol COACH.
 *     tags: [TrainingPlans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema: { type: integer }
 *         description: ID del equipo objetivo
 *     responses:
 *       201:
 *         description: Plan generado por IA
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/TrainingPlanResponse' }
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Requiere rol COACH }
 *       404: { description: Equipo no encontrado }
 *       500: { description: Error interno o fallo en el servicio de IA }
 */

/**
 * @swagger
 * /api/training-plan/approve/{id}:
 *   patch:
 *     summary: Aprobar plan de entrenamiento
 *     description: Cambia el estado de un plan a APPROVED. Requiere rol COACH.
 *     tags: [TrainingPlans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: ID del plan de entrenamiento
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/UpdateTrainingPlanStatusRequest' }
 *     responses:
 *       200:
 *         description: Plan aprobado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/TrainingPlanResponse' }
 *       400:
 *         description: Estado no válido para aprobar o datos inválidos
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Requiere rol COACH }
 *       404: { description: Plan no encontrado }
 *       500: { description: Error interno }
 */

/**
 * @swagger
 * /api/training-plan/reject/{id}:
 *   patch:
 *     summary: Rechazar plan de entrenamiento
 *     description: Cambia el estado de un plan a REJECTED. Requiere rol COACH.
 *     tags: [TrainingPlans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: ID del plan de entrenamiento
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/UpdateTrainingPlanStatusRequest' }
 *     responses:
 *       200:
 *         description: Plan rechazado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/TrainingPlanResponse' }
 *       400:
 *         description: Estado no válido para rechazar o datos inválidos
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Requiere rol COACH }
 *       404: { description: Plan no encontrado }
 *       500: { description: Error interno }
 */

/**
 * @swagger
 * /api/training-plan/archive/{id}:
 *   patch:
 *     summary: Archivar plan de entrenamiento
 *     description: Cambia el estado de un plan a ARCHIVED. Requiere rol COACH.
 *     tags: [TrainingPlans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: ID del plan de entrenamiento
 *     responses:
 *       200:
 *         description: Plan archivado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/TrainingPlanResponse' }
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Requiere rol COACH }
 *       404: { description: Plan no encontrado }
 *       500: { description: Error interno }
 */