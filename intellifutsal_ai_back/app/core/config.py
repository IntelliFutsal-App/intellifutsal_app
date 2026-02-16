import os
from typing import Any, Dict
from dotenv import load_dotenv
from app.exceptions import ConfigError


load_dotenv()


def get_env(key: str, default: Any = None, required: bool = False) -> Any:
    """
    Retrieve an environment variable with validation.

    Args:
        key: Environment variable key.
        default: Default value if the key is not present.
        required: If True and the variable is not found, raise an exception.

    Returns:
        The value of the environment variable.

    Raises:
        ConfigError: If the variable is required but not found.
    """
    value = os.environ.get(key, default)

    if required and value is None:
        raise ConfigError(f"Variable de entorno requerida no encontrada: {key}")

    return value


class Config:
    """Application configuration settings."""
    POSITIONS_MODEL_PATH = get_env("POSITIONS_MODEL_PATH", required=True)
    PHYSICAL_CONDITIONS_MODEL_PATH = get_env("PHYSICAL_CONDITIONS_MODEL_PATH", required=True)
    POSITIONS_SCALER_PATH = get_env("POSITIONS_SCALER_PATH", required=True)
    PHYSICAL_CONDITIONS_SCALER_PATH = get_env("PHYSICAL_CONDITIONS_SCALER_PATH", required=True)

    DEBUG = get_env("DEBUG", "false").lower() == "true"
    HOST = get_env("HOST", "0.0.0.0")
    PORT = int(get_env("PORT", "9041"))

    OPENAI_API_KEY = get_env("OPENAI_API_KEY")

    REQUEST_TIMEOUT = int(get_env("REQUEST_TIMEOUT", "10"))
    MAX_CONTENT_LENGTH = int(get_env("MAX_CONTENT_LENGTH", "1024000"))

    @classmethod
    def validate(cls) -> Dict[str, str]:
        """
        Validate that all required configuration settings are present.

        Returns:
            A dictionary with found errors.
        """
        errors = {}
        required_settings = [
            "POSITIONS_MODEL_PATH",
            "PHYSICAL_CONDITIONS_MODEL_PATH",
            "POSITIONS_SCALER_PATH",
            "PHYSICAL_CONDITIONS_SCALER_PATH"
        ]

        for setting in required_settings:
            value = getattr(cls, setting, None)
            if value is None or value == "":
                errors[setting] = "Este valor es requerido"
            elif setting.endswith("_PATH") and not os.path.exists(value):
                errors[setting] = f"Archivo no encontrado: {value}"

        return errors