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
 *     CreateUserRequest:
 *       type: object
 *       required: [email, password, role]
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           format: password
 *         role:
 *           type: string
 *           description: Rol del usuario (p.ej. COACH, PLAYER)
 *       example:
 *         email: "user@example.com"
 *         password: "Str0ngP@ss!"
 *         role: "PLAYER"
 *
 *     UpdateUserRequest:
 *       type: object
 *       required: [id]
 *       properties:
 *         id:
 *           type: integer
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           format: password
 *       example:
 *         id: 12
 *         email: "nuevo@example.com"
 *         password: "N3wStr0ngP@ss!"
 *
 *     UpdateStatusRequest:
 *       type: object
 *       required: [status]
 *       properties:
 *         status:
 *           type: boolean
 *           description: Estado activo/inactivo del usuario
 *       example:
 *         status: false
 *
 *     UserResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         email:
 *           type: string
 *           format: email
 *         role:
 *           type: string
 *         status:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *       example:
 *         id: 12
 *         email: "user@example.com"
 *         role: "PLAYER"
 *         status: true
 *         createdAt: "2025-06-01T12:34:56.000Z"
 *
 *     RoleEntityResponse:
 *       description: Respuesta de la entidad asociada al rol. Puede ser un Coach o un Player.
 *       oneOf:
 *         - type: object
 *           description: CoachResponse (estructura exacta no expuesta en este módulo)
 *           additionalProperties: true
 *           example:
 *             id: 7
 *             name: "Pep Guardiola"
 *             license: "UEFA Pro"
 *             teamId: 3
 *         - type: object
 *           description: PlayerResponse (estructura exacta no expuesta en este módulo)
 *           additionalProperties: true
 *           example:
 *             id: 21
 *             name: "Juan Pérez"
 *             position: "Defensa Central"
 *             teamId: 3
 *
 * security:
 *   - bearerAuth: []
 */

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: Gestión de usuarios (credenciales y estado)
 */

/**
 * @swagger
 * /api/user/:
 *   get:
 *     summary: Listar usuarios activos
 *     description: Retorna todos los usuarios activos. Requiere rol COACH.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios activos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/UserResponse' }
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Requiere rol COACH }
 *       500: { description: Error interno }
 */

/**
 * @swagger
 * /api/user/inactive:
 *   get:
 *     summary: Listar usuarios (incluye inactivos)
 *     description: Retorna todos los usuarios, activos e inactivos. Requiere rol COACH o PLAYER.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios (activos e inactivos)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/UserResponse' }
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Requiere rol COACH o PLAYER }
 *       500: { description: Error interno }
 */

/**
 * @swagger
 * /api/user/{id}:
 *   get:
 *     summary: Obtener usuario por ID (solo activos)
 *     description: Retorna un usuario activo por su ID. Requiere rol COACH o PLAYER.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/UserResponse' }
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Requiere rol COACH o PLAYER }
 *       404: { description: Usuario no encontrado }
 *       500: { description: Error interno }
 */

/**
 * @swagger
 * /api/user/inactive/{id}:
 *   get:
 *     summary: Obtener usuario por ID (incluye inactivos)
 *     description: Retorna un usuario por su ID, aunque esté inactivo. Requiere rol COACH o PLAYER.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado (activo o inactivo)
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/UserResponse' }
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Requiere rol COACH o PLAYER }
 *       404: { description: Usuario no encontrado }
 *       500: { description: Error interno }
 */

/**
 * @swagger
 * /api/user/email/{email}:
 *   get:
 *     summary: Obtener usuario por email
 *     description: Busca un usuario por su correo electrónico. Requiere rol COACH o PLAYER.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *         description: Email del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/UserResponse' }
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Requiere rol COACH o PLAYER }
 *       404: { description: Email no encontrado }
 *       500: { description: Error interno }
 */

/**
 * @swagger
 * /api/user/role/{id}:
 *   get:
 *     summary: Obtener entidad asociada al rol por credentialId
 *     description: Retorna la entidad de dominio asociada al usuario (Coach o Player). Requiere rol COACH o PLAYER.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: Credential ID del usuario
 *     responses:
 *       200:
 *         description: Entidad asociada al rol
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RoleEntityResponse'
 *       400: { description: Registro de rol no completado }
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Requiere rol COACH o PLAYER }
 *       500: { description: Error interno }
 */

/**
 * @swagger
 * /api/user/:
 *   post:
 *     summary: Crear usuario
 *     description: Crea un usuario de credenciales. Requiere rol COACH.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CreateUserRequest' }
 *     responses:
 *       201:
 *         description: Usuario creado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/UserResponse' }
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Requiere rol COACH }
 *       409:
 *         description: Email ya existe
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       500: { description: Error interno }
 */

/**
 * @swagger
 * /api/user/:
 *   put:
 *     summary: Actualizar usuario
 *     description: Actualiza email y/o password de un usuario existente. Requiere rol COACH o PLAYER.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/UpdateUserRequest' }
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/UserResponse' }
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Requiere rol COACH o PLAYER }
 *       404: { description: Usuario no encontrado }
 *       409:
 *         description: Email ya existe
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       500: { description: Error interno }
 */

/**
 * @swagger
 * /api/user/{id}:
 *   delete:
 *     summary: Eliminar usuario
 *     description: Elimina un usuario por ID. Requiere rol COACH.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: ID del usuario
 *     responses:
 *       204:
 *         description: Eliminado sin contenido
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Requiere rol COACH }
 *       404: { description: Usuario no encontrado }
 *       500: { description: Error interno }
 */

/**
 * @swagger
 * /api/user/status/{id}:
 *   patch:
 *     summary: Actualizar estado (activo/inactivo)
 *     description: Actualiza el campo de estado del usuario. Requiere rol COACH o PLAYER.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/UpdateStatusRequest' }
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/UserResponse' }
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       401: { description: No autorizado - Token requerido }
 *       403: { description: Acceso denegado - Requiere rol COACH o PLAYER }
 *       404: { description: Usuario no encontrado }
 *       500: { description: Error interno }
 */