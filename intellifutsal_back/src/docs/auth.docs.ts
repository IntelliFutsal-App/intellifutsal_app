/**
 * @swagger
 * components:
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
 *         message: "Credenciales incorrectas"
 *         status: 401
 *
 *     LoginUserRequest:
 *       type: object
 *       required: [email, password]
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           format: password
 *       example:
 *         email: "user@example.com"
 *         password: "Str0ngP@ss!"
 *
 *     RegisterUserRequest:
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
 *           description: Rol del usuario (p. ej. COACH, PLAYER)
 *       example:
 *         email: "user@example.com"
 *         password: "Str0ngP@ss!"
 *         role: "PLAYER"
 *
 *     JwtPayload:
 *       type: object
 *       properties:
 *         id: { type: string }
 *         email: { type: string, format: email }
 *         username: { type: string, nullable: true }
 *         role: { type: string }
 *         status: { type: boolean }
 *       example:
 *         id: "12"
 *         email: "user@example.com"
 *         username: "user123"
 *         role: "PLAYER"
 *         status: true
 *
 *     AuthUserResponse:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *           description: JWT de acceso
 *         refreshToken:
 *           type: string
 *           description: JWT de refresco
 *         tokenType:
 *           type: string
 *           description: Tipo de token (p. ej. "Bearer")
 *         expiresIn:
 *           type: integer
 *           description: Tiempo de expiración del token de acceso en segundos
 *         user:
 *           $ref: '#/components/schemas/UserResponse'
 *       example:
 *         accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ref..."
 *         tokenType: "Bearer"
 *         expiresIn: 3600
 *         user:
 *           id: 12
 *           email: "user@example.com"
 *           role: "PLAYER"
 *           status: true
 *           createdAt: "2025-06-01T12:34:56.000Z"
 *
 *     ValidateTokenResponse:
 *       type: object
 *       properties:
 *         isValid:
 *           type: boolean
 *           description: Indica si el token es válido
 *         payload:
 *           oneOf:
 *             - $ref: '#/components/schemas/JwtPayload'
 *             - type: 'null'
 *       example:
 *         isValid: true
 *         payload:
 *           id: "12"
 *           email: "user@example.com"
 *           role: "PLAYER"
 *           status: true
 * 
 *     RefreshTokenRequest:
 *       type: object
 *       required: [refreshToken]
 *       properties:
 *         refreshToken:
 *           type: string
 *           description: Token de refresco válido
 *       example:
 *         refreshToken: "eyJh...<refresh-token>...asd"
 * 
 *     LogoutRequest:
 *       type: object
 *       required: [refreshToken]
 *       properties:
 *         refreshToken:
 *           type: string
 *           description: Token de refresco asociado a la sesión a cerrar
 *       example:
 *         refreshToken: "eyJh...<refresh-token>...asd"
 * 
 *     ProfileStateResponse:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *           description: Tipo de perfil asociado a la credencial
 *           enum: [PLAYER, COACH]
 *         profile:
 *           oneOf:
 *             - $ref: '#/components/schemas/PlayerResponse'
 *             - $ref: '#/components/schemas/CoachResponse'
 *           description: Perfil del usuario según su rol
 *         teams:
 *           type: array
 *           description: Equipos activos a los que pertenece el usuario
 *           items:
 *             $ref: '#/components/schemas/TeamResponse'
 *       example:
 *         type: "PLAYER"
 *         profile:
 *           id: 10
 *           firstName: "Juan"
 *           lastName: "Pérez"
 *           birthDate: "2002-01-12T00:00:00.000Z"
 *           age: 24
 *           height: 1.75
 *           weight: 70
 *           bmi: 22.86
 *           position: "PIVOT"
 *           status: true
 *           createdAt: "2026-01-21T10:00:00.000Z"
 *           credentialId: 55
 *         teams:
 *           - id: 7
 *             name: "IntelliFutsal FC"
 *             category: "Senior"
 *             playerCount: 14
 *             averageAge: 23.6
 *             status: true
 *             createdAt: "2025-05-20T14:22:10.000Z"
 * 
 *     PlayerResponse:
 *       type: object
 *       properties:
 *         id: { type: integer }
 *         firstName: { type: string }
 *         lastName: { type: string }
 *         birthDate:
 *           type: string
 *           format: date
 *         age:
 *           type: integer
 *         height:
 *           type: number
 *           format: float
 *         weight:
 *           type: number
 *           format: float
 *         bmi:
 *           type: number
 *           format: float
 *         highJump:
 *           type: number
 *           nullable: true
 *         rightUnipodalJump:
 *           type: number
 *           nullable: true
 *         leftUnipodalJump:
 *           type: number
 *           nullable: true
 *         bipodalJump:
 *           type: number
 *           nullable: true
 *         thirtyMetersTime:
 *           type: number
 *           nullable: true
 *         thousandMetersTime:
 *           type: number
 *           nullable: true
 *         position:
 *           type: string
 *         status:
 *           type: boolean
 *         credentialId:
 *           type: integer
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *
 *     CoachResponse:
 *       type: object
 *       properties:
 *         id: { type: integer }
 *         firstName: { type: string }
 *         lastName: { type: string }
 *         birthDate:
 *           type: string
 *           format: date
 *         age:
 *           type: integer
 *         expYears:
 *           type: number
 *           format: float
 *         specialty:
 *           type: string
 *         status:
 *           type: boolean
 *         credentialId:
 *           type: integer
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
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
 *         playerCount:
 *           type: integer
 *           description: Cantidad de jugadores activos en el equipo
 *         averageAge:
 *           type: number
 *           format: float
 *           description: Edad promedio de los jugadores activos
 *         status:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 */

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Registro, login y validación de tokens
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registro de usuario
 *     description: Registra un usuario, encripta la contraseña y retorna un JWT de acceso.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/RegisterUserRequest' }
 *     responses:
 *       201:
 *         description: Usuario registrado y token generado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/AuthUserResponse' }
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       409:
 *         description: El email ya existe
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
 * /api/auth/login:
 *   post:
 *     summary: Inicio de sesión
 *     description: Valida credenciales y retorna un JWT de acceso.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/LoginUserRequest' }
 *     responses:
 *       200:
 *         description: Autenticación exitosa
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/AuthUserResponse' }
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       401:
 *         description: Credenciales incorrectas
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
 * /api/auth/validate-token:
 *   get:
 *     summary: Validar token JWT
 *     description: Valida el JWT enviado en el encabezado Authorization y retorna su payload si es válido.
 *     tags: [Auth]
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Token en formato `Bearer <token>`
 *     responses:
 *       200:
 *         description: Resultado de la validación del token
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ValidateTokenResponse' }
 *       401:
 *         description: Token no provisto o inválido
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refrescar tokens
 *     description: Recibe un refresh token válido y retorna nuevos tokens (access + refresh).
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefreshTokenRequest'
 *     responses:
 *       200:
 *         description: Tokens regenerados exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthUserResponse'
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       401:
 *         description: Refresh token inválido, revocado o expirado
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
 * /api/auth/profile/me:
 *   get:
 *     summary: Obtener estado global del perfil
 *     description: >
 *       Retorna el perfil del usuario autenticado (PLAYER o COACH) junto con
 *       los equipos activos a los que pertenece.  
 *       Este endpoint se usa para construir el estado global del usuario en el front-end
 *       (perfil + equipos + estadísticas).
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estado del perfil obtenido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProfileStateResponse'
 *       401:
 *         description: No autorizado - Token requerido o inválido
 *       403:
 *         description: Acceso denegado - Rol no soportado
 *       404:
 *         description: Perfil no encontrado para la credencial
 *       500:
 *         description: Error interno
 */

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Cerrar sesión
 *     description: Revoca el refresh token asociado a la sesión del usuario.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LogoutRequest'
 *     responses:
 *       204:
 *         description: Sesión cerrada correctamente (sin contenido)
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       500:
 *         description: Error interno
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */