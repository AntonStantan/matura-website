# Neural Predictive Calculator - API Server

This API server runs the FNN2 neural network model to calculate arithmetic expressions.

## Setup Instructions

### 1. Install Python Dependencies

```powershell
cd api
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### 2. Download Model Weights

You need to download the `FNN2_weights.weights.h5` file from the GitHub repository:

**Option A: Download from GitHub Releases**
- Go to: https://github.com/AntonStantan/matura/tree/main/FNN
- Download `FNN2_weights.weights.h5`
- Place it in the `api/` directory

**Option B: Clone the repository**
```powershell
git clone https://github.com/AntonStantan/matura.git temp_repo
copy temp_repo\FNN\FNN2_weights.weights.h5 .\FNN2_weights.weights.h5
rm -r -force temp_repo
```

### 3. Start the API Server

```powershell
python app.py
```

The server will start on `http://localhost:5000`

## API Endpoints

### Health Check
```
GET /api/health
```

Response:
```json
{
  "status": "healthy",
  "model_loaded": true
}
```

### Calculate Single Expression
```
POST /api/calculate
Content-Type: application/json

{
  "expression": "1 + 2 - 3"
}
```

Response:
```json
{
  "expression": "1 + 2 - 3",
  "result": 0.0234,
  "actual": 0,
  "difference": 0.0234
}
```

### Calculate Multiple Expressions
```
POST /api/batch-calculate
Content-Type: application/json

{
  "expressions": ["1 + 2", "3 - 1", "5 + 5"]
}
```

## Expression Format

The model accepts arithmetic expressions in the following format:
- Numbers: integers from -8 to 8 (trained on -5 to 4)
- Operators: `+` (addition) and `-` (subtraction)
- Format: `number operator number operator number`
- Example: `1 + 2 - 3` or `-4 + 5 - 1`

**Important:** 
- Spaces between numbers and operators are required
- The model works best with expressions in its training range (-5 to 4)
- Results may be less accurate for numbers outside this range

## Troubleshooting

### Model Not Loading
If you see "Model not loaded" errors:
1. Ensure `FNN2_weights.weights.h5` exists in the `api/` directory
2. Check that TensorFlow is properly installed
3. Verify the file is not corrupted (should be ~1.3 MB)

### CORS Errors
If the website can't connect to the API:
1. Make sure `flask-cors` is installed
2. Verify the API is running on port 5000
3. Check your browser's console for detailed error messages

### TensorFlow Errors
If you get TensorFlow import errors:
- Windows: Use `pip install tensorflow`
- Make sure you have Python 3.9-3.11 (TensorFlow 2.15 doesn't support 3.12+)

## File Structure

```
api/
├── app.py                      # Flask API server
├── GetXY.py                    # Tokenizer module
├── requirements.txt            # Python dependencies
├── FNN2_weights.weights.h5    # Model weights (download separately)
└── README.md                   # This file
```

## Notes

- The model is trained on expressions with 3 numbers and 2 operators
- For best results, use numbers in the range -5 to 4
- The model uses a Feed-Forward Neural Network (FNN) architecture
- This is the FNN2 model, which achieved the best performance in the research
