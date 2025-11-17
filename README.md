# Neural Predictive Calculator - Website

This is the official website for the Neural Predictive Calculator research project, featuring a **live interactive demo** that runs the FNN2 model.

## 🌟 New Feature: Live Calculator

The website now includes a live interactive calculator powered by the FNN2 neural network model. Users can input arithmetic expressions directly on the website and see how the neural network computes them in real-time!

## 🚀 Quick Start

### 1. Set Up the API Server

The live calculator requires a Python backend API server to run the neural network model.

```powershell
cd api
.\setup.ps1
```

This will:
- Create a Python virtual environment
- Install required dependencies (Flask, TensorFlow, etc.)
- Check for the model weights file

### 2. Download Model Weights

Download `FNN2_weights.weights.h5` from the GitHub repository and place it in the `api/` directory:

```powershell
# Option A: Direct download from GitHub
# Go to https://github.com/AntonStantan/matura/tree/main/FNN
# Download FNN2_weights.weights.h5 and place in api/ directory

# Option B: Clone the repository
git clone https://github.com/AntonStantan/matura.git temp_repo
copy temp_repo\FNN\FNN2_weights.weights.h5 .\api\FNN2_weights.weights.h5
rm -r -force temp_repo
```

### 3. Start the API Server

```powershell
cd api
python app.py
```

The API server will start on `http://localhost:5000`

### 4. Open the Website

Simply open `index.html` in your web browser, or use a local server:

```powershell
# Using Python
python -m http.server 8000

# Or using Node.js
npx serve
```

Then navigate to `http://localhost:8000` (or whichever port you chose)

## 📁 Project Structure

```
matura_web/
├── index.html              # Main website
├── styles.css              # Styling
├── script.js               # Frontend JavaScript (includes calculator logic)
├── README.md               # This file
└── api/                    # Backend API
    ├── app.py              # Flask API server
    ├── GetXY.py            # Tokenizer module
    ├── requirements.txt    # Python dependencies
    ├── setup.ps1           # Setup script
    ├── README.md           # API documentation
    └── FNN2_weights.weights.h5  # Model weights (download separately)
```

## 🌐 Features

- **Live Interactive Calculator**: Try the FNN2 model directly in your browser
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional design with smooth animations
- **Comprehensive Documentation**: Links to research papers and findings
- **Architecture Overview**: Detailed information about all tested models
- **Repository Structure**: Easy navigation of the project codebase

## 🔧 API Endpoints

The backend API provides the following endpoints:

### Health Check
```
GET /api/health
```

### Calculate Expression
```
POST /api/calculate
Content-Type: application/json

{
  "expression": "1 + 2 - 3"
}
```

### Batch Calculate
```
POST /api/batch-calculate
Content-Type: application/json

{
  "expressions": ["1 + 2", "3 - 1", "5 + 5"]
}
```

See `api/README.md` for detailed API documentation.

## 📝 Expression Format

The neural network accepts expressions in the following format:
- Numbers: Integers (works best with -5 to 4, the training range)
- Operators: `+` (addition) and `-` (subtraction)
- Format: `number operator number operator number`
- Examples: `1 + 2 - 3`, `-4 + 5 - 1`, `2 + 3 + 1`

**Important:** Spaces between numbers and operators are required!

## 🛠️ Technologies Used

### Frontend
- HTML5
- CSS3 (Grid, Flexbox, CSS Variables)
- Vanilla JavaScript
- Google Fonts (Inter & JetBrains Mono)

### Backend
- Python 3.9+
- Flask (Web framework)
- TensorFlow 2.15 (Neural network)
- NumPy (Numerical computing)
- Flask-CORS (Cross-origin requests)

## 🐛 Troubleshooting

### Calculator Not Working

1. **API Server Not Running**
   - Make sure the API server is running on port 5000
   - Check the terminal for any error messages
   - Verify `http://localhost:5000/api/health` returns a healthy response

2. **CORS Errors**
   - Ensure `flask-cors` is installed
   - Check browser console for detailed errors
   - Try accessing the website via `http://localhost` instead of `file://`

3. **Model Not Loading**
   - Verify `FNN2_weights.weights.h5` exists in the `api/` directory
   - Check the file size (~1.3 MB)
   - Ensure TensorFlow is properly installed

### TensorFlow Installation Issues

If you encounter TensorFlow installation problems:
- Use Python 3.9, 3.10, or 3.11 (TensorFlow 2.15 doesn't support 3.12+)
- On Windows, you may need to install Visual C++ redistributables
- Try: `pip install tensorflow==2.15.0 --no-cache-dir`

## 🔗 Links

- **Main Research Repository**: [AntonStantan/matura](https://github.com/AntonStantan/matura)
- **Project Website**: [np-calc.rocks](https://np-calc.rocks)
- **Research Findings**: [findings.pdf](https://github.com/AntonStantan/matura/blob/main/documentation/findings/findings.pdf)
- **Methodology**: [methodology.pdf](https://github.com/AntonStantan/matura/blob/main/documentation/methodology/methodology.pdf)

## 📄 License

This website is part of the Neural Predictive Calculator project and follows the same license (MIT).

## 👨‍💻 Author

Anton Mukin

---

**Note:** This is a research project (Maturaarbeit) investigating why neural networks struggle with simple arithmetic expressions. The live calculator demonstrates the FNN2 model, which achieved the best performance among all tested architectures.
