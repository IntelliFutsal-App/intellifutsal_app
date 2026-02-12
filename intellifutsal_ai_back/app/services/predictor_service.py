from typing import Dict, Any, List
from app.domain import (
    ModelInterface, FEATURES, POSITIONS_CATEGORIES, PHYSICAL_CONDITIONS_CATEGORIES,
    FEATURE_VALIDATIONS, PHYSICAL_CONDITION_CHARACTERISTICS, POSITION_PHYSICAL_RECOMMENDATIONS
)
from app.exceptions import PredictionError


class PlayerProfilePredictor:
    """Service to predict player profiles."""
    
    def __init__(self, model: ModelInterface):
        """
        Initializes the predictor with a model.
        
        Args:
            model: Implementation of ModelInterface for making predictions.
            
        Raises:
            ValueError: If the model is None.
        """
        if model is None:
            raise ValueError("El modelo no puede ser None")
        
        self.model = model
    
    def parse_form_data(self, form_data: Dict[str, Any]) -> List[float]:
        """
        Analyzes and validates form data.
        
        Args:
            form_data: Form data containing player features.
            
        Returns:
            List of features as float values.
            
        Raises:
            ValueError: If fields are missing or values are invalid.
        """
        features = []
        errors = {}
        
        for field in FEATURES:
            if field not in form_data:
                errors[field] = f"Campo requerido no encontrado: '{field}'"
                continue
                
            try:
                value = float(form_data[field])
                
                validation = FEATURE_VALIDATIONS.get(field, {})
                min_val = validation.get("min")
                max_val = validation.get("max")
                
                if min_val is not None and value < min_val:
                    errors[field] = f"El valor debe ser mayor o igual a {min_val}"
                elif max_val is not None and value > max_val:
                    errors[field] = f"El valor debe ser menor o igual a {max_val}"
                else:
                    features.append(value)
                
            except ValueError:
                errors[field] = f"Formato inválido para el campo: '{field}'"
        
        if errors:
            error_messages = "; ".join([f"{field}: {msg}" for field, msg in errors.items()])
            raise ValueError(f"Errores de validación: {error_messages}")
        
        return features
    
    def predict_category(self, features: List[float], is_physical: bool = False) -> str:
        """
        Predicts the player's profile category.
        
        Args:
            features: List of features as float values.
            is_physical: If True, returns physical condition category. If False, returns position.
            
        Returns:
            Predicted category as a string.
            
        Raises:
            PredictionError: If there's an error during prediction.
        """
        try:
            prediction = self.model.predict(features)
            
            if is_physical:
                return PHYSICAL_CONDITIONS_CATEGORIES.get(prediction, f"Perfil físico desconocido ({prediction})")
            else:
                return POSITIONS_CATEGORIES.get(prediction, f"Perfil de posición desconocido ({prediction})")
        except Exception as e:
            raise PredictionError(f"Error al predecir categoría: {str(e)}")
    
    def predict_with_details(self, features: List[float], position_id: int = None, is_physical: bool = True) -> Dict[str, Any]:
        """
        Predicts the player's profile category and returns detailed information.
        
        Args:
            features: List of features as float values.
            position_id: Position ID for combined recommendations (only for physical condition).
            is_physical: If True, returns physical condition details. If False, returns position details.
            
        Returns:
            Dictionary with predicted category and additional details.
            
        Raises:
            PredictionError: If there's an error during prediction.
        """
        try:
            prediction = self.model.predict(features)
            
            if is_physical:
                cluster_name = PHYSICAL_CONDITIONS_CATEGORIES.get(prediction, f"Perfil físico desconocido ({prediction})")
                condition_info = PHYSICAL_CONDITION_CHARACTERISTICS.get(prediction, {})
                
                result = {
                    "clusterId": int(prediction),
                    "clusterName": cluster_name,
                    "description": condition_info.get("description", ""),
                    "strengths": condition_info.get("strengths", []),
                    "developmentAreas": condition_info.get("development_areas", []),
                    "trainingRecommendations": condition_info.get("training_recommendations", [])
                }
                
                if position_id is not None and position_id in POSITION_PHYSICAL_RECOMMENDATIONS:
                    if prediction in POSITION_PHYSICAL_RECOMMENDATIONS[position_id]:
                        result["specificRecommendations"] = POSITION_PHYSICAL_RECOMMENDATIONS[position_id][prediction]
                
                return result
            else:
                return {
                    "clusterId": int(prediction),
                    "clusterName": POSITIONS_CATEGORIES.get(prediction, f"Perfil de posición desconocido ({prediction})")
                }
                
        except Exception as e:
            raise PredictionError(f"Error al predecir categoría: {str(e)}")
