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
 *         message: "Error en la predicción"
 *         status: 400
 *
 *     AiApiRequest:
 *       type: object
 *       description: Conjunto de características del jugador usadas por el servicio de IA
 *       properties:
 *         age: { type: number }
 *         weight: { type: number }
 *         height: { type: number }
 *         bmi: { type: number }
 *         highJump: { type: number }
 *         rightUnipodalJump: { type: number }
 *         leftUnipodalJump: { type: number }
 *         bipodalJump: { type: number }
 *         thirtyMetersTime: { type: number }
 *         thousandMetersTime: { type: number }
 *       example:
 *         age: 22
 *         weight: 75
 *         height: 180
 *         bmi: 23.1
 *         highJump: 55
 *         rightUnipodalJump: 45
 *         leftUnipodalJump: 44
 *         bipodalJump: 60
 *         thirtyMetersTime: 4.1
 *         thousandMetersTime: 210
 *
 *     PositionResponse:
 *       type: object
 *       properties:
 *         clusterId: { type: integer }
 *         clusterName: { type: string }
 *       example:
 *         clusterId: 3
 *         clusterName: "Defensas Centrales"
 *
 *     PhysicalConditionResponse:
 *       type: object
 *       properties:
 *         clusterId: { type: integer }
 *         clusterName: { type: string }
 *         description: { type: string }
 *         strengths:
 *           type: array
 *           items: { type: string }
 *         developmentAreas:
 *           type: array
 *           items: { type: string }
 *         trainingRecommendations:
 *           type: array
 *           items: { type: string }
 *       example:
 *         clusterId: 5
 *         clusterName: "Atletas Explosivos"
 *         description: "Alta potencia y aceleración"
 *         strengths: ["Aceleración", "Potencia"]
 *         developmentAreas: ["Resistencia aeróbica"]
 *         trainingRecommendations: ["Intervalos HIIT", "Fuerza de tren inferior"]
 *
 *     AiApiPositionResponse:
 *       type: object
 *       properties:
 *         clusterId: { type: integer }
 *         clusterName: { type: string }
 *         features:
 *           $ref: '#/components/schemas/AiApiRequest'
 *         success: { type: boolean }
 *       example:
 *         clusterId: 2
 *         clusterName: "Laterales Ofensivos"
 *         features: { age: 21, weight: 70, height: 176, bmi: 22.6, highJump: 50, rightUnipodalJump: 42, leftUnipodalJump: 41, bipodalJump: 58, thirtyMetersTime: 4.0, thousandMetersTime: 205 }
 *         success: true
 *
 *     AiApiPhysicalResponse:
 *       type: object
 *       properties:
 *         clusterId: { type: integer }
 *         clusterName: { type: string }
 *         description: { type: string }
 *         developmentAreas:
 *           type: array
 *           items: { type: string }
 *         strengths:
 *           type: array
 *           items: { type: string }
 *         trainingRecommendations:
 *           type: array
 *           items: { type: string }
 *         features:
 *           $ref: '#/components/schemas/AiApiRequest'
 *         success: { type: boolean }
 *       example:
 *         clusterId: 5
 *         clusterName: "Atletas de Resistencia"
 *         description: "Alto rendimiento cardiovascular"
 *         developmentAreas: ["Fuerza máxima"]
 *         strengths: ["Resistencia", "Recuperación"]
 *         trainingRecommendations: ["Sesiones largas zona 2"]
 *         features: { age: 24, weight: 74, height: 178, bmi: 23.4, highJump: 48, rightUnipodalJump: 40, leftUnipodalJump: 39, bipodalJump: 56, thirtyMetersTime: 4.2, thousandMetersTime: 200 }
 *         success: true
 *
 *     AiApiAnalyzeResponse:
 *       type: object
 *       properties:
 *         analysis: { type: string }
 *         physicalCategory: { type: integer }
 *         physicalName: { type: string }
 *         positionCategory: { type: integer }
 *         positionName: { type: string }
 *         generalAnalysis: { type: string }
 *         strengths:
 *           type: array
 *           items: { type: string }
 *         weaknesses:
 *           type: array
 *           items: { type: string }
 *         trainingRecommendations:
 *           type: array
 *           items: { type: string }
 *         performanceProfile: { type: string }
 *         rawAnalysis: { type: string }
 *         rawFeatures:
 *           $ref: '#/components/schemas/AiApiRequest'
 *         success: { type: boolean }
 *       example:
 *         analysis: "Jugador con gran lectura de juego"
 *         physicalCategory: 5
 *         physicalName: "Explosivo"
 *         positionCategory: 3
 *         positionName: "Defensa Central"
 *         generalAnalysis: "Sólido en duelos, buena salida"
 *         strengths: ["Anticipación", "Juego aéreo"]
 *         weaknesses: ["Velocidad punta"]
 *         trainingRecommendations: ["Pliometría", "Sprints cortos"]
 *         performanceProfile: "Potente en 0-5m, estable en 1000m"
 *         rawAnalysis: "..."
 *         rawFeatures: { age: 23, weight: 78, height: 184, bmi: 23.0, highJump: 55, rightUnipodalJump: 43, leftUnipodalJump: 43, bipodalJump: 62, thirtyMetersTime: 4.2, thousandMetersTime: 215 }
 *         success: true
 *
 *     AiApiFullRecommendationsResponse:
 *       type: object
 *       properties:
 *         position:
 *           $ref: '#/components/schemas/PositionResponse'
 *         physicalCondition:
 *           $ref: '#/components/schemas/PhysicalConditionResponse'
 *         specificRecommendations:
 *           type: array
 *           items: { type: string }
 *         features:
 *           $ref: '#/components/schemas/AiApiRequest'
 *         success: { type: boolean }
 *       example:
 *         position: { clusterId: 2, clusterName: "Lateral Derecho" }
 *         physicalCondition:
 *           clusterId: 5
 *           clusterName: "Atletas Explosivos"
 *           description: "Alta potencia"
 *           strengths: ["Salida rápida"]
 *           developmentAreas: ["Resistencia larga"]
 *           trainingRecommendations: ["Sprints repetidos", "Fuerza excéntrica"]
 *         specificRecommendations: ["Trabajar centro tenso", "Mejorar timing de proyección"]
 *         features: { age: 20, weight: 69, height: 175, bmi: 22.5, highJump: 52, rightUnipodalJump: 41, leftUnipodalJump: 40, bipodalJump: 57, thirtyMetersTime: 3.9, thousandMetersTime: 198 }
 *         success: true
 *
 *     PlayerPositionResultsResponse:
 *       type: object
 *       properties:
 *         playerId: { type: integer }
 *         playerName: { type: string }
 *         clusterId: { type: integer }
 *         clusterName: { type: string }
 *         features:
 *           $ref: '#/components/schemas/AiApiRequest'
 *       example:
 *         playerId: 123
 *         playerName: "Juan Pérez"
 *         clusterId: 3
 *         clusterName: "Defensas Centrales"
 *         features: { age: 23, weight: 78, height: 184, bmi: 23.0, highJump: 55, rightUnipodalJump: 43, leftUnipodalJump: 43, bipodalJump: 62, thirtyMetersTime: 4.2, thousandMetersTime: 215 }
 *
 *     PlayerPhysicalResultsResponse:
 *       type: object
 *       properties:
 *         playerId: { type: integer }
 *         playerName: { type: string }
 *         clusterId: { type: integer }
 *         clusterName: { type: string }
 *         description: { type: string }
 *         developmentAreas:
 *           type: array
 *           items: { type: string }
 *         strengths:
 *           type: array
 *           items: { type: string }
 *         trainingRecommendations:
 *           type: array
 *           items: { type: string }
 *         features:
 *           $ref: '#/components/schemas/AiApiRequest'
 *       example:
 *         playerId: 123
 *         playerName: "Juan Pérez"
 *         clusterId: 5
 *         clusterName: "Atletas Explosivos"
 *         description: "Alta aceleración y potencia"
 *         developmentAreas: ["Capacidad aeróbica"]
 *         strengths: ["Primeros metros"]
 *         trainingRecommendations: ["Sprints repetidos", "Fuerza máxima"]
 *         features: { age: 23, weight: 78, height: 184, bmi: 23.0, highJump: 55, rightUnipodalJump: 43, leftUnipodalJump: 43, bipodalJump: 62, thirtyMetersTime: 4.2, thousandMetersTime: 215 }
 *
 *     TeamErrorResponse:
 *       type: object
 *       properties:
 *         playerIndex: { type: integer }
 *         playerName: { type: string }
 *         error: { type: string }
 *       example:
 *         playerIndex: 2
 *         playerName: "Carlos Ruiz"
 *         error: "Datos incompletos"
 *
 *     AiApiTeamPositionsResponse:
 *       type: object
 *       properties:
 *         teamName: { type: string }
 *         results:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PlayerPositionResultsResponse'
 *         totalPlayers: { type: integer }
 *         processedPlayers: { type: integer }
 *         success: { type: boolean }
 *         failedPlayers: { type: integer }
 *         errors:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/TeamErrorResponse'
 *       example:
 *         teamName: "Juvenil A"
 *         results: []
 *         totalPlayers: 18
 *         processedPlayers: 18
 *         success: true
 *         failedPlayers: 0
 *         errors: []
 *
 *     AiApiTeamPhysicalResponse:
 *       type: object
 *       properties:
 *         teamName: { type: string }
 *         results:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PlayerPhysicalResultsResponse'
 *         totalPlayers: { type: integer }
 *         processedPlayers: { type: integer }
 *         success: { type: boolean }
 *         failedPlayers: { type: integer }
 *         errors:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/TeamErrorResponse'
 *       example:
 *         teamName: "Juvenil A"
 *         results: []
 *         totalPlayers: 18
 *         processedPlayers: 18
 *         success: true
 *         failedPlayers: 0
 *         errors: []
 *
 * security:
 *   - bearerAuth: []
 */

