from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os
import tensorflow as tf
from tensorflow.keras.layers import Dense, PReLU, Flatten
from tensorflow.keras.models import Sequential
from tensorflow.keras import Input

# Suppress TensorFlow warnings
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

# Import tokenizer
from GetXY import tokenizer

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Global variable to store the model
model = None

def create_and_load_model(weights_path):
    """
    Creates the FNN2 model architecture and loads pre-trained weights.
    """
    input_shape = (15,)
    
    # FNN2 best hyperparameters
    best_hps = {
        "num_layers": 1,
        "num_neurons": 345,
        "dropout": False
    }
    
    model = Sequential()
    model.add(Input(shape=input_shape))
    model.add(Flatten())
    
    for _ in range(best_hps["num_layers"]):
        model.add(Dense(best_hps["num_neurons"]))
        model.add(PReLU())
    
    model.add(Dense(1, activation='linear'))
    model.compile(optimizer="adam", loss="mse")
    
    # Load the pre-trained weights
    model.load_weights(weights_path)
    
    return model

# Initialize model at startup
try:
    WEIGHTS_FILE = "FNN2_weights.weights.h5"
    if os.path.exists(WEIGHTS_FILE):
        model = create_and_load_model(WEIGHTS_FILE)
        print("✓ Model loaded successfully!")
    else:
        print(f"⚠ Warning: Model weights file not found: {WEIGHTS_FILE}")
        print("  Please download FNN2_weights.weights.h5 from the GitHub repository")
except Exception as e:
    print(f"✗ Error loading model: {e}")

@app.route('/', methods=['GET'])
def index():
    """Root endpoint - API info"""
    return jsonify({
        'name': 'Neural Predictive Calculator API',
        'version': '1.0.0',
        'status': 'running',
        'endpoints': {
            'health': '/api/health',
            'calculate': '/api/calculate (POST)',
            'batch_calculate': '/api/batch-calculate (POST)'
        }
    })

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None
    })

@app.route('/api/calculate', methods=['POST'])
def calculate():
    """
    Calculate arithmetic expression using the neural network.
    Expects JSON: {"expression": "1 + 2 - 3"}
    Returns: {"result": -0.0234, "expression": "1 + 2 - 3"}
    """
    try:
        if model is None:
            return jsonify({
                'error': 'Model not loaded. Please ensure FNN2_weights.weights.h5 exists.'
            }), 503
        
        data = request.get_json()
        expression = data.get('expression', '').strip()
        
        if not expression:
            return jsonify({'error': 'No expression provided'}), 400
        
        # Validate expression format (basic check)
        # Should be numbers separated by + or - operators
        parts = expression.split()
        if len(parts) % 2 == 0:
            return jsonify({'error': 'Invalid expression format. Use: "1 + 2 - 3"'}), 400
        
        # Tokenize the expression
        tokenized_input = tokenizer([expression])
        
        # Get prediction from model
        prediction = model.predict(tokenized_input, verbose=0)
        result = float(prediction[0][0])
        
        # Calculate actual result for comparison
        try:
            actual = eval(expression)
        except:
            actual = None
        
        return jsonify({
            'expression': expression,
            'result': round(result, 4),
            'actual': actual,
            'difference': abs(result - actual) if actual is not None else None
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/batch-calculate', methods=['POST'])
def batch_calculate():
    """
    Calculate multiple expressions at once.
    Expects JSON: {"expressions": ["1 + 2", "3 - 1", "5 + 5"]}
    """
    try:
        if model is None:
            return jsonify({
                'error': 'Model not loaded. Please ensure FNN2_weights.weights.h5 exists.'
            }), 503
        
        data = request.get_json()
        expressions = data.get('expressions', [])
        
        if not expressions or not isinstance(expressions, list):
            return jsonify({'error': 'No expressions provided'}), 400
        
        results = []
        for expression in expressions:
            expression = expression.strip()
            try:
                tokenized_input = tokenizer([expression])
                prediction = model.predict(tokenized_input, verbose=0)
                result = float(prediction[0][0])
                
                try:
                    actual = eval(expression)
                except:
                    actual = None
                
                results.append({
                    'expression': expression,
                    'result': round(result, 4),
                    'actual': actual,
                    'difference': abs(result - actual) if actual is not None else None
                })
            except Exception as e:
                results.append({
                    'expression': expression,
                    'error': str(e)
                })
        
        return jsonify({'results': results})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("\n" + "="*60)
    print("Neural Predictive Calculator - API Server")
    print("="*60)
    print(f"Model status: {'✓ Loaded' if model else '✗ Not loaded'}")
    print("Starting server on http://localhost:5000")
    print("="*60 + "\n")
    app.run(debug=True, host='0.0.0.0', port=5000)
