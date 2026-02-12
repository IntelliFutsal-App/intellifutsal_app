/**
 * @swagger
 * components:
 *   schemas:
 *     CreateTrainingProgressRequest:
 *       type: object
 *       required: [trainingAssignmentId, progressDate, completionPercentage]
 *       properties:
 *         trainingAssignmentId:
 *           type: integer
 *           description: ID de la asignación de entrenamiento
 *         progressDate:
 *           type: string
 *           format: date-time
 *           description: Fecha en la que se reporta el progreso
 *         completionPercentage:
 *           type: integer
 *           minimum: 0
 *           maximum: 100
 *           description: Porcentaje de avance del plan (0 - 100)
 *         notes:
 *           type: string
 *           description: Notas adicionales del jugador sobre el progreso
 *       example:
 *         trainingAssignmentId: 10
 *         progressDate: "2025-05-25T09:00:00.000Z"
 *         completionPercentage: 40
 *         notes: "He realizado las sesiones de fuerza y resistencia indicadas"
 *
 *     VerifyTrainingProgressRequest:
 *       type: object
 *       properties:
 *         verificationComment:
 *           type: string
 *           description: Comentario del entrenador al verificar el progreso
 *       example:
 *         verificationComment: "Progreso consistente, continuar con el plan actual"
 *
 *     TrainingProgressResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         trainingAssignmentId:
 *           type: integer
 *         recordedByPlayerId:
 *           type: integer
 *           nullable: true
 *         recordedByCoachId:
 *           type: integer
 *           nullable: true
 *         progressDate:
 *           type: string
 *           format: date-time
 *         completionPercentage:
 *           type: integer
 *         notes:
 *           type: string
 *           nullable: true
 *         coachVerified:
 *           type: boolean
 *         verifiedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         verificationComment:
 *           type: string
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *       example:
 *         id: 3
 *         trainingAssignmentId: 10
 *         recordedByPlayerId: 12
 *         recordedByCoachId: null
 *         progressDate: "2025-05-25T09:00:00.000Z"
 *         completionPercentage: 40
 *         notes: "He realizado las primeras 2 sesiones"
 *         coachVerified: false
 *         verifiedAt: null
 *         verificationComment: null
 *         createdAt: "2025-05-25T09:05:00.000Z"
 */

/**
 * @swagger
 * tags:
 *   - name: TrainingProgress
 *     description: Registro y verificación del progreso de los planes de entrenamiento
 */

/**
 * @swagger
 * /api/training-progress/assignment/{assignmentId}:
 *   get:
 *     summary: Listar progreso de una asignación
 *     description: Retorna el historial de progreso para una asignación de entrenamiento. Requiere rol COACH o PLAYER.
 *     tags: [TrainingProgress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         schema: { type: integer }
 *         description: ID de la asignación
 *     responses:
 *       200:
 *         description: Lista de registros de progreso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/TrainingProgressResponse' }
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Rol insuficiente }
 *       404: { description: Asignación no encontrada }
 *       500: { description: Error interno }
 */

/**
 * @swagger
 * /api/training-progress/player:
 *   post:
 *     summary: Registrar progreso de una asignación (jugador)
 *     description: Permite al jugador autenticado registrar su progreso sobre una asignación activa. Requiere rol PLAYER.
 *     tags: [TrainingProgress]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CreateTrainingProgressRequest' }
 *     responses:
 *       201:
 *         description: Progreso registrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/TrainingProgressResponse' }
 *       400:
 *         description: Datos inválidos o asignación no activa
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       401: { description: No autorizado - Token requerido }
 *       403:
 *         description: Acceso denegado - Requiere rol PLAYER o la asignación no pertenece al jugador
 *       404:
 *         description: Asignación no encontrada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       500: { description: Error interno }
 */

/**
 * @swagger
 * /api/training-progress/verify/{id}:
 *   patch:
 *     summary: Verificar progreso de una asignación (entrenador)
 *     description: Permite al entrenador verificar el progreso reportado por el jugador. Si el progreso verificado llega al 100%, la asignación se marca como COMPLETED. Requiere rol COACH.
 *     tags: [TrainingProgress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: ID del registro de progreso
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/VerifyTrainingProgressRequest' }
 *     responses:
 *       200:
 *         description: Progreso verificado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/TrainingProgressResponse' }
 *       400:
 *         description: Datos inválidos o asignación en estado no permitido
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       401: { description: No autorizado - Token requerido }
 *       403:
 *         description: Acceso denegado - Requiere rol COACH o la asignación pertenece a otro entrenador
 *       404:
 *         description: Progreso o asignación no encontrados
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       500: { description: Error interno }
 */