# Deploying the Flask API with GitHub Student Pack

## Option 1: Heroku (Recommended - Easiest)

### Prerequisites
1. GitHub Student Developer Pack: https://education.github.com/pack
2. Heroku account connected to GitHub Education
3. Heroku CLI installed: https://devcenter.heroku.com/articles/heroku-cli

### Steps

1. **Install Heroku CLI** (Windows):
   ```powershell
   winget install Heroku.HerokuCLI
   ```

2. **Login to Heroku**:
   ```bash
   heroku login
   ```

3. **Navigate to api folder**:
   ```bash
   cd api
   ```

4. **Initialize git (if not already)**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit for API deployment"
   ```

5. **Create Heroku app**:
   ```bash
   heroku create npc-calculator-api
   ```

6. **Upload model weights** (Git LFS for large files):
   ```bash
   # Install Git LFS
   git lfs install
   git lfs track "*.h5"
   git add .gitattributes FNN2_weights.weights.h5
   git commit -m "Add model weights"
   ```

7. **Deploy**:
   ```bash
   git push heroku main
   ```

8. **View logs** (to check if it's working):
   ```bash
   heroku logs --tail
   ```

9. **Open your API**:
   ```bash
   heroku open
   ```
   Your API will be at: `https://npc-calculator-api.herokuapp.com/api/health`

10. **Update website to use Heroku URL**:
    In `script.js`, change:
    ```javascript
    const API_URL = 'https://npc-calculator-api.herokuapp.com/api';
    ```

---

## Option 2: DigitalOcean (More Control)

### Prerequisites
- $200 credit for 1 year with GitHub Student Pack

### Steps

1. **Create Droplet**:
   - Go to DigitalOcean
   - Create Ubuntu 22.04 Droplet ($6/month)
   - Choose a datacenter region

2. **SSH into server**:
   ```bash
   ssh root@your-droplet-ip
   ```

3. **Setup server**:
   ```bash
   # Update system
   apt update && apt upgrade -y
   
   # Install Python and dependencies
   apt install python3-pip python3-venv nginx -y
   
   # Clone your repository
   git clone https://github.com/AntonStantan/matura.git
   cd matura
   
   # Copy your API files
   mkdir -p /var/www/npc-api
   cp -r api/* /var/www/npc-api/
   cd /var/www/npc-api
   
   # Create virtual environment
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

4. **Download model weights to server**:
   ```bash
   # Use wget or scp to upload FNN2_weights.weights.h5
   # Or clone from GitHub if you pushed it
   ```

5. **Create systemd service** (`/etc/systemd/system/npc-api.service`):
   ```ini
   [Unit]
   Description=NPC Calculator API
   After=network.target
   
   [Service]
   User=www-data
   WorkingDirectory=/var/www/npc-api
   Environment="PATH=/var/www/npc-api/venv/bin"
   ExecStart=/var/www/npc-api/venv/bin/gunicorn -w 4 -b 0.0.0.0:5000 app:app
   
   [Install]
   WantedBy=multi-user.target
   ```

6. **Configure Nginx** (`/etc/nginx/sites-available/npc-api`):
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
   
       location / {
           proxy_pass http://localhost:5000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

7. **Enable and start**:
   ```bash
   systemctl enable npc-api
   systemctl start npc-api
   ln -s /etc/nginx/sites-available/npc-api /etc/nginx/sites-enabled/
   systemctl restart nginx
   ```

8. **Setup SSL with Let's Encrypt** (optional but recommended):
   ```bash
   apt install certbot python3-certbot-nginx -y
   certbot --nginx -d your-domain.com
   ```

---

## Option 3: Railway (Modern & Simple)

### Steps

1. **Sign up at Railway.app** with GitHub
2. **New Project** → **Deploy from GitHub repo**
3. **Select your repository** (or fork api folder to separate repo)
4. **Railway auto-detects** Flask and deploys
5. **Add environment variables** if needed
6. **Get your URL**: `https://your-app.railway.app`

Note: Railway gives $5/month free with GitHub Student Pack

---

## Option 4: Azure App Service

### Prerequisites
- $100 Azure credit with GitHub Student Pack

### Steps

1. **Install Azure CLI**:
   ```bash
   winget install Microsoft.AzureCLI
   ```

2. **Login**:
   ```bash
   az login
   ```

3. **Create resource group**:
   ```bash
   az group create --name npc-api-rg --location eastus
   ```

4. **Create App Service plan**:
   ```bash
   az appservice plan create --name npc-api-plan --resource-group npc-api-rg --sku B1 --is-linux
   ```

5. **Create web app**:
   ```bash
   az webapp create --resource-group npc-api-rg --plan npc-api-plan --name npc-calculator-api --runtime "PYTHON:3.11"
   ```

6. **Deploy**:
   ```bash
   cd api
   az webapp up --name npc-calculator-api --resource-group npc-api-rg
   ```

---

## Comparison

| Service | Setup Time | Cost (with Student Pack) | Difficulty | Persistent |
|---------|-----------|-------------------------|-----------|-----------|
| **Heroku** | 5 min | Free | Easy ⭐ | Yes |
| **Railway** | 3 min | $5/month free | Very Easy ⭐⭐ | Yes |
| **DigitalOcean** | 30 min | $200 credit | Medium ⭐⭐⭐ | Yes |
| **Azure** | 15 min | $100 credit | Medium ⭐⭐⭐ | Yes |

---

## Important Notes

### Model Weights File
The `FNN2_weights.weights.h5` file is ~1.3 MB. You'll need to either:
- Use Git LFS (Large File Storage)
- Upload directly via service dashboard
- Store on cloud storage (S3, Azure Blob) and download on startup

### CORS Configuration
Already configured in `app.py` with `flask-cors`. If you have issues:
```python
CORS(app, resources={r"/api/*": {"origins": ["https://np-calc.rocks", "https://antonstantan.github.io"]}})
```

### Environment Variables
For production, set:
```bash
FLASK_ENV=production
```

### Costs After Student Pack
- Heroku: $7/month (Eco dyno)
- DigitalOcean: $6/month (Basic Droplet)
- Railway: $5-10/month
- Azure: Variable, ~$10/month

---

## Testing Your Deployment

After deployment, test:

```bash
# Health check
curl https://your-app-url.com/api/health

# Calculate expression
curl -X POST https://your-app-url.com/api/calculate \
  -H "Content-Type: application/json" \
  -d '{"expression":"1 + 2 - 3"}'
```

Expected response:
```json
{
  "status": "healthy",
  "model_loaded": true
}
```

---

## Troubleshooting

### Heroku: Slug Size Too Large
If your deployment exceeds 500MB:
```bash
# Use .slugignore to exclude unnecessary files
echo "*.md" >> .slugignore
echo "tests/" >> .slugignore
```

### Memory Issues
TensorFlow uses significant RAM. Ensure:
- Heroku: Use Standard-1X or higher ($25/month after student credits)
- DigitalOcean: Use 2GB RAM droplet minimum

### Model Not Loading
Check logs:
```bash
heroku logs --tail  # Heroku
journalctl -u npc-api -f  # DigitalOcean
```

Common issues:
- Model weights file missing
- Insufficient memory
- TensorFlow installation failed

---

## Recommendation

**Start with Heroku** - it's the easiest and fastest. If you need more control or want to learn server management, use **DigitalOcean**.

Once deployed, update your website's `script.js` with the production URL and push to GitHub. Your calculator will work live!
