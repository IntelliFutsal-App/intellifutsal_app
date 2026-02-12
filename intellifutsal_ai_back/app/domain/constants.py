from typing import List, Dict, Any
from enum import Enum


class PlayerPosition(Enum):
    """Enumeration for player positions."""
    WINGER = 0  
    PIVOT = 1  
    GOALKEEPER = 2      
    FIXO = 3    


class PhysicalCondition(Enum):
    """Enumeration for physical conditions based on clusters."""
    EXPLOSIVE = 0      
    BALANCED = 1    
    RESISTANT = 2     
    POWERFUL = 3        
    AGILE = 4           


FEATURES: List[str] = [
    "age", 
    "weight", 
    "height", 
    "bmi", 
    "highJump",
    "rightUnipodalJump", 
    "leftUnipodalJump", 
    "bipodalJump",
    "thirtyMetersTime", 
    "thousandMetersTime"
]

POSITIONS_CATEGORIES: Dict[int, str] = {
    PlayerPosition.WINGER.value: "Perfil para posición 'Ala'",
    PlayerPosition.PIVOT.value: "Perfil para posición 'Pívot'",
    PlayerPosition.FIXO.value: "Perfil para posición 'Poste'",
    PlayerPosition.GOALKEEPER.value: "Perfil para posición 'Arquero'"
}


PHYSICAL_CONDITIONS_CATEGORIES: Dict[int, str] = {
    PhysicalCondition.EXPLOSIVE.value: "Jugador con alta explosividad y capacidad de salto",
    PhysicalCondition.BALANCED.value: "Jugador con buen equilibrio físico general",
    PhysicalCondition.RESISTANT.value: "Jugador con mayor resistencia y menor explosividad",
    PhysicalCondition.POWERFUL.value: "Jugador con mayor BMI y potencia física",
    PhysicalCondition.AGILE.value: "Jugador ágiles con buen rendimiento general"
}

POSITION_CHARACTERISTICS: Dict[int, Dict[str, Any]] = {
    PlayerPosition.WINGER.value: {
        "description": "Jugadores con alto rendimiento en velocidad y salto. "
                        "Caracterizados por buena capacidad explosiva y valores superiores en saltos (especialmente bipodales). "
                        "BMI más bajo (22-24) y excelentes tiempos en pruebas de 30 metros (alrededor de 4.30 segundos). "
                        "Destacan en resistencia con tiempos competitivos en 1000 metros.",
        "strengths": ["Velocidad en sprints cortos", "Capacidad de salto explosivo", "Agilidad", "Resistencia sostenida"],
        "development_areas": ["Potencia física en duelos", "Juego posicional"]
    },
    PlayerPosition.PIVOT.value: {
        "description": "Jugadores con mayor BMI (27-31) y buena complexión física. "
                        "Destacan por combinación equilibrada de fuerza y agilidad. "
                        "Buenos tiempos en pruebas de velocidad (4.45-4.95 segundos) a pesar de su mayor peso. "
                        "Capacidad de salto moderada-alta con potencia para acciones ofensivas.",
        "strengths": ["Presencia física", "Potencia en acciones cortas", "Equilibrio físico", "Juego de posición"],
        "development_areas": ["Velocidad sostenida", "Trabajo de resistencia aeróbica"]
    },
    PlayerPosition.FIXO.value: {
        "description": "Jugadores con perfil físico balanceado entre resistencia y técnica. "
                        "BMI moderado (22-25) y buenos valores en pruebas de salto. "
                        "Capacidad de mantener rendimiento constante con tiempos de resistencia aceptables. "
                        "Buena combinación de estabilidad defensiva y capacidad técnica.",
        "strengths": ["Equilibrio físico general", "Posicionamiento", "Consistencia defensiva", "Lectura de juego"],
        "development_areas": ["Explosividad máxima", "Velocidad en primeros metros"]
    },
    PlayerPosition.GOALKEEPER.value: {
        "description": "Jugadores con perfil físico diverso, desde atlético hasta mayor BMI (23-39). "
                        "Destacan por buena capacidad de salto vertical para su contextura física. "
                        "Combinan respuesta explosiva con presencia física en portería. "
                        "Tiempos variables en pruebas de velocidad, priorizando reacción sobre velocidad sostenida.",
        "strengths": ["Reacción explosiva", "Alcance vertical", "Presencia física", "Capacidad de blocaje"],
        "development_areas": ["Velocidad lateral", "Resistencia aeróbica", "Juego con los pies"]
    }
}

