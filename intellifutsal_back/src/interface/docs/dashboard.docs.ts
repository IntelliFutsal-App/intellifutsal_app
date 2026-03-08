/**
 * @swagger
 * components:
 *   schemas:
 *     CountByStatus:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           description: Estado (enum serializado a string)
 *         count:
 *           type: integer
 *           description: Cantidad de registros en ese estado
 *       example:
 *         status: "PENDING"
 *         count: 5
 *
 *     TimeSeriesPoint:
 *       type: object
 *       properties:
 *         date:
 *           type: string
 *           description: Fecha en formato YYYY-MM-DD
 *           example: "2026-02-01"
 *         count:
 *           type: integer
 *           example: 12
 *
 *     PositionDistribution:
 *       type: object
 *       properties:
 *         position:
 *           type: string
 *           description: Posición del jugador (enum serializado a string)
 *           example: "PIVOT"
 *         count:
 *           type: integer
 *           example: 6
 *
 *     TeamMini:
 *       type: object
 *       properties:
 *         id: { type: integer }
 *         name: { type: string }
 *         category: { type: string }
 *         playerCount:
 *           type: integer
 *           description: Cantidad de jugadores activos en el equipo
 *         averageAge:
 *           type: number
 *           format: float
 *           description: Edad promedio de los jugadores activos en el equipo
 *       example:
 *         id: 7
 *         name: "IntelliFutsal FC"
 *         category: "Senior"
 *         playerCount: 14
 *         averageAge: 23.6
 *
 *     CoachDashboardResponse:
 *       type: object
 *       properties:
 *         activeTeamsCount:
 *           type: integer
 *           description: Cantidad de equipos activos donde el coach está asignado
 *         activePlayersCount:
 *           type: integer
 *           description: Cantidad total de jugadores activos (sumado) en los equipos del coach
 *         pendingJoinRequestsCount:
 *           type: integer
 *           description: Cantidad total de solicitudes de unión pendientes en los equipos del coach
 *
 *         activeAssignmentsCount:
 *           type: integer
 *         completedAssignmentsCount:
 *           type: integer
 *         cancelledAssignmentsCount:
 *           type: integer
 *
 *         progressTotalCount:
 *           type: integer
 *           description: Total de registros de progreso asociados a asignaciones del coach o sus equipos
 *         coachVerifiedCount:
 *           type: integer
 *           description: Total de progresos verificados por coach
 *         coachVerificationRate:
 *           type: number
 *           format: float
 *           description: Porcentaje de progreso verificado (0..100)
 *
 *         teams:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/TeamMini'
 *
 *         joinRequestsByStatus:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CountByStatus'
 *
 *         trainingPlansByStatus:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CountByStatus'
 *
 *         trainingPlansByOrigin:
 *           type: array
 *           description: Distribución de planes por origen (AI vs MANUAL)
 *           items:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: Origen del plan
 *                 enum: ["AI", "MANUAL"]
 *               count:
 *                 type: integer
 *             example:
 *               status: "AI"
 *               count: 8
 *
 *         assignmentsByStatus:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CountByStatus'
 *
 *         progressLast14Days:
 *           type: array
 *           description: Conteo de progresos registrados por día (últimos 14 días)
 *           items:
 *             $ref: '#/components/schemas/TimeSeriesPoint'
 *
 *         assignmentsLast14Days:
 *           type: array
 *           description: Conteo de asignaciones creadas por día (últimos 14 días)
 *           items:
 *             $ref: '#/components/schemas/TimeSeriesPoint'
 *
 *         positionsDistribution:
 *           type: array
 *           description: Distribución de posiciones de jugadores activos en equipos del coach
 *           items:
 *             $ref: '#/components/schemas/PositionDistribution'
 *       example:
 *         activeTeamsCount: 2
 *         activePlayersCount: 22
 *         pendingJoinRequestsCount: 3
 *         activeAssignmentsCount: 5
 *         completedAssignmentsCount: 12
 *         cancelledAssignmentsCount: 1
 *         progressTotalCount: 48
 *         coachVerifiedCount: 19
 *         coachVerificationRate: 39.58
 *         teams:
 *           - id: 7
 *             name: "IntelliFutsal FC"
 *             category: "Senior"
 *             playerCount: 14
 *             averageAge: 23.6
 *           - id: 9
 *             name: "Endava Futsal"
 *             category: "U-21"
 *             playerCount: 8
 *             averageAge: 20.1
 *         joinRequestsByStatus:
 *           - status: "PENDING"
 *             count: 3
 *           - status: "APPROVED"
 *             count: 10
 *         trainingPlansByStatus:
 *           - status: "PENDING_APPROVAL"
 *             count: 2
 *           - status: "APPROVED"
 *             count: 6
 *         trainingPlansByOrigin:
 *           - status: "AI"
 *             count: 5
 *           - status: "MANUAL"
 *             count: 3
 *         assignmentsByStatus:
 *           - status: "ACTIVE"
 *             count: 5
 *           - status: "COMPLETED"
 *             count: 12
 *         progressLast14Days:
 *           - date: "2026-01-22"
 *             count: 2
 *           - date: "2026-01-23"
 *             count: 4
 *         assignmentsLast14Days:
 *           - date: "2026-01-25"
 *             count: 1
 *         positionsDistribution:
 *           - position: "PIVOT"
 *             count: 6
 *           - position: "ALA"
 *             count: 10
 *
 *     PlayerDashboardResponse:
 *       type: object
 *       properties:
 *         activeTeamsCount:
 *           type: integer
 *           description: Cantidad de equipos activos donde el jugador está asociado
 *         pendingJoinRequestsCount:
 *           type: integer
 *           description: Cantidad de solicitudes pendientes del jugador
 *
 *         activeAssignmentsCount:
 *           type: integer
 *         completedAssignmentsCount:
 *           type: integer
 *         cancelledAssignmentsCount:
 *           type: integer
 *
 *         progressTotalCount:
 *           type: integer
 *         coachVerifiedCount:
 *           type: integer
 *         coachVerificationRate:
 *           type: number
 *           format: float
 *
 *         avgCompletionLast30Days:
 *           type: number
 *           format: float
 *           description: Promedio de completionPercentage en los últimos 30 días
 *
 *         teams:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/TeamMini'
 *
 *         joinRequestsByStatus:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CountByStatus'
 *
 *         assignmentsByStatus:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CountByStatus'
 *
 *         progressLast30Days:
 *           type: array
 *           description: Conteo de progresos registrados por día (últimos 30 días)
 *           items:
 *             $ref: '#/components/schemas/TimeSeriesPoint'
 *       example:
 *         activeTeamsCount: 1
 *         pendingJoinRequestsCount: 1
 *         activeAssignmentsCount: 2
 *         completedAssignmentsCount: 4
 *         cancelledAssignmentsCount: 0
 *         progressTotalCount: 11
 *         coachVerifiedCount: 6
 *         coachVerificationRate: 54.55
 *         avgCompletionLast30Days: 71.33
 *         teams:
 *           - id: 7
 *             name: "IntelliFutsal FC"
 *             category: "Senior"
 *             playerCount: 14
 *             averageAge: 23.6
 *         joinRequestsByStatus:
 *           - status: "PENDING"
 *             count: 1
 *           - status: "APPROVED"
 *             count: 2
 *         assignmentsByStatus:
 *           - status: "ACTIVE"
 *             count: 2
 *           - status: "COMPLETED"
 *             count: 4
 *         progressLast30Days:
 *           - date: "2026-01-10"
 *             count: 1
 *           - date: "2026-01-11"
 *             count: 2
 *
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
 *         message: "No autorizado"
 *         status: 401
 */

