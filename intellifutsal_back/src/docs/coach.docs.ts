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
 *           description: Estado activo/inactivo
 *       example:
 *         status: false
 *
 *     CreateCoachRequest:
 *       type: object
 *       required: [firstName, lastName, birthDate, expYears, specialty, credentialId]
 *       properties:
 *         firstName: { type: string }
 *         lastName:  { type: string }
 *         birthDate:
 *           type: string
 *           format: date-time
 *           description: Fecha de nacimiento en ISO 8601
 *         expYears:
 *           type: number
 *           description: Años de experiencia
 *         specialty:
 *           type: string
 *           description: Especialidad (p. ej. "Fuerza", "Táctica")
 *         credentialId:
 *           type: integer
 *           description: ID de la credencial existente con rol COACH
 *       example:
 *         firstName: "Pep"
 *         lastName: "Guardiola"
 *         birthDate: "1971-01-18T00:00:00.000Z"
 *         expYears: 20
 *         specialty: "Táctica"
 *         credentialId: 55
 *
 *     UpdateCoachRequest:
 *       type: object
 *       required: [id]
 *       properties:
 *         id: { type: integer }
 *         firstName: { type: string }
 *         lastName:  { type: string }
 *         birthDate: { type: string, format: date-time }
 *         expYears: { type: number }
 *         specialty: { type: string }
 *       example:
 *         id: 10
 *         expYears: 21
 *         specialty: "Gestión de grupo"
 *
 *     CoachResponse:
 *       type: object
 *       properties:
 *         id: { type: integer }
 *         firstName: { type: string }
 *         lastName:  { type: string }
 *         birthDate: { type: string, format: date-time }
 *         expYears: { type: number }
 *         specialty: { type: string }
 *         credentialId: { type: integer }
 *         status: { type: boolean }
 *       example:
 *         id: 10
 *         firstName: "Pep"
 *         lastName: "Guardiola"
 *         birthDate: "1971-01-18T00:00:00.000Z"
 *         expYears: 21
 *         specialty: "Táctica"
 *         credentialId: 55
 *         status: true
 *
 * security:
 *   - bearerAuth: []
 */

/**
 * @swagger
 * tags:
 *   - name: Coaches
 *     description: Gestión de entrenadores (solo rol COACH)
 */

/**
 * @swagger
 * /api/coach/:
 *   get:
 *     summary: Listar coaches activos
 *     description: Retorna todos los entrenadores activos. Requiere rol COACH.
 *     tags: [Coaches]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de coaches activos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/CoachResponse' }
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Requiere rol COACH }
 *       500: { description: Error interno }
 */

/**
 * @swagger
 * /api/coach/inactive:
 *   get:
 *     summary: Listar coaches (incluye inactivos)
 *     description: Retorna todos los entrenadores, activos e inactivos. Requiere rol COACH.
 *     tags: [Coaches]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de coaches (activos e inactivos)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/CoachResponse' }
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Requiere rol COACH }
 *       500: { description: Error interno }
 */

/**
 * @swagger
 * /api/coach/{id}:
 *   get:
 *     summary: Obtener coach por ID (solo activos)
 *     description: Retorna un entrenador activo por su ID. Requiere rol COACH.
 *     tags: [Coaches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: ID del entrenador
 *     responses:
 *       200:
 *         description: Coach encontrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/CoachResponse' }
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Requiere rol COACH }
 *       404: { description: Coach no encontrado }
 *       500: { description: Error interno }
 */

/**
 * @swagger
 * /api/coach/inactive/{id}:
 *   get:
 *     summary: Obtener coach por ID (incluye inactivos)
 *     description: Retorna un entrenador por su ID, aunque esté inactivo. Requiere rol COACH.
 *     tags: [Coaches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: ID del entrenador
 *     responses:
 *       200:
 *         description: Coach encontrado (activo o inactivo)
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/CoachResponse' }
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Requiere rol COACH }
 *       404: { description: Coach no encontrado }
 *       500: { description: Error interno }
 */

/**
 * @swagger
 * /api/coach/:
 *   post:
 *     summary: Crear coach
 *     description: Crea un nuevo entrenador asociado a una credencial existente con rol COACH. Requiere rol COACH.
 *     tags: [Coaches]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CreateCoachRequest' }
 *     responses:
 *       201:
 *         description: Coach creado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/CoachResponse' }
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Requiere rol COACH }
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
 * /api/coach/:
 *   put:
 *     summary: Actualizar coach
 *     description: Actualiza datos de un entrenador existente. Requiere rol COACH.
 *     tags: [Coaches]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/UpdateCoachRequest' }
 *     responses:
 *       200:
 *         description: Coach actualizado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/CoachResponse' }
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Requiere rol COACH }
 *       404: { description: Coach no encontrado }
 *       500: { description: Error interno }
 */

/**
 * @swagger
 * /api/coach/{id}:
 *   delete:
 *     summary: Eliminar coach
 *     description: Elimina un entrenador por ID. Requiere rol COACH.
 *     tags: [Coaches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: ID del entrenador
 *     responses:
 *       204:
 *         description: Eliminado sin contenido
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Requiere rol COACH }
 *       404: { description: Coach no encontrado }
 *       500: { description: Error interno }
 */

/**
 * @swagger
 * /api/coach/status/{id}:
 *   patch:
 *     summary: Actualizar estado (activo/inactivo)
 *     description: Actualiza el campo de estado del entrenador. Requiere rol COACH.
 *     tags: [Coaches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: ID del entrenador
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/UpdateStatusRequest' }
 *     responses:
 *       200:
 *         description: Coach actualizado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/CoachResponse' }
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Requiere rol COACH }
 *       404: { description: Coach no encontrado }
 *       500: { description: Error interno }
 */