import pickle
from typing import Any, Dict, List
from app.domain import ModelInterface, FEATURES
from app.core import Config
from app.exceptions import ModelLoadError


class PickleModelLoader:
    """Loader for models stored as pickle files."""

    @staticmethod
    def load_model(model_path: str = None) -> Any:
        """
        Loads a model from a pickle file.

        Args:
            model_path: Path to the model file. If None, uses the default config path.

        Returns:
            The loaded model.

        Raises:
            ModelLoadError: If there's an issue loading the model.
        """
        if model_path is None:
            model_path = Config.POSITIONS_MODEL_PATH

        try:
            with open(model_path, "rb") as file:
                return pickle.load(file)
        except FileNotFoundError:
            raise ModelLoadError(f"Archivo de modelo no encontrado en: {model_path}")
        except Exception as e:
            raise ModelLoadError(f"Error al cargar el modelo: {str(e)}")


class SklearnModelAdapter(ModelInterface):
    """Adapter for scikit-learn models."""

    def __init__(self, model: Any, scaler: Any):
        """
        Initializes the adapter with a scikit-learn model and scaler.

        Args:
            model: A scikit-learn compatible model (must implement `predict` method).
            scaler: A scaler used to normalize input features.
        """
        self.model = model
        self.scaler = scaler

    def predict(self, features: List[float]) -> Any:
        """
        Performs prediction using the adapted model.

        Args:
            features: A list of input features.

        Returns:
            The prediction result.

        Raises:
            RuntimeError: If any error occurs during prediction.
        """
        try:
            import numpy as np

            input_array = np.array([features])
            input_array = self.scaler.transform(input_array)

            return int(self.model.predict(input_array)[0])
        except Exception as e:
            raise RuntimeError(f"Error de predicción: {str(e)}")

    def validate_features(self, features: List[float]) -> Dict[str, str]:
        """
        Validates input features before prediction.

        Args:
            features: A list of features to be validated.

        Returns:
            A dictionary containing validation errors, if any.
        """
        errors = {}

        if len(features) != len(FEATURES):
            errors["general"] = (
                f"Se esperaban {len(FEATURES)} características, pero se recibieron {len(features)}"
            )

        return errors
