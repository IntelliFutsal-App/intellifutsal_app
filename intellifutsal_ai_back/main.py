import os
import logging
from app import create_app, Config, ConfigError, ModelLoadError


logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

try:
    app = create_app()
    
    if __name__ == "__main__":
        for path_name in ["POSITIONS_MODEL_PATH", "PHYSICAL_CONDITIONS_MODEL_PATH",
                        "POSITIONS_SCALER_PATH", "PHYSICAL_CONDITIONS_SCALER_PATH"]:
            path = getattr(Config, path_name)
            
            if not os.path.exists(path):
                logger.error(f"File not found: {path_name}={path}")
                raise FileNotFoundError(f"Archivo requerido no encontrado: {path}")
        
        logger.info(f"Starting server at {Config.HOST}:{Config.PORT} (Debug: {Config.DEBUG})")
        app.run(
            host=Config.HOST,
            port=Config.PORT,
            debug=Config.DEBUG,
            use_reloader=Config.DEBUG
        )
except ConfigError as e:
    logger.critical(f"Configuration error: {str(e)}")
    exit(1)
except ModelLoadError as e:
    logger.critical(f"Error loading models: {str(e)}")
    exit(1)
except Exception as e:
    logger.critical(f"Unexpected error: {str(e)}")
    exit(1)
