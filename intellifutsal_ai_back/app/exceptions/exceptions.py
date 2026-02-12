class ConfigError(Exception):
    """Exception for configuration errors."""
    pass

class ModelLoadError(Exception):
    """Exception for errors during model loading."""
    pass

class PredictionError(Exception):
    """Exception for errors during prediction."""
    pass
