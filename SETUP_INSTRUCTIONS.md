# Setup Instructions - Quick Start Guide

## What Has Been Created

A complete web application with:
1. **Frontend** - Interactive website with live calculator
2. **Backend** - Python Flask API running the FNN2 neural network model
3. **Documentation** - Setup guides and API documentation

## Quick Setup (Follow These Steps)

### Step 1: Download the Model Weights

The neural network requires a weights file that's too large to include here. Download it from GitHub:

**Method 1: Direct Download**
1. Go to: https://github.com/AntonStantan/matura/tree/main/FNN
2. Find and download `FNN2_weights.weights.h5`
3. Place it in the `api/` folder

**Method 2: Using Git**
```powershell
git clone https://github.com/AntonStantan/matura.git temp_repo
copy temp_repo\FNN\FNN2_weights.weights.h5 .\api\FNN2_weights.weights.h5
rm -r -force temp_repo
```

### Step 2: Set Up the API Server

Open PowerShell and run:

```powershell
cd api
.\setup.ps1
```

This will automatically:
- Create a Python virtual environment
- Install all required packages (Flask, TensorFlow, etc.)
- Check if the model weights are present

### Step 3: Start the API Server

```powershell
cd api
python app.py
```

You should see:
```
=============================================================
Neural Predictive Calculator - API Server
=============================================================
Model status: ✓ Loaded
Starting server on http://localhost:5000
=============================================================
```

### Step 4: Open the Website

Open `index.html` in your browser, or start a local web server:

```powershell
# Option 1: Direct file open
# Just double-click index.html

# Option 2: Python HTTP server (recommended)
python -m http.server 8000
# Then open: http://localhost:8000

# Option 3: Node.js serve
npx serve
```

### Step 5: Try the Calculator!

1. Navigate to the "Try It Yourself" section
2. Enter an expression like `1 + 2 - 3`
3. Click "Calculate"
4. See the neural network's prediction!

## File Structure

```
matura_web/
├── index.html                 # Main website
├── styles.css                 # All CSS styles
├── script.js                  # Frontend JavaScript + calculator logic
├── README.md                  # Main documentation
├── SETUP_INSTRUCTIONS.md      # This file
└── api/                       # Backend server
    ├── app.py                 # Flask API server
    ├── GetXY.py               # Tokenizer for expressions
    ├── requirements.txt       # Python dependencies
    ├── setup.ps1              # Automated setup script
    ├── README.md              # API documentation
    ├── .gitignore             # Git ignore file
    └── FNN2_weights.weights.h5  # ⚠️ Download this file!
```

## Troubleshooting

### "Model not loaded" error
- **Solution**: Download `FNN2_weights.weights.h5` and place it in the `api/` folder
- Check the file exists: `Test-Path api\FNN2_weights.weights.h5`

### "Unable to connect to server"
- **Solution**: Make sure the API server is running on port 5000
- Test: Open http://localhost:5000/api/health in your browser
- You should see: `{"model_loaded":true,"status":"healthy"}`

### TensorFlow installation fails
- **Solution**: Use Python 3.9, 3.10, or 3.11 (not 3.12)
- Check version: `python --version`
- Try: `pip install tensorflow==2.15.0 --no-cache-dir`

### CORS errors in browser console
- **Solution**: Access the website via HTTP server, not file://
- Use: `python -m http.server 8000` then visit http://localhost:8000

### Calculator shows error message
- Check the expression format: `number operator number operator number`
- Use spaces: `1 + 2 - 3` ✓ not `1+2-3` ✗
- Only use + and - operators
- Works best with numbers -5 to 4

## Testing the Setup

### Test 1: API Health Check
```powershell
# PowerShell
Invoke-WebRequest http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "model_loaded": true
}
```

### Test 2: Calculate Expression
```powershell
# PowerShell
$body = @{expression="1 + 2 - 3"} | ConvertTo-Json
Invoke-WebRequest -Method POST -Uri http://localhost:5000/api/calculate -Body $body -ContentType "application/json"
```

Expected response (result will vary):
```json
{
  "expression": "1 + 2 - 3",
  "result": 0.0234,
  "actual": 0,
  "difference": 0.0234
}
```

### Test 3: Website Calculator
1. Open the website
2. Scroll to "Try It Yourself" section
3. Enter: `2 + 3 - 1`
4. Click "Calculate"
5. Should see: Neural Network Result, Actual Result, and Difference

## Next Steps

- **Deploy**: To make the calculator accessible online, deploy both the API server and website
- **Customize**: Modify `styles.css` to change colors, fonts, or layout
- **Extend**: Add more features to `script.js` for enhanced functionality
- **API**: Use the `/api/batch-calculate` endpoint for multiple expressions

## Support

If you encounter issues:
1. Check the console output from the API server
2. Check the browser console (F12) for errors
3. Review the detailed documentation in `api/README.md`
4. Ensure all prerequisites are installed (Python, pip, etc.)

## Dependencies

### Python (Backend)
- Flask 3.0.0
- Flask-CORS 4.0.0
- TensorFlow 2.15.0
- NumPy 1.26.4

### Frontend
- No dependencies (vanilla HTML/CSS/JavaScript)
- Google Fonts (loaded from CDN)

## Performance Notes

- First calculation may be slower (model loading)
- Subsequent calculations are fast (<100ms typically)
- The model works best with numbers in range -5 to 4
- Results may be less accurate outside the training range

---

**Created for the Neural Predictive Calculator research project**
**Author: Anton Mukin**
