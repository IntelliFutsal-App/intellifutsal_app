from flask import Blueprint, request, jsonify
from flasgger import swag_from
from app.domain import (FEATURES, POSITIONS_CATEGORIES)


position_prediction_bp = Blueprint("position_prediction", __name__)
positions_predictor_instance = None

def init_position_bp(app, positions_predictor):
    """
    Registers the routes in the Flask application.
    
    Args:
        app: Flask application instance.
        positions_predictor: Prediction service for position profiles.
    """
    global positions_predictor_instance, physical_conditions_predictor_instance, openai_service
    positions_predictor_instance = positions_predictor
    
    app.register_blueprint(position_prediction_bp)

@position_prediction_bp.route("/api/predict-position", methods=["POST"])
@swag_from({
    "tags": ["Predicciones IA"],
    "summary": "Predice el perfil posicional de un jugador",
    "description": "Usa el modelo de clustering de posiciones para asignar un perfil posicional basado en las características del jugador.",
    "consumes": ["application/json"],
    "produces": ["application/json"],
    "parameters": [
        {
            "name": "body",
            "in": "body",
            "required": True,
            "schema": {
                "type": "object",
                "properties": {
                    **{
                        field: {"type": "number", "example": 10.0}
                        for field in FEATURES
                    }
                },
                "required": list(FEATURES),
            },
        }
    ],
    "responses": {
        "200": {
            "description": "Predicción posicional generada correctamente",
            "schema": {
                "type": "object",
                "properties": {
                    "success": {"type": "boolean", "example": True},
                    "clusterId": {"type": "integer", "example": 1},
                    "clusterName": {"type": "string", "example": "Pívot ofensivo"},
                    "features": {
                        "type": "object",
                        "additionalProperties": {"type": "number"}
                    }
                }
            }
        },
        "400": {
            "description": "Error de validación en el cuerpo de la solicitud",
            "schema": {
                "type": "object",
                "properties": {
                    "error": {"type": "string"}
                }
            }
        },
        "500": {
            "description": "Error interno del servidor durante la predicción posicional",
            "schema": {
                "type": "object",
                "properties": {
                    "error": {"type": "string"}
                }
            }
        }
    }
})
def api_predict_position():
    """
    Endpoint para predecir la posición/clúster posicional de un jugador.
    """
    try:
        if not request.is_json:
            return jsonify({"error": "Se requiere JSON"}), 400
        
        data = request.json
        user_features = []
        
        for field in FEATURES:
            if field not in data:
                return jsonify({"error": f"Campo requerido no encontrado: '{field}'"}), 400
            try:
                user_features.append(float(data[field]))
            except ValueError:
                return jsonify({"error": f"Formato inválido para el campo: '{field}'"}), 400
        
        cluster_id = positions_predictor_instance.model.predict(user_features)
        cluster_name = POSITIONS_CATEGORIES.get(cluster_id, f"Perfil desconocido ({cluster_id})")
        
        return jsonify({
            "success": True,
            "clusterId": int(cluster_id),
            "clusterName": cluster_name,
            "features": {field: user_features[i] for i, field in enumerate(FEATURES)}
        })
        
    except Exception as error:
        return jsonify({"error": str(error)}), 500

@position_prediction_bp.route("/api/team/predict-positions", methods=["POST"])
@swag_from({
    "tags": ["Predicciones IA"],
    "summary": "Predice el perfil posicional de un equipo completo",
    "description": "Evalúa cada jugador del equipo y asigna un clúster posicional a cada uno.",
    "consumes": ["application/json"],
    "produces": ["application/json"],
    "parameters": [
        {
            "name": "body",
            "in": "body",
            "required": True,
            "schema": {
                "type": "object",
                "properties": {
                    "teamName": {
                        "type": "string",
                        "example": "IntelliFutsal FC"
                    },
                    "players": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "id": {"type": "string", "example": "player_1"},
                                "name": {"type": "string", "example": "Juan Pérez"},
                                **{
                                    field: {"type": "number", "example": 10.0}
                                    for field in FEATURES
                                }
                            },
                            "required": ["name", *FEATURES]
                        }
                    }
                },
                "required": ["players"]
            }
        }
    ],
    "responses": {
        "200": {
            "description": "Predicciones posicionales generadas correctamente para el equipo",
            "schema": {
                "type": "object",
                "properties": {
                    "success": {"type": "boolean"},
                    "teamName": {"type": "string"},
                    "results": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "playerId": {"type": "string"},
                                "playerName": {"type": "string"},
                                "clusterId": {"type": "integer"},
                                "clusterName": {"type": "string"},
                                "features": {
                                    "type": "object",
                                    "additionalProperties": {"type": "number"}
                                }
                            }
                        }
                    },
                    "errors": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "playerIndex": {"type": "integer"},
                                "playerName": {"type": "string"},
                                "error": {"type": "string"}
                            }
                        }
                    },
                    "totalPlayers": {"type": "integer"},
                    "processedPlayers": {"type": "integer"},
                    "failedPlayers": {"type": "integer"}
                }
            }
        },
        "400": {
            "description": "Error de formato en el cuerpo de la solicitud",
            "schema": {
                "type": "object",
                "properties": {
                    "error": {"type": "string"}
                }
            }
        },
        "500": {
            "description": "Error interno del servidor durante la predicción de equipo",
            "schema": {
                "type": "object",
                "properties": {
                    "error": {"type": "string"}
                }
            }
        }
    }
})
def api_team_predict_positions():
    """
    Endpoint para predecir la posición/clúster posicional de un equipo completo.
    """
    try:
        if not request.is_json:
            return jsonify({"error": "Se requiere JSON"}), 400
        
        data = request.json
        
        if not isinstance(data, dict) or "players" not in data or not isinstance(data["players"], list):
            return jsonify({"error": "Formato inválido. Se espera un objeto JSON con una lista de jugadores en 'players'"}), 400
        
        players_data = data["players"]
        team_name = data.get("teamName", "Equipo sin nombre")
        results = []
        errors = []
        
        for i, player_data in enumerate(players_data):
            try:
                user_features = []
                player_id = player_data.get("id", f"player_{i}")
                player_name = player_data.get("name", f"Jugador {i+1}")
                
                for field in FEATURES:
                    if field not in player_data:
                        raise ValueError(f"Campo requerido no encontrado para {player_name}: '{field}'")
                    try:
                        user_features.append(float(player_data[field]))
                    except ValueError:
                        raise ValueError(f"Formato inválido para el campo '{field}' en jugador {player_name}")
                
                cluster_id = positions_predictor_instance.model.predict(user_features)
                cluster_name = POSITIONS_CATEGORIES.get(cluster_id, f"Perfil desconocido ({cluster_id})")
                
                results.append({
                    "playerId": player_id,
                    "playerName": player_name,
                    "clusterId": int(cluster_id),
                    "clusterName": cluster_name,
                    "features": {field: user_features[i] for i, field in enumerate(FEATURES)}
                })
                
            except Exception as e:
                errors.append({
                    "playerIndex": i,
                    "playerName": player_data.get("name", f"Jugador {i+1}"),
                    "error": str(e)
                })
        
        return jsonify({
            "success": True,
            "teamName": team_name,
            "results": results,
            "errors": errors,
            "totalPlayers": len(players_data),
            "processedPlayers": len(results),
            "failedPlayers": len(errors)
        })
        
    except Exception as error:
        return jsonify({"error": str(error)}), 500