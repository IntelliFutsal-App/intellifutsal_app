from flask import Blueprint, jsonify, Response
from typing import Tuple, Dict, Any


error_bp = Blueprint("errors", __name__)

def register_error_handlers(app):
    """
    Registers error handlers for the Flask application.
    
    Args:
        app: Flask application instance.
    """
    @app.errorhandler(404)
    def not_found(error) -> Tuple[Response, int]:
        """Handles 404 errors (Resource not found)."""
        return jsonify({"error": "Recurso no encontrado", "code": 404}), 404

    @app.errorhandler(500)
    def server_error(error) -> Tuple[Response, int]:
        """Handles 500 errors (Internal server error)."""
        app.logger.error(f"Internal server error: {str(error)}")
        return jsonify({"error": "Error interno del servidor", "code": 500}), 500

    @app.errorhandler(400)
    def bad_request(error) -> Tuple[Response, int]:
        """Handles 400 errors (Bad request)."""
        return jsonify({"error": "Solicitud incorrecta", "code": 400}), 400

    @app.errorhandler(405)
    def method_not_allowed(error) -> Tuple[Response, int]:
        """Handles 405 errors (Method not allowed)."""
        return jsonify({"error": "Método no permitido", "code": 405}), 405

    @app.errorhandler(415)
    def unsupported_media_type(error) -> Tuple[Response, int]:
        """Handles 415 errors (Unsupported media type)."""
        return jsonify({"error": "Tipo de medio no soportado", "code": 415}), 415

    @app.errorhandler(429)
    def too_many_requests(error) -> Tuple[Response, int]:
        """Handles 429 errors (Too many requests)."""
        return jsonify({"error": "Demasiadas solicitudes", "code": 429}), 429

    @app.errorhandler(Exception)
    def handle_exception(error) -> Tuple[Response, int]:
        """Handles uncaught general exceptions."""
        app.logger.error(f"Unhandled error: {str(error)}")
        return jsonify({"error": "Error interno del servidor", "code": 500}), 500

def create_error_response(message: str, code: int) -> Dict[str, Any]:
    """
    Creates a standardized error response object.
    
    Args:
        message: Error message.
        code: HTTP status code.
        
    Returns:
        Dictionary with the standardized error response structure.
    """
    return {
        "success": False,
        "error": message,
        "code": code
    }