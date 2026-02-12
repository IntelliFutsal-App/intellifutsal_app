from flask import Blueprint, request, jsonify
from flasgger import swag_from
from app.domain import (
    FEATURES, POSITIONS_CATEGORIES, PHYSICAL_CONDITIONS_CATEGORIES, 
    PHYSICAL_CONDITION_CHARACTERISTICS, POSITION_PHYSICAL_RECOMMENDATIONS
)


analysis_prediction_bp = Blueprint("analysis_prediction", __name__)
positions_predictor_instance = None
physical_conditions_predictor_instance = None
openai_service = None

def init_analysis_bp(app, positions_predictor, physical_conditions_predictor, ai_service):
    """
    Registers the routes in the Flask application.
    
    Args:
        app: Flask application instance.
        positions_predictor: Prediction service for position profiles.
        physical_conditions_predictor: Prediction service for physical conditions.
        ai_service: OpenAI service for advanced analysis.
    """
    global positions_predictor_instance, physical_conditions_predictor_instance, openai_service
    positions_predictor_instance = positions_predictor
    physical_conditions_predictor_instance = physical_conditions_predictor
    openai_service = ai_service
    
    app.register_blueprint(analysis_prediction_bp)

@analysis_prediction_bp.route("/api/analyze", methods=["POST"])
@swag_from({
    "tags": ["Análisis IA"],
    "summary": "Análisis detallado de un jugador",
    "description": "Analiza el perfil físico y posicional de un jugador usando modelos de ML y OpenAI.",
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
                    field: {"type": "number", "example": 10.0}
                    for field in FEATURES
                },
                "required": list(FEATURES),
            },
        }
    ],
    "responses": {
        "200": {
            "description": "Análisis detallado generado correctamente",
            "schema": {
                "type": "object",
                "properties": {
                    "positionName": {"type": "string"},
                    "physicalName": {"type": "string"},
                    "strengths": {
                        "type": "array",
                        "items": {"type": "string"}
                    },
                    "weaknesses": {
                        "type": "array",
                        "items": {"type": "string"}
                    },
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
            "description": "Error interno del servidor durante el análisis",
            "schema": {
                "type": "object",
                "properties": {
                    "error": {"type": "string"}
                }
            }
        }
    }
})
def api_analyze():
    """
    Endpoint para realizar un análisis detallado de un jugador usando OpenAI.
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
        
        position_id = positions_predictor_instance.model.predict(user_features)
        physical_id = physical_conditions_predictor_instance.model.predict(user_features)
        
        analysis_result = openai_service.analyze_player_profile(
            user_features, 
            position_id,
            physical_id,
            FEATURES
        )
        
        analysis_result["positionName"] = POSITIONS_CATEGORIES.get(position_id, f"Perfil desconocido ({position_id})")
        analysis_result["physicalName"] = PHYSICAL_CONDITIONS_CATEGORIES.get(physical_id, f"Perfil desconocido ({physical_id})")
        
        return jsonify(analysis_result)
        
    except Exception as error:
        return jsonify({"error": str(error)}), 500

@analysis_prediction_bp.route("/api/team/analyze", methods=["POST"])
@swag_from({
    "tags": ["Análisis IA"],
    "summary": "Análisis detallado de un equipo completo",
    "description": "Analiza jugador por jugador y genera insights a nivel de equipo usando modelos de ML y OpenAI.",
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
                    "teamName": {"type": "string", "example": "IntelliFutsal FC"},
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
                            "required": ["name", *FEATURES],
                        },
                    },
                },
                "required": ["players"],
            },
        }
    ],
    "responses": {
        "200": {
            "description": "Análisis del equipo generado correctamente",
            "schema": {
                "type": "object",
                "properties": {
                    "success": {"type": "boolean"},
                    "teamName": {"type": "string"},
                    "playerResults": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "playerId": {"type": "string"},
                                "playerName": {"type": "string"},
                                "positionName": {"type": "string"},
                                "physicalName": {"type": "string"},
                                "strengths": {
                                    "type": "array",
                                    "items": {"type": "string"}
                                },
                                "weaknesses": {
                                    "type": "array",
                                    "items": {"type": "string"}
                                },
                            },
                        },
                    },
                    "errors": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "playerIndex": {"type": "integer"},
                                "playerName": {"type": "string"},
                                "error": {"type": "string"},
                            },
                        },
                    },
                    "totalPlayers": {"type": "integer"},
                    "processedPlayers": {"type": "integer"},
                    "failedPlayers": {"type": "integer"},
                    "teamAnalysis": {"type": "object"},
                },
            },
        },
        "400": {
            "description": "Formato inválido en el cuerpo de la solicitud",
            "schema": {
                "type": "object",
                "properties": {
                    "error": {"type": "string"},
                },
            },
        },
        "500": {
            "description": "Error interno del servidor durante el análisis del equipo",
            "schema": {
                "type": "object",
                "properties": {
                    "error": {"type": "string"},
                },
            },
        },
    },
})
def api_team_analyze():
    """
    Endpoint para realizar un análisis detallado de un equipo completo usando OpenAI.
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
                
                position_id = positions_predictor_instance.model.predict(user_features)
                physical_id = physical_conditions_predictor_instance.model.predict(user_features)
                
                analysis_result = openai_service.analyze_player_profile(
                    user_features, 
                    position_id,
                    physical_id,
                    FEATURES
                )
                
                analysis_result["playerId"] = player_id
                analysis_result["playerName"] = player_name
                analysis_result["positionName"] = POSITIONS_CATEGORIES.get(position_id, f"Perfil desconocido ({position_id})")
                analysis_result["physicalName"] = PHYSICAL_CONDITIONS_CATEGORIES.get(physical_id, f"Perfil desconocido ({physical_id})")
                
                results.append(analysis_result)
                
            except Exception as e:
                errors.append({
                    "playerIndex": i,
                    "playerName": player_data.get("name", f"Jugador {i+1}"),
                    "error": str(e)
                })
        
        team_analysis = None
        if len(results) > 1:
            try:
                team_data = {
                    "teamName": team_name,
                    "playerCount": len(results),
                    "positions": [p["positionName"] for p in results],
                    "physicalConditions": [p["physicalName"] for p in results],
                    "playerProfiles": [
                        {
                            "name": p["playerName"],
                            "position": p["positionName"],
                            "physical": p["physicalName"],
                            "strengths": p.get("strengths", []),
                            "weaknesses": p.get("weaknesses", [])
                        } for p in results
                    ]
                }
                
                team_analysis = openai_service.analyze_team(team_data)
            except Exception as e:
                team_analysis = {"error": f"Error al analizar el equipo: {str(e)}"}
        
        return jsonify({
            "success": True,
            "teamName": team_name,
            "playerResults": results,
            "errors": errors,
            "totalPlayers": len(players_data),
            "processedPlayers": len(results),
            "failedPlayers": len(errors),
            "teamAnalysis": team_analysis
        })
        
    except Exception as error:
        return jsonify({"error": str(error)}), 500

@analysis_prediction_bp.route("/api/full-recommendations", methods=["POST"])
@swag_from({
    "tags": ["Recomendaciones IA"],
    "summary": "Obtiene recomendaciones completas para un jugador",
    "description": "Devuelve el cluster de posición, el cluster físico y recomendaciones específicas de desarrollo.",
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
            "description": "Recomendaciones generadas correctamente",
            "schema": {
                "type": "object",
                "properties": {
                    "success": {"type": "boolean"},
                    "position": {
                        "type": "object",
                        "properties": {
                            "clusterId": {"type": "integer"},
                            "clusterName": {"type": "string"},
                        },
                    },
                    "physicalCondition": {
                        "type": "object",
                        "properties": {
                            "clusterId": {"type": "integer"},
                            "clusterName": {"type": "string"},
                            "description": {"type": "string"},
                            "strengths": {
                                "type": "array",
                                "items": {"type": "string"},
                            },
                            "developmentAreas": {
                                "type": "array",
                                "items": {"type": "string"},
                            },
                            "trainingRecommendations": {
                                "type": "array",
                                "items": {"type": "string"},
                            },
                        },
                    },
                    "specificRecommendations": {
                        "type": "array",
                        "items": {"type": "string"},
                    },
                    "features": {
                        "type": "object",
                        "additionalProperties": {"type": "number"},
                    },
                },
            },
        },
        "400": {
            "description": "Error de validación en el cuerpo de la solicitud",
            "schema": {
                "type": "object",
                "properties": {
                    "error": {"type": "string"},
                },
            },
        },
        "500": {
            "description": "Error interno del servidor durante la generación de recomendaciones",
            "schema": {
                "type": "object",
                "properties": {
                    "error": {"type": "string"},
                },
            },
        },
    },
})
def api_full_recommendations():
    """
    Endpoint para obtener recomendaciones completas basadas en posición y condición física.
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
        
        position_id = positions_predictor_instance.model.predict(user_features)
        physical_id = physical_conditions_predictor_instance.model.predict(user_features)
        
        position_name = POSITIONS_CATEGORIES.get(position_id, f"Perfil desconocido ({position_id})")
        physical_name = PHYSICAL_CONDITIONS_CATEGORIES.get(physical_id, f"Perfil desconocido ({physical_id})")
        
        condition_characteristics = PHYSICAL_CONDITION_CHARACTERISTICS.get(physical_id, {})
        
        specific_recommendations = []
        if position_id in POSITION_PHYSICAL_RECOMMENDATIONS and physical_id in POSITION_PHYSICAL_RECOMMENDATIONS[position_id]:
            specific_recommendations = POSITION_PHYSICAL_RECOMMENDATIONS[position_id][physical_id]
        
        return jsonify({
            "success": True,
            "position": {
                "clusterId": int(position_id),
                "clusterName": position_name
            },
            "physicalCondition": {
                "clusterId": int(physical_id),
                "clusterName": physical_name,
                "description": condition_characteristics.get("description", ""),
                "strengths": condition_characteristics.get("strengths", []),
                "developmentAreas": condition_characteristics.get("development_areas", []),
                "trainingRecommendations": condition_characteristics.get("training_recommendations", [])
            },
            "specificRecommendations": specific_recommendations,
            "features": {field: user_features[i] for i, field in enumerate(FEATURES)}
        })
        
    except Exception as error:
        return jsonify({"error": str(error)}), 500