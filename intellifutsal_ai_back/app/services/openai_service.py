import openai
from typing import Dict, List, Any
from app.core import Config
from app.domain import PHYSICAL_CONDITION_CHARACTERISTICS, POSITION_PHYSICAL_RECOMMENDATIONS


class OpenAIService:
    """Service for integration with the OpenAI API."""
    
    def __init__(self):
        """Initializes the service with the OpenAI API key."""
        openai.api_key = Config.OPENAI_API_KEY
    
    def analyze_player_profile(self, features: List[float], position_category: int, 
                                physical_category: int, feature_names: List[str]) -> Dict[str, Any]:
        """
        Analyzes the player's profile using GPT to provide insights.
        
        Args:
            features: List of player's characteristics as float values.
            position_category: Predicted position cluster/category.
            physical_category: Predicted physical condition cluster/category.
            feature_names: Names of the features.
        
        Returns:
            Dictionary with the detailed profile analysis.
        """
        if not Config.OPENAI_API_KEY:
            return {
                "error": "API key not configured",
                "analysis": "No se pudo realizar el análisis detallado. Configure la clave de API de OpenAI."
            }
        
        try:
            player_data = {name: value for name, value in zip(feature_names, features)}
            
            physical_info = PHYSICAL_CONDITION_CHARACTERISTICS.get(physical_category, {})
            specific_recommendations = []
            
            if position_category in POSITION_PHYSICAL_RECOMMENDATIONS and physical_category in POSITION_PHYSICAL_RECOMMENDATIONS[position_category]:
                specific_recommendations = POSITION_PHYSICAL_RECOMMENDATIONS[position_category][physical_category]
            
            prompt = self._build_analysis_prompt(player_data, position_category, physical_category, physical_info, specific_recommendations)
            
            response = openai.ChatCompletion.create(
                model="gpt-4o",
                messages=[
                    {
                        "role": "system", "content": (
                            """Eres un asistente especializado en análisis deportivo para 
                            fútbol sala. Tu trabajo es analizar datos antropométricos y 
                            físicos de jugadores para proporcionar recomendaciones precisas 
                            y útiles al cuerpo técnico.
                            
                            IMPORTANTE: Debes responder estrictamente siguiendo esta estructura:
                            
                            ANÁLISIS GENERAL:
                            [Escribe aquí tu análisis general]
                            
                            FORTALEZAS:
                            - [Fortaleza 1]
                            - [Fortaleza 2]
                            - [Fortaleza 3]
                            
                            ÁREAS DE MEJORA:
                            - [Área de mejora 1]
                            - [Área de mejora 2]
                            - [Área de mejora 3]
                            
                            RECOMENDACIONES DE ENTRENAMIENTO:
                            - [Recomendación 1]
                            - [Recomendación 2]
                            - [Recomendación 3]
                            
                            PERFIL DE RENDIMIENTO:
                            [Escribe aquí el perfil de rendimiento]
                            
                            Es crucial que mantengas EXACTAMENTE este formato con los mismos encabezados
                            y estructura para que el sistema pueda procesar correctamente tu respuesta.
                            Usa siempre guiones para los elementos de las listas.
                            
                            Sé conciso pero completo. Cada sección debe ser precisa y directa para asegurar
                            que la respuesta completa se ajuste dentro del límite de tokens disponible."""
                        )
                    },
                    {"role": "user", "content": prompt}
                ],
                temperature=0.5,
                max_tokens=1500
            )
            
            content = response.choices[0].message.content
            
            import re
            
            general_analysis = ""
            strengths = []
            weaknesses = []
            training_recommendations = []
            performance_profile = ""
            
            general_match = re.search(r'ANÁLISIS GENERAL:\s*(.*?)(?=\s*\n\s*FORTALEZAS:|$)', content, re.DOTALL)
            if general_match:
                general_analysis = general_match.group(1).strip()
            
            strengths_section = re.search(r'FORTALEZAS:(?:\s*\n)((?:(?:-\s*.*?\n)|.)*?)(?=\s*\n\s*ÁREAS DE MEJORA:|$)', content, re.DOTALL)
            if strengths_section:
                strength_items = re.findall(r'-\s*(.*?)(?:\n|$)', strengths_section.group(1).strip(), re.DOTALL)
                strengths = [item.strip() for item in strength_items if item.strip()]
            
            weaknesses_section = re.search(r'ÁREAS DE MEJORA:(?:\s*\n)((?:(?:-\s*.*?\n)|.)*?)(?=\s*\n\s*RECOMENDACIONES DE ENTRENAMIENTO:|$)', content, re.DOTALL)
            if weaknesses_section:
                weakness_items = re.findall(r'-\s*(.*?)(?:\n|$)', weaknesses_section.group(1).strip(), re.DOTALL)
                weaknesses = [item.strip() for item in weakness_items if item.strip()]
            
            training_section = re.search(r'RECOMENDACIONES DE ENTRENAMIENTO:(?:\s*\n)((?:(?:-\s*.*?\n)|.)*?)(?=\s*\n\s*PERFIL DE RENDIMIENTO:|$)', content, re.DOTALL)
            if training_section:
                training_items = re.findall(r'-\s*(.*?)(?:\n|$)', training_section.group(1).strip(), re.DOTALL)
                training_recommendations = [item.strip() for item in training_items if item.strip()]
            
            performance_section = re.search(r'PERFIL DE RENDIMIENTO:\s*(.*?)', content, re.DOTALL)
            if performance_section:
                performance_profile = re.findall(r'-\s*(.*?)(?:\n|$)', performance_section.group(1).strip(), re.DOTALL)
                performance_profile = [item.strip() for item in performance_profile if item.strip()]
                performance_profile = "\n".join(performance_profile)
            
            if not general_analysis:
                general_match_fallback = re.search(r'^(.*?)(?=\s*\n\s*(?:FORTALEZAS:|PUNTOS FUERTES:|$))', content, re.DOTALL)
                if general_match_fallback:
                    general_analysis = general_match_fallback.group(1).strip()
            
            if not strengths:
                strengths_fallback = re.search(r'(?:FORTALEZAS:|fortalezas:|Fortalezas:).*?(?:\n)(.*?)(?=\n\s*(?:ÁREAS|Áreas|áreas|DEBILIDADES|Debilidades|debilidades|$))', content, re.DOTALL)
                if strengths_fallback:
                    fallback_items = re.findall(r'(?:[-•*]\s*|\d+[.)]\s*|\n\s*)([\w].*?)(?=\n\s*(?:[-•*]|\d+[.)]|\n|$))', strengths_fallback.group(1), re.DOTALL)
                    strengths = [item.strip() for item in fallback_items if item.strip()]
            
            if content and not general_analysis and not strengths and not weaknesses and not training_recommendations and not performance_profile:
                general_analysis = content.strip()
            
            return {
                "success": True,
                "positionCategory": position_category,
                "physicalCategory": physical_category,
                "generalAnalysis": general_analysis,
                "strengths": strengths,
                "weaknesses": weaknesses,
                "trainingRecommendations": training_recommendations,
                "performanceProfile": performance_profile,
                "rawAnalysis": content,
                "rawFeatures": player_data
            }
            
        except Exception as e:
            import traceback
            return {
                "error": str(e),
                "traceback": traceback.format_exc(),
                "analysis": "No se pudo completar el análisis. Error en la integración con OpenAI."
            }
    
    def _build_analysis_prompt(self, player_data: Dict[str, float], position_category: int, 
                                physical_category: int, physical_info: Dict[str, Any],
                                specific_recommendations: List[str]) -> str:
        """
        Builds the analysis prompt to send to OpenAI.
        
        Args:
            player_data: Player data as dictionary.
            position_category: Predicted position cluster.
            physical_category: Predicted physical condition cluster.
            physical_info: Information about physical condition characteristics.
            specific_recommendations: Specific recommendations for the position-condition combination.
        
        Returns:
            Prompt to send to OpenAI.
        """
        strengths = ", ".join(physical_info.get("strengths", ["No disponible"]))
        development_areas = ", ".join(physical_info.get("development_areas", ["No disponible"]))
        recommendations = "\n- ".join(specific_recommendations) if specific_recommendations else "No disponibles"
        
        prompt = f"""Analiza el siguiente perfil de un jugador de fútbol sala basado en sus métricas físicas y antropométricas:
                
                Datos del jugador:
                - Edad: {player_data.get('age')} años
                - Peso: {player_data.get('weight')} kg
                - Altura: {player_data.get('height')} m
                - IMC (BMI): {player_data.get('bmi')}
                - Salto vertical: {player_data.get('highJump')} m
                - Salto unipodal derecho: {player_data.get('rightUnipodalJump')} m
                - Salto unipodal izquierdo: {player_data.get('leftUnipodalJump')} m
                - Salto bipodal: {player_data.get('bipodalJump')} m
                - Tiempo en 30 metros: {player_data.get('thirtyMetersTime')} s
                - Tiempo en 1000 metros: {player_data.get('thousandMetersTime')} s

                Según nuestros modelos:
                1. Este jugador se clasifica en el cluster de posición {position_category}
                2. Su perfil físico corresponde al cluster {physical_category}: {physical_info.get('description', 'No disponible')}
                
                Información sobre su perfil físico:
                - Fortalezas: {strengths}
                - Áreas de desarrollo: {development_areas}
                
                Recomendaciones específicas para su posición y condición física:
                - {recommendations}

                Por favor proporciona:
                1. Un análisis integrado de la adecuación entre su condición física y su posición actual
                2. Fortalezas principales detectadas (al menos 2-3)
                3. Áreas específicas que debe mejorar (al menos 2-3)
                4. Recomendaciones concretas de entrenamiento (al menos 2-3 y deben ser entrenamientos muy específicos,
                    incluyendo ejercicios, series, repeticiones, herramientas necesarias, etc.)
                5. Un breve perfil de su rendimiento esperado en competición

                IMPORTANTE: Tu respuesta debe seguir EXACTAMENTE el formato que se te ha indicado en las instrucciones del sistema."""
        
        return prompt

    def analyze_team(self, team_data: Dict[str, float]) -> Dict[str, Any]:
        """
        Analyzes the team profile using GPT to provide insights.
        
        Args:
            team_data: Team data as dictionary.
        
        Returns:
            Dictionary with the detailed team analysis.
        """
        if not Config.OPENAI_API_KEY:
            return {
                "error": "API key not configured",
                "analysis": "No se pudo realizar el análisis detallado. Configure la clave de API de OpenAI."
            }
        
        try:
            prompt = self._build_team_analysis_prompt(team_data)
            
            response = openai.ChatCompletion.create(
                model="gpt-4o",
                messages=[
                    {
                        "role": "system", "content": (
                            """Eres un asistente especializado en análisis deportivo y
                            entrenador experto de fútbol sala. Tu trabajo es analizar 
                            datos antropométricos y físicos de jugadores para proporcionar
                            análisis tácticos y estratégicos precisos para equipos.
                            
                            IMPORTANTE: Debes responder estrictamente siguiendo esta estructura:
                            
                            ANÁLISIS GENERAL:
                            [Escribe aquí tu análisis general]
                            
                            PUNTOS FUERTES:
                            - [Punto fuerte 1]
                            - [Punto fuerte 2]
                            - [Punto fuerte 3]
                            
                            ÁREAS DE MEJORA:
                            - [Área de mejora 1]
                            - [Área de mejora 2]
                            - [Área de mejora 3]
                            
                            RECOMENDACIONES TÁCTICAS:
                            - [Recomendación 1]
                            - [Recomendación 2]
                            - [Recomendación 3]
                            
                            SUGERENCIAS DE ENTRENAMIENTOS:
                            - [Sugerencia 1]
                            - [Sugerencia 2]
                            - [Sugerencia 3]
                            
                            AJUSTES EN LA ALINEACIÓN:
                            [Escribe aquí los posibles ajustes]
                            
                            Es crucial que mantengas EXACTAMENTE este formato con los mismos encabezados
                            y estructura para que el sistema pueda procesar correctamente tu respuesta.
                            Usa siempre guiones para los elementos de las listas.
                            
                            Sé conciso pero completo. Cada sección debe ser precisa y directa para asegurar
                            que la respuesta completa se ajuste dentro del límite de tokens disponible."""
                        )
                    },
                    {"role": "user", "content": prompt}
                ],
                temperature=0.5,
                max_tokens=1500
            )
            
            content = response.choices[0].message.content
            
            import re
            
            general_analysis = ""
            team_strengths = []
            team_weaknesses = []
            tactical_recommendations = []
            training_suggestions = []
            lineup_adjustments = ""
            
            general_match = re.search(r'ANÁLISIS GENERAL:\s*(.*?)(?=\s*\n\s*PUNTOS FUERTES:|$)', content, re.DOTALL)
            if general_match:
                general_analysis = general_match.group(1).strip()
            
            strengths_section = re.search(r'PUNTOS FUERTES:(?:\s*\n)((?:(?:-\s*.*?\n)|.)*?)(?=\s*\n\s*ÁREAS DE MEJORA:|$)', content, re.DOTALL)
            if strengths_section:
                strength_items = re.findall(r'-\s*(.*?)(?:\n|$)', strengths_section.group(1).strip(), re.DOTALL)
                team_strengths = [item.strip() for item in strength_items if item.strip()]
            
            weaknesses_section = re.search(r'ÁREAS DE MEJORA:(?:\s*\n)((?:(?:-\s*.*?\n)|.)*?)(?=\s*\n\s*RECOMENDACIONES TÁCTICAS:|$)', content, re.DOTALL)
            if weaknesses_section:
                weakness_items = re.findall(r'-\s*(.*?)(?:\n|$)', weaknesses_section.group(1).strip(), re.DOTALL)
                team_weaknesses = [item.strip() for item in weakness_items if item.strip()]
            
            tactical_section = re.search(r'RECOMENDACIONES TÁCTICAS:(?:\s*\n)((?:(?:-\s*.*?\n)|.)*?)(?=\s*\n\s*SUGERENCIAS DE ENTRENAMIENTOS:|$)', content, re.DOTALL)
            if tactical_section:
                tactical_items = re.findall(r'-\s*(.*?)(?:\n|$)', tactical_section.group(1).strip(), re.DOTALL)
                tactical_recommendations = [item.strip() for item in tactical_items if item.strip()]
            
            training_section = re.search(r'SUGERENCIAS DE ENTRENAMIENTOS:(?:\s*\n)((?:(?:-\s*.*?\n)|.)*?)(?=\s*\n\s*AJUSTES EN LA ALINEACIÓN:|$)', content, re.DOTALL)
            if training_section:
                training_items = re.findall(r'-\s*(.*?)(?:\n|$)', training_section.group(1).strip(), re.DOTALL)
                training_suggestions = [item.strip() for item in training_items if item.strip()]
            
            lineup_section = re.search(r'AJUSTES EN LA ALINEACIÓN:\s*(.*?)', content, re.DOTALL)
            if lineup_section:
                lineup_items = re.findall(r'-\s*(.*?)(?:\n|$)', lineup_section.group(1).strip(), re.DOTALL)
                lineup_adjustments = [item.strip() for item in lineup_items if item.strip()]
                lineup_adjustments = "\n".join(lineup_adjustments)
            
            if not general_analysis:
                general_match_fallback = re.search(r'^(.*?)(?=\s*\n\s*(?:PUNTOS FUERTES:|$))', content, re.DOTALL)
                if general_match_fallback:
                    general_analysis = general_match_fallback.group(1).strip()
            
            if not team_strengths:
                strengths_fallback = re.search(r'(?:PUNTOS FUERTES:|puntos fuertes:|Puntos Fuertes:|fortalezas:|Fortalezas:).*?(?:\n)(.*?)(?=\n\s*(?:ÁREAS|Áreas|áreas|DEBILIDADES|Debilidades|debilidades|$))', content, re.DOTALL)
                if strengths_fallback:
                    fallback_items = re.findall(r'(?:[-•*]\s*|\d+[.)]\s*|\n\s*)([\w].*?)(?=\n\s*(?:[-•*]|\d+[.)]|\n|$))', strengths_fallback.group(1), re.DOTALL)
                    team_strengths = [item.strip() for item in fallback_items if item.strip()]
            
            if content and not general_analysis and not team_strengths and not team_weaknesses and not tactical_recommendations and not training_suggestions and not lineup_adjustments:
                general_analysis = content.strip()
            
            return {
                "success": True,
                "generalAnalysis": general_analysis,
                "teamStrengths": team_strengths,
                "teamWeaknesses": team_weaknesses,
                "tacticalRecommendations": tactical_recommendations,
                "trainingRecommendations": training_suggestions,
                "lineupAdjustments": lineup_adjustments,
                "rawAnalysis": content
            }
            
        except Exception as e:
            import traceback
            return {
                "error": str(e),
                "traceback": traceback.format_exc(),
                "analysis": "No se pudo completar el análisis. Error en la integración con OpenAI."
            }

    def _build_team_analysis_prompt(self, team_data: Dict[str, float]) -> str:
        """
        Builds the analysis prompt to send to OpenAI.
        
        Args:
            team_data: Team data as dictionary.
        
        Returns:
            Prompt to send to OpenAI.
        """
        import json
        
        prompt = f"""Realiza un análisis detallado del equipo de fútbol sala "{team_data['teamName']}" 
                con {team_data['playerCount']} jugadores.
                
                Composición del equipo:
                - Posiciones: {', '.join(team_data['positions'])}
                - Condiciones físicas: {', '.join(team_data['physicalConditions'])}
                
                Detalles de los jugadores:
                {json.dumps(team_data['playerProfiles'], indent=2, ensure_ascii=False)}
                
                Proporciona:
                1. Un análisis general del equilibrio del equipo
                2. Puntos fuertes colectivos del equipo (al menos 3)
                3. Áreas de mejora como conjunto (al menos 3)
                4. Recomendaciones tácticas específicas (al menos 3)
                5. Sugerencias de entrenamientos grupales específicos (al menos 3 con ejercicios, series, repeticiones, herramientas necesarias, etc.)
                6. Posibles ajustes en la alineación para optimizar el rendimiento
                
                IMPORTANTE: Tu respuesta debe seguir EXACTAMENTE el formato que se te ha indicado en las instrucciones del sistema."""
        
        return prompt