/**
 * @swagger
 * tags:
 *   - name: Dashboard
 *     description: Métricas y estadísticas para dashboards (COACH / PLAYER)
 */

/**
 * @swagger
 * /api/dashboard/coach:
 *   get:
 *     summary: Dashboard para COACH
 *     description: >
 *       Retorna métricas agregadas y series de datos (listas) para construir gráficos en el dashboard del COACH.
 *       Los datos se calculan en tiempo de ejecución a partir de los equipos activos donde el coach está asignado
 *       y sus recursos relacionados (join requests, training plans, assignments, progress).
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard del COACH generado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CoachDashboardResponse'
 *       401:
 *         description: No autorizado - Token requerido o inválido
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       403:
 *         description: Acceso denegado - Rol no permitido (solo COACH)
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       404:
 *         description: Recurso no encontrado (credencial o coach no existe)
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       500:
 *         description: Error interno
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */

/**
 * @swagger
 * /api/dashboard/player:
 *   get:
 *     summary: Dashboard para PLAYER
 *     description: >
 *       Retorna métricas agregadas y series de datos (listas) para construir gráficos en el dashboard del PLAYER.
 *       Los datos se calculan en tiempo de ejecución a partir de los equipos activos del jugador, sus solicitudes
 *       de unión, asignaciones y registros de progreso.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard del PLAYER generado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PlayerDashboardResponse'
 *       401:
 *         description: No autorizado - Token requerido o inválido
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       403:
 *         description: Acceso denegado - Rol no permitido (solo PLAYER)
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       404:
 *         description: Recurso no encontrado (credencial o player no existe)
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       500:
 *         description: Error interno
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */