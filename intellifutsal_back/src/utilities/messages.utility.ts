export const INTERNAL_SERVER_ERROR: string = "Se produjo un error interno en el servidor";

export const CLUSTER_SAVE_ERROR: string = "No fue posible guardar el clúster";
export const CLUSTER_UPDATE_ERROR: string = "No fue posible actualizar el clúster";
export const CLUSTER_NOT_FOUND: string = "No se encontró el clúster con el ID: ";

export const COACH_TEAM_ASSIGNMENT_DATE_FUTURE_ERROR: string = "La fecha de asignación del entrenador no puede estar en el futuro";
export const COACH_TEAM_END_DATE_FUTURE_ERROR: string = "La fecha de finalización del entrenador no puede estar en el futuro";
export const COACH_TEAM_END_DATE_BEFORE_ASSIGNMENT_ERROR: string = "La fecha de finalización no puede ser anterior a la de asignación";
export const COACH_TEAM_SAVE_ERROR: string = "No fue posible guardar la asignación del entrenador al equipo";
export const COACH_TEAM_UPDATE_ERROR: string = "No fue posible actualizar la asignación del entrenador al equipo";
export const COACH_TEAM_NOT_FOUND: string = "No se encontró la asignación del entrenador al equipo con el ID: ";
export const COACH_TEAM_ALREADY_ASSOCIATED: string = "El entrenador ya está asociado a este equipo";

export const COACH_SAVE_ERROR: string = "No fue posible guardar el entrenador";
export const COACH_UPDATE_ERROR: string = "No fue posible actualizar el entrenador";
export const COACH_NOT_FOUND: string = "No se encontró el entrenador con el ID: ";
export const COACH_NOT_FOUND_CREDENTIAL: string = "No se encontró el entrenador con la credencial con el ID: ";
export const COACH_ROLE_NOT_VALID: string = "El rol de la credencial no es válido para un entrenador";

export const CREDENTIAL_NOT_FOUND: string = "No se encontró la credencial con el ID: ";
export const CREDENTIAL_ALREADY_ASSIGNED_PLAYER: string = "La credencial ya está asignada a otro jugador";
export const CREDENTIAL_ALREADY_ASSIGNED_COACH: string = "La credencial ya está asignada a otro entrenador";
export const INCORRECT_CREDENTIALS: string = "Usuario y/o contraseña incorrectos";
export const INACTIVE_CREDENTIAL: string = "La credencial está inactiva";
export const CREDENTIAL_WITHOUT_PROFILE: string = "La credencial no tiene un perfil (PLAYER/COACH) asociado";

export const PLAYER_CLUSTER_SAVE_ERROR: string = "No fue posible guardar la asociación del jugador al clúster";
export const PLAYER_CLUSTER_UPDATE_ERROR: string = "No fue posible actualizar la asociación del jugador al clúster";
export const PLAYER_CLUSTER_NOT_FOUND: string = "No se encontró la asociación jugador-clúster con el ID: ";
export const PLAYER_CLUSTER_ALREADY_ASSOCIATED: string = "El jugador ya está asociado a este clúster";

export const PLAYER_TEAM_ENTRY_DATE_FUTURE_ERROR: string = "La fecha de ingreso del jugador no puede estar en el futuro";
export const PLAYER_TEAM_EXIT_DATE_FUTURE_ERROR: string = "La fecha de salida del jugador no puede estar en el futuro";
export const PLAYER_TEAM_EXIT_DATE_BEFORE_ENTRY_ERROR: string = "La fecha de salida no puede ser anterior a la de ingreso";
export const PLAYER_TEAM_SAVE_ERROR: string = "No fue posible guardar la asignación del jugador al equipo";
export const PLAYER_TEAM_UPDATE_ERROR: string = "No fue posible actualizar la asignación del jugador al equipo";
export const PLAYER_TEAM_NOT_FOUND: string = "No se encontró la asignación del jugador al equipo con el ID: ";
export const PLAYER_TEAM_ALREADY_ASSOCIATED: string = "El jugador ya está asociado a este equipo";

export const PLAYER_SAVE_ERROR: string = "No fue posible guardar el jugador";
export const PLAYER_UPDATE_ERROR: string = "No fue posible actualizar el jugador";
export const PLAYER_NOT_FOUND: string = "No se encontró el jugador con el ID: ";
export const PLAYER_NOT_FOUND_CREDENTIAL: string = "No se encontró el jugador con la credencial con el ID: ";
export const PLAYER_ROLE_NOT_VALID: string = "El rol de la credencial no es válido para un jugador";
export const PLAYERS_NOT_FOUND: string = "No se encontraron algunos jugadores con los IDs: ";
export const PLAYERS_NOT_FOUND_TEAM: string = "No se encontraron jugadores en el equipo con el ID: ";

export const TEAM_SAVE_ERROR: string = "No fue posible guardar el equipo";
export const TEAM_UPDATE_ERROR: string = "No fue posible actualizar el equipo";
export const TEAM_NOT_FOUND: string = "No se encontró el equipo con el ID: ";

