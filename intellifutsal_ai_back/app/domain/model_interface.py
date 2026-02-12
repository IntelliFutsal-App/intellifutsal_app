from abc import ABC, abstractmethod
from typing import Any, List, Dict


class ModelInterface(ABC):
    """Abstract interface for machine learning models."""

    @abstractmethod
    def predict(self, features: List[float]) -> Any:
        """
        Makes a prediction based on the given features.

        Args:
            features: List of features to make a prediction.

        Returns:
            The prediction result.

        Raises:
            RuntimeError: If an error occurs during prediction.
        """
        pass

    @abstractmethod
    def validate_features(self, features: List[float]) -> Dict[str, str]:
        """
        Validates the features before performing the prediction.

        Args:
            features: List of features to validate.

        Returns:
            Dictionary with validation errors, if any. 
            The values in the dictionary should be user-friendly messages in Spanish.
        """
        pass