PHYSICAL_CONDITION_CHARACTERISTICS: Dict[int, Dict[str, Any]] = {
    PhysicalCondition.EXPLOSIVE.value: {
        "description": "Jugadores con excepcional capacidad de salto y velocidad. "
                        "Destacan por su explosividad en movimientos cortos y tienen buen rendimiento aeróbico. "
                        "Ideal para jugadas rápidas y contraataques.",
        "strengths": ["Salto vertical (>60cm)", "Explosividad", "Velocidad en distancias cortas", "Agilidad"],
        "development_areas": ["Potencia sostenida", "Trabajo de masa muscular"],
        "training_recommendations": [
            "Ejercicios pliométricos avanzados", 
            "Entrenamiento de velocidad con cambios de dirección",
            "Sprints repetitivos de 10-15 metros",
            "Trabajo técnico a alta intensidad"
        ]
    },
    PhysicalCondition.BALANCED.value: {
        "description": "Jugadores con un perfil físico bien balanceado. "
                        "Combinan buena capacidad de salto con resistencia adecuada. "
                        "Pueden mantener un rendimiento consistente durante todo el partido.",
        "strengths": ["Equilibrio físico general", "Buena recuperación", "Salto medio-alto", "Rendimiento sostenido"],
        "development_areas": ["Explosividad", "Velocidad máxima"],
        "training_recommendations": [
            "Entrenamiento de fuerza funcional",
            "Circuitos de resistencia mixta",
            "Ejercicios de cambio de ritmo",
            "Trabajo técnico bajo fatiga controlada"
        ]
    },
    PhysicalCondition.RESISTANT.value: {
        "description": "Jugadores con alta capacidad aeróbica y resistencia. "
                        "Menor explosividad pero buena consistencia a lo largo del tiempo. "
                        "Adecuados para roles que requieren constancia y posicionamiento.",
        "strengths": ["Resistencia aeróbica", "Recuperación entre esfuerzos", "Consistencia física"],
        "development_areas": ["Velocidad", "Potencia de salto", "Explosividad"],
        "training_recommendations": [
            "Intervalos de alta intensidad",
            "Trabajo de potenciación muscular",
            "Ejercicios pliométricos básicos",
            "Entrenamiento de aceleración"
        ]
    },
    PhysicalCondition.POWERFUL.value: {
        "description": "Jugadores con mayor BMI y estructura física. "
                        "Gran potencia muscular pero menor agilidad en movimientos rápidos. "
                        "Excelentes para situaciones que requieren fortaleza física.",
        "strengths": ["Potencia muscular", "Presencia física", "Estabilidad", "Fuerza en duelos"],
        "development_areas": ["Agilidad", "Velocidad", "Resistencia aeróbica", "Rango de movimiento"],
        "training_recommendations": [
            "Trabajo de movilidad y flexibilidad",
            "Entrenamiento de velocidad específico",
            "Ejercicios de coordinación",
            "Resistencia aeróbica progresiva",
            "Control de composición corporal"
        ]
    },
    PhysicalCondition.AGILE.value: {
        "description": "Jugadores con excelente combinación de velocidad y técnica. "
                        "Buenos saltos unipodales y velocidad en distancias cortas. "
                        "Destacan en situaciones que requieren agilidad y coordinación.",
        "strengths": ["Velocidad en distancias cortas", "Coordinación", "Buenos saltos unipodales", "Agilidad"],
        "development_areas": ["Resistencia prolongada", "Potencia muscular general"],
        "training_recommendations": [
            "Ejercicios de coordinación avanzados",
            "Trabajo específico de técnica a alta velocidad",
            "Entrenamiento de resistencia específica para fútbol sala",
            "Ejercicios de reacción y tiempo de respuesta"
        ]
    }
}