export const USER_SAVE_ERROR: string = "No fue posible guardar el usuario";
export const USER_UPDATE_ERROR: string = "No fue posible actualizar el usuario";
export const USER_NOT_FOUND: string = "No se encontró el usuario con el ID: ";
export const USER_EMAIL_NOT_FOUND: string = "No se encontró un usuario con el correo: ";
export const USER_NOT_AUTHENTICATED: string = "El usuario no está autenticado";
export const USER_WITHOUT_PERMISSION: string = "El usuario no tiene el rol necesario para acceder a este recurso";

export const TEAM_NAME_ALREADY_EXISTS: string = "Ya existe un equipo con ese nombre: ";
export const USER_EMAIL_ALREADY_EXISTS: string = "Ya existe un usuario con ese correo: ";
export const USER_USERNAME_ALREADY_EXISTS: string = "Ya existe un usuario con ese nombre de usuario: ";

export const VALIDATION_REQUEST_FAILED: string = "La validación de la solicitud falló";

export const JWT_NOT_PROVIDED: string = "No se proporcionó el token de acceso";
export const JWT_INVALID_OR_EXPIRED: string = "El token de acceso es inválido o ha expirado";

export const INVALID_TOKEN_EXPIRATION_TIME: string = "El formato del tiempo de expiración del token no es válido";
export const TIME_UNIT_NOT_RECOGNIZED: string = "La unidad de tiempo no es reconocida";

export const AI_SERVICE_POSITION_PREDICTION_ERROR: string = "Error al predecir la posición mediante el servicio de IA";
export const AI_SERVICE_PHYSICAL_PREDICTION_ERROR: string = "Error al predecir el rendimiento físico mediante el servicio de IA";
export const AI_SERVICE_ANALYTICS_PREDICTION_ERROR: string = "Error al predecir las estadísticas mediante el servicio de IA";
export const AI_SERVICE_RECOMMENDATIONS_PREDICTION_ERROR: string = "Error al predecir las recomendaciones mediante el servicio de IA";
export const AI_SERVICE_TEAM_POSITION_PREDICTION_ERROR: string = "Error al predecir las posiciones del equipo mediante el servicio de IA";
export const AI_SERVICE_TEAM_PHYSICAL_PREDICTION_ERROR: string = "Error al predecir el rendimiento físico del equipo mediante el servicio de IA";

export const JOIN_REQUEST_NOT_FOUND: string = "No se encontró la solicitud de ingreso con ID: ";
export const JOIN_REQUEST_ALREADY_EXISTS: string = "Ya existe una solicitud pendiente para este jugador y equipo";
export const JOIN_REQUEST_SAVE_ERROR: string = "No fue posible guardar la solicitud de ingreso";
export const JOIN_REQUEST_UPDATE_ERROR: string = "No fue posible actualizar la solicitud de ingreso";
export const PLAYER_ALREADY_IN_TEAM: string = "El jugador ya pertenece al equipo seleccionado";
export const JOIN_REQUEST_NOT_PENDING: string = "La solicitud de ingreso no está en estado pendiente, el estado actual es: ";
export const JOIN_REQUEST_CREATION_NOT_ALLOWED_FOR_ANOTHER_PLAYER: string = "No puedes crear una solicitud de ingreso para otro jugador";
export const COACH_NOT_ASSIGNED_TO_TEAM: string = "El director técnico no está asignado a este equipo";

export const TRAINING_PLAN_SAVE_ERROR: string = "No fue posible guardar el plan de entrenamiento";
export const TRAINING_PLAN_NOT_FOUND: string = "No se encontró el plan de entrenamiento con el ID: ";
export const TRAINING_PLAN_NOT_PENDING_APPROVAL: string = "El plan de entrenamiento no está pendiente de aprobación, el estado actual es: ";

export const TRAINING_ASSIGNMENT_NOT_FOUND: string = "No se encontró la asignación de entrenamiento con el ID: ";

export const TRAINING_PROGRESS_NOT_FOUND: string = "No se encontró el progreso de entrenamiento con el ID: ";
export const TRAINING_PROGRESS_NOT_ALLOWED_TO_CREATE_FOR_ANOTHER_PLAYER: string = "No puedes registrar progreso sobre una asignación que no te pertenece";
export const TRAINING_PROGRESS_NOT_ACTIVE_ASSIGNMENT: string = "Solo se puede registrar progreso sobre asignaciones activas";
export const TRAINING_PROGRESS_NOT_ALLOWED_TO_VERIFY_FOR_ANOTHER_COACH: string = "No puedes verificar el progreso de asignaciones de otros entrenadores";

export const REGISTRATION_NOT_COMPLETED: string = "El registro no se ha completado. Por favor, registra tus datos como técnico o como jugador";

export const TEMPLATE_NAME: string = "La plantilla ";
export const TEMPLATE_NOT_FOUND: string = " no fue encontrada";
export const TEMPLATE_FIELDS_REQUIRED: string = " requiere los campos: ";
export const TEMPLATE_ERROR: string = " tuvo el error: ";

export const EMAIL_FAILED: string = "El envío del email falló: ";
export const FROM_EMAIL_MISSING: string = "El email del remitente no está configurado";
export const SENDGRID_API_KEY_MISSING: string = "La clave de API de SendGrid no está configurada";

export const ROLE_NOT_SUPPORTED: string = "El rol proporcionado no es soportado para el estado del perfil";