/**
 * @swagger
 * /api/ai/predict-position/{id}:
 *   post:
 *     summary: Predice el cluster/posición para un jugador
 *     description: Obtiene el cluster de posición estimado a partir de las características del jugador.
 *     tags: [AI Predictions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: ID único del jugador
 *     responses:
 *       200:
 *         description: Predicción de posición
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AiApiPositionResponse'
 *       400:
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Rol insuficiente (requiere COACH o PLAYER) }
 *       404: { description: Jugador no encontrado }
 *       500: { description: Error interno }
 */

/**
 * @swagger
 * /api/ai/predict-physical/{id}:
 *   post:
 *     summary: Predice el perfil físico de un jugador
 *     description: Devuelve el cluster físico y recomendaciones de entrenamiento.
 *     tags: [AI Predictions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: ID único del jugador
 *     responses:
 *       200:
 *         description: Predicción física
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AiApiPhysicalResponse'
 *       400:
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Rol insuficiente (requiere COACH o PLAYER) }
 *       404: { description: Jugador no encontrado }
 *       500: { description: Error interno }
 */

/**
 * @swagger
 * /api/ai/analyze-prediction/{id}:
 *   post:
 *     summary: Análisis detallado de un jugador
 *     description: Fortalezas, debilidades, recomendaciones y perfiles derivados.
 *     tags: [AI Analysis]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: ID único del jugador
 *     responses:
 *       200:
 *         description: Análisis completado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AiApiAnalyzeResponse'
 *       400:
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Rol insuficiente (requiere COACH o PLAYER) }
 *       404: { description: Jugador no encontrado }
 *       500: { description: Error interno }
 */