POSITION_PHYSICAL_RECOMMENDATIONS: Dict[int, Dict[int, List[str]]] = {
    PlayerPosition.WINGER.value: {
        PhysicalCondition.EXPLOSIVE.value: [
            "Maximizar capacidad de desborde en velocidad",
            "Desarrollar finalizaciones en carrera",
            "Trabajar transiciones ultrarrápidas defensa-ataque"
        ],
        PhysicalCondition.BALANCED.value: [
            "Balancear momentos de explosividad con fases de control",
            "Mejorar capacidad de presión sostenida",
            "Desarrollar mejor toma de decisiones en velocidad"
        ],
        PhysicalCondition.RESISTANT.value: [
            "Potenciar la velocidad en primeros metros",
            "Trabajar arranques explosivos tras recuperación",
            "Mejorar la definición tras esfuerzos prolongados"
        ],
        PhysicalCondition.POWERFUL.value: [
            "Aprovechar potencia física en duelos por banda",
            "Trabajar aceleraciones cortas más explosivas",
            "Desarrollar mayor capacidad técnica a alta velocidad"
        ],
        PhysicalCondition.AGILE.value: [
            "Potenciar 1vs1 con cambios de ritmo y dirección",
            "Desarrollar repertorio técnico en espacios reducidos",
            "Mejorar finalización tras regates en velocidad"
        ]
    },
    
    PlayerPosition.PIVOT.value: {
        PhysicalCondition.EXPLOSIVE.value: [
            "Potenciar giros y desmarques explosivos",
            "Desarrollar finalizaciones rápidas tras protección",
            "Trabajar transiciones ofensivas como referencia"
        ],
        PhysicalCondition.BALANCED.value: [
            "Mejorar juego de espaldas y protección de balón",
            "Trabajar bloqueos y pantallas seguidos de desmarque",
            "Desarrollar finalizaciones con oposición" 
        ],
        PhysicalCondition.RESISTANT.value: [
            "Mejorar movimientos de desmarque continuo",
            "Trabajar capacidad para fijar defensas",
            "Desarrollar juego posicional sostenido"
        ],
        PhysicalCondition.POWERFUL.value: [
            "Maximizar ventaja física en duelos dentro del área",
            "Trabajar técnica de pivote bajo presión defensiva",
            "Desarrollar finalizaciones de potencia"
        ],
        PhysicalCondition.AGILE.value: [
            "Potenciar movimientos de desmarque en espacios reducidos",
            "Trabajar recepciones orientadas a alta velocidad",
            "Desarrollar mayor repertorio técnico con balón"
        ]
    },
    
    PlayerPosition.FIXO.value: {
        PhysicalCondition.EXPLOSIVE.value: [
            "Desarrollar salidas rápidas de balón bajo presión",
            "Potenciar incorporaciones sorpresa al ataque",
            "Mejorar velocidad en transiciones defensivas"
        ],
        PhysicalCondition.BALANCED.value: [
            "Balancear distribución de esfuerzos durante el partido",
            "Mejorar anticipación y lectura defensiva",
            "Desarrollar mejor control del ritmo de juego"
        ],
        PhysicalCondition.RESISTANT.value: [
            "Potenciar consistencia técnica durante todo el partido",
            "Mejorar posicionamiento defensivo colectivo",
            "Desarrollar mejor comunicación y liderazgo defensivo"
        ],
        PhysicalCondition.POWERFUL.value: [
            "Aprovechar presencia física en duelos defensivos",
            "Mejorar coberturas y ayudas defensivas",
            "Trabajar pases largo precisos en transiciones"
        ],
        PhysicalCondition.AGILE.value: [
            "Potenciar capacidad de recuperación e intercepción",
            "Desarrollar salida limpia de balón bajo presión",
            "Mejorar coordinación defensiva en línea"
        ]
    },
    
    PlayerPosition.GOALKEEPER.value: {
        PhysicalCondition.EXPLOSIVE.value: [
            "Maximizar capacidad de reacción en disparos cercanos",
            "Desarrollar salidas rápidas en 1vs1",
            "Potenciar juego con los pies en contragolpes"
        ],
        PhysicalCondition.BALANCED.value: [
            "Mejorar colocación bajo portería según situaciones",
            "Desarrollar distribución selectiva según contexto",
            "Trabajar comunicación defensiva avanzada"
        ],
        PhysicalCondition.RESISTANT.value: [
            "Potenciar concentración durante todo el partido",
            "Mejorar gestión del ritmo con distribución",
            "Desarrollar mejor lectura táctica del juego"
        ],
        PhysicalCondition.POWERFUL.value: [
            "Aprovechar envergadura para mayor cobertura de portería",
            "Mejorar intimidación en salidas por alto",
            "Trabajar despeje potente y preciso para contragolpes"
        ],
        PhysicalCondition.AGILE.value: [
            "Potenciar reflejos en disparos desviados",
            "Desarrollar técnica de parada en diferentes alturas",
            "Mejorar rapidez de recuperación tras primera acción"
        ]
    }
}

FEATURE_VALIDATIONS: Dict[str, Dict[str, Any]] = {
    "age": {"min": 14, "max": 50, "type": float},
    "weight": {"min": 40, "max": 200, "type": float},
    "height": {"min": 1.50, "max": 2.20, "type": float},
    "bmi": {"min": 15, "max": 50, "type": float},
    "highJump": {"min": 0.1, "max": 2.0, "type": float},
    "rightUnipodalJump": {"min": 0.1, "max": 4.0, "type": float},
    "leftUnipodalJump": {"min": 0.1, "max": 4.0, "type": float},
    "bipodalJump": {"min": 0.1, "max": 4.0, "type": float},
    "thirtyMetersTime": {"min": 3.0, "max": 10.0, "type": float},
    "thousandMetersTime": {"min": 150, "max": 600, "type": float}
}