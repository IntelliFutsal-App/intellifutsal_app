from flask import Blueprint, request, render_template


main_prediction_bp = Blueprint("main_prediction", __name__)
positions_predictor_instance = None
physical_conditions_predictor_instance = None
openai_service = None

def init_main_bp(app, positions_predictor, physical_conditions_predictor, ai_service):
    """
    Registers the routes in the Flask application.
    
    Args:
        app: Flask application instance.
        positions_predictor: Prediction service for position profiles.
        physical_conditions_predictor: Prediction service for physical conditions.
        ai_service: OpenAI service for advanced analysis.
    """
    global positions_predictor_instance, physical_conditions_predictor_instance, openai_service
    positions_predictor_instance = positions_predictor
    physical_conditions_predictor_instance = physical_conditions_predictor
    openai_service = ai_service
    
    app.register_blueprint(main_prediction_bp)

@main_prediction_bp.route("/", methods=["GET", "POST"])
def index():
    """Main route to render the index page."""
    prediction_result = None
    
    if request.method == "POST":
        try:
            form_data = request.form
            user_features = positions_predictor_instance.parse_form_data(form_data)
            prediction_result = positions_predictor_instance.predict_category(user_features)
        except Exception as error:
            prediction_result = f"Error: {str(error)}"
    
    return render_template("index.html", prediction=prediction_result)