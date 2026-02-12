import logging
from flask import Flask
from flasgger import Swagger
from app.routes import init_analysis_bp, init_main_bp, init_physical_bp, init_position_bp
from app.infrastructure import PickleModelLoader, SklearnModelAdapter, ModelLoadError
from app.services import OpenAIService, PlayerProfilePredictor
from app.core import Config, ConfigError, register_error_handlers


def setup_logging(app: Flask) -> None:
    """
    Sets up the logging system for the application.
    
    Args:
        app: Flask application.
    """
    if not app.debug:
        handler = logging.StreamHandler()
        handler.setLevel(logging.INFO)
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
        handler.setFormatter(formatter)
        app.logger.addHandler(handler)
        app.logger.setLevel(logging.INFO)
    
    app.logger.info("Logging configured successfully")

def create_app(config_object=Config, testing=False) -> Flask:
    """
    Creates and configures the Flask application.
    
    Args:
        config_object: Configuration object for the application.
        testing: If True, the application is configured for testing.
        
    Returns:
        Configured Flask application.
        
    Raises:
        ConfigError: If there are configuration errors.
        ModelLoadError: If there are errors loading the models.
    """
    config_errors = config_object.validate()
    
    if config_errors:
        error_messages = "; ".join([f"{field}: {msg}" for field, msg in config_errors.items()])
        raise ConfigError(f"Errores de configuración: {error_messages}")
    
    app = Flask(__name__, 
                static_folder="../static", 
                template_folder="../static/templates")
    
    app.config.from_object(config_object)
    app.config["SWAGGER"] = {
        "title": "IntelliFutsal AI API Docs",
        "uiversion": 3,
        "specs_route": "/api-docs",
        "favicon": "https://intellifutsalstorage.blob.core.windows.net/intellifutsal-files/icon.png",
        "swagger_ui_css": "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css",
        "swagger_ui_bundle_js": "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js",
        "swagger_ui_standalone_preset_js": "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js",
        "swagger_ui_config": {
            "persistAuthorization": True,
            "displayRequestDuration": True,
            "filter": True,
            "showExtensions": True,
            "showCommonExtensions": True,
            "docExpansion": "none",
            "defaultModelsExpandDepth": -1,
            "defaultModelExpandDepth": 2,
            "tryItOutEnabled": True,
            "tagsSorter": "alpha",
            "operationsSorter": "alpha",
            "layout": "StandaloneLayout",
        },
        "custom_css": """
            .swagger-ui .topbar { background: #111827; }
            .swagger-ui .topbar .link span { color: #fff !important; }
            .swagger-ui .scheme-container { background: #f9fafb; }
        """,
    }

    swagger = Swagger(app)
    
    if testing:
        app.config["TESTING"] = True
        app.config["WTF_CSRF_ENABLED"] = False
    
    setup_logging(app)
    
    try:
        app.logger.info("Loading models...")
        
        raw_positions_model = PickleModelLoader.load_model(Config.POSITIONS_MODEL_PATH)
        raw_positions_scaler = PickleModelLoader.load_model(Config.POSITIONS_SCALER_PATH)
        positions_model_adapter = SklearnModelAdapter(raw_positions_model, raw_positions_scaler)
        
        raw_physical_conditions_model = PickleModelLoader.load_model(Config.PHYSICAL_CONDITIONS_MODEL_PATH)
        raw_physical_conditions_scaler = PickleModelLoader.load_model(Config.PHYSICAL_CONDITIONS_SCALER_PATH)
        physical_conditions_model_adapter = SklearnModelAdapter(raw_physical_conditions_model, raw_physical_conditions_scaler)
        
        positions_predictor = PlayerProfilePredictor(positions_model_adapter)
        physical_conditions_predictor = PlayerProfilePredictor(physical_conditions_model_adapter)
        openai_service = OpenAIService()
        
        init_main_bp(app, positions_predictor, physical_conditions_predictor, openai_service)
        init_analysis_bp(app, positions_predictor, physical_conditions_predictor, openai_service)
        init_physical_bp(app, physical_conditions_predictor)
        init_position_bp(app, positions_predictor)
        register_error_handlers(app)
        
        app.logger.info("Application configured successfully")
        
        return app
        
    except ModelLoadError as e:
        app.logger.error(f"Error loading models: {str(e)}")
        raise
    except Exception as e:
        app.logger.error(f"Error initializing the application: {str(e)}")
        raise