/**
 * @swagger
 * /api/ai/team/analyze-prediction/{id}:
 *   post:
 *     summary: Analiza el rendimiento de todo el equipo
 *     description: Devuelve un arreglo con el análisis por jugador del equipo indicado (solo entrenadores).
 *     tags: [AI Team Analysis]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: ID único del equipo
 *     responses:
 *       200:
 *         description: Análisis de equipo por jugador
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AiApiAnalyzeResponse'
 *       400:
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Solo entrenadores (COACH) }
 *       404: { description: Equipo no encontrado }
 *       500: { description: Error interno }
 */

/**
 * @swagger
 * /api/ai/full-recommendations-prediction/{id}:
 *   post:
 *     summary: Recomendaciones completas para un jugador
 *     description: Une posición sugerida, condición física y recomendaciones específicas.
 *     tags: [AI Recommendations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: ID único del jugador
 *     responses:
 *       200:
 *         description: Recomendaciones generadas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AiApiFullRecommendationsResponse'
 *       400:
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Rol insuficiente (requiere COACH o PLAYER) }
 *       404: { description: Jugador no encontrado }
 *       500: { description: Error interno }
 */

/**
 * @swagger
 * /api/ai/team/predict-positions/{id}:
 *   post:
 *     summary: Predice posiciones para todo el equipo
 *     description: Devuelve el cluster de posición por jugador y métricas agregadas (solo entrenadores).
 *     tags: [AI Team Predictions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: ID único del equipo
 *     responses:
 *       200:
 *         description: Predicciones de posiciones por jugador
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AiApiTeamPositionsResponse'
 *       400:
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Solo entrenadores (COACH) }
 *       404: { description: Equipo no encontrado }
 *       500: { description: Error interno }
 */

/**
 * @swagger
 * /api/ai/team/predict-physical/{id}:
 *   post:
 *     summary: Predice perfil físico para todo el equipo
 *     description: Devuelve resultados físicos y recomendaciones por jugador (solo entrenadores).
 *     tags: [AI Team Predictions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: ID único del equipo
 *     responses:
 *       200:
 *         description: Predicciones físicas por jugador
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AiApiTeamPhysicalResponse'
 *       400:
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Solo entrenadores (COACH) }
 *       404: { description: Equipo no encontrado }
 *       500: { description: Error interno }
 */