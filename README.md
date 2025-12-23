# Amanat Properties Website

A sophisticated bilingual (English/Dari) real estate website for listing luxury properties in Jaghuri, Ghazni, Afghanistan.

## Features

### 🌐 Bilingual Support
- Complete English (LTR) and Farsi (RTL) versions
- Professional Persian translations
- Automatic language detection and switching
- Proper RTL layout implementation

### 🏠 Property Management
- Property listings with detailed information
- Image galleries with navigation
- Property filtering and search
- Price range filtering
- Property type categorization

### 💼 Admin Panel
- Password-protected admin access
- Add, edit, and delete properties
- Image upload functionality
- Property management interface

### 📱 Contact & Communication
- WhatsApp integration with pre-filled messages
- Contact forms with validation
- Professional contact information display

### 🎨 Design & User Experience
- Modern, elegant design
- Responsive layout for all devices
- Smooth animations and transitions
- Professional color palette
- High-quality generated hero images

### 🔧 Technical Features
- Local storage for user preferences
- Client-side functionality (no server required)
- SEO optimization
- Accessibility features
- Performance optimized

## File Structure

```
/
├── index.html              # English homepage
├── index-fa.html           # Farsi homepage
├── listings.html           # English property listings
├── listings-fa.html        # Farsi property listings
├── details.html            # English property details
├── details-fa.html         # Farsi property details
├── admin.html              # Admin panel
├── main.js                 # Main JavaScript functionality
├── properties.json         # Sample property data
├── resources/              # Images folder
│   ├── hero-villa.jpg      # Hero image for villas
│   ├── hero-apartment.jpg  # Hero image for apartments
│   └── hero-commercial.jpg # Hero image for commercial
├── design.md               # Design documentation
├── interaction.md          # Interaction design document
├── outline.md              # Project outline
└── README.md               # This file
```

## Color Palette

The website uses a sophisticated color palette designed for luxury real estate:

- **Primary**: #2C3E50 (Deep Blue-Gray)
- **Secondary**: #34495E (Slate Gray)
- **Accent**: #E67E22 (Warm Orange)
- **Background**: #FAFAFA (Warm White)
- **Success**: #27AE60
- **Warning**: #F39C12

## Usage

### Language Switching
- Use the language buttons (EN/فا) in the navigation bar
- Language preference is saved in localStorage
- Automatic redirection to appropriate language version

### Admin Panel
- Access: `/admin.html`
- Password: Contact [propertiesamanat@gmail.com](mailto:propertiesamanat@gmail.com) for the demo admin password
- Features: Add, edit, delete properties
- Image upload support

### Property Management
- Browse properties on listings page
- Filter by type, price range, bedrooms
- Sort by date, price, area
- Click property cards for detailed view

### Contact Integration
- WhatsApp buttons with pre-filled messages
- Contact forms with validation
- Professional contact display

## Deployment

### Local Development
1. Clone or download all files
2. Ensure all files are in the same directory
3. Start a local server:
   ```bash
   python -m http.server 8000
   ```
4. Open browser to `http://localhost:8000`

If you plan to use the server-backed persistence (recommended for multi-user use), there's a minimal Node.js API included in `server/`.

Quick server steps:
```powershell
Set-Location -Path 'c:\Users\zaki\Desktop\OKComputer_Bilingual Real Estate Site\server'
npm install
npm start
# Open http://localhost:3000/admin.html and http://localhost:3000/listings.html
```

When running the server, uploaded images will be saved to `uploads/` and `properties.json` will be updated automatically.

**Important**: For API features (adding/editing/deleting properties) to work, the server must be running. The frontend will automatically detect if the server is available and show a connection status indicator. If the server is not running, the site will fall back to using local data (localStorage and properties.json).

### Troubleshooting

#### Server Connection Issues

**Problem**: Server won't start or connection fails

**Solutions**:

1. **Port Already in Use (EADDRINUSE)**
   - The default port is 3000. If another application is using it:
   ```powershell
   # Find process using port 3000
   netstat -ano | findstr :3000
   # Kill the process (replace PID with actual process ID)
   taskkill /PID <PID> /F
   # Or use a different port
   $env:PORT=3001; npm start
   ```

2. **Server Not Starting**
   - Check if Node.js is installed: `node --version`
   - Verify dependencies are installed: `cd server && npm install`
   - Check for errors in the console output
   - Ensure you're in the correct directory: `cd server`

3. **Frontend Can't Connect to Server**
   - **Make sure the server is running**: Check terminal for "Amanat Properties server running on http://localhost:3000"
   - **Access site through server**: Use `http://localhost:3000` not `file://` protocol
   - **Check browser console**: Look for connection errors or warnings
   - **Verify health endpoint**: Visit `http://localhost:3000/api/health` in browser
   - **Connection status indicator**: Look for the status indicator in bottom-right corner
     - Green = Server connected
     - Yellow = Server offline, using local data

4. **API Requests Failing**
   - Check CORS settings (should be enabled by default)
   - Verify server is serving static files correctly
   - Check browser network tab for failed requests
   - Ensure you're accessing via `http://localhost:3000` not `file://`

5. **Properties Not Saving**
   - Check if server is running (connection indicator should be green)
   - Verify `properties.json` file is writable
   - Check `uploads/` directory exists and is writable
   - Look for error messages in browser console

#### Common Error Messages

- **"Server Offline - Using local data"**: Server is not running. Start it with `npm start` in the server directory.
- **"Request timeout"**: Server is not responding. Check if it's running and accessible.
- **"Port 3000 is already in use"**: Another process is using the port. Stop it or use a different port.
- **"Permission denied"**: Need administrator privileges or use a port > 1024.

#### Testing Server Connection

You can test if the server is working by:

1. **Health Check Endpoint**:
   ```bash
   curl http://localhost:3000/api/health
   ```
   Should return: `{"status":"ok","timestamp":"...","uptime":...,"port":3000,"version":"1.0.0"}`

2. **Browser Test**:
   - Open `http://localhost:3000/api/health` in your browser
   - Should see JSON response with server status

3. **Frontend Indicator**:
   - Look for connection status indicator in bottom-right corner
   - Green = Connected, Yellow = Offline

### Production Deployment (Vercel)

This project is now ready for deployment on [Vercel](https://vercel.com).

1. **GitHub Setup**:
   - Push your code to your GitHub repository (see instructions below).
2. **Vercel Import**:
   - Create a new project on Vercel and import your repository.
   - Vercel will automatically detect the configuration in `vercel.json` and `api/`.
   - The site will be served statically, and the property API will run as serverless functions.

**Note on Persistence**: Vercel's filesystem is read-only. While the API is functional, any properties added via the Admin panel will not persist permanently across redeploys. For permanent storage, it is recommended to connect a database (e.g., Vercel Postgres or MongoDB).

## Pushing to GitHub

Since you have already created the repository, follow these steps to upload your code:

```powershell
# Initialize git and add files
git init
git add .
git commit -m "Prepare for Vercel deployment: added root package.json, api/ index, and vercel.json"

# Connect to your existing repository
git remote add origin https://github.com/zsalehi441-tech/Amanat-Properties.git
git branch -M main

# Push to GitHub
git push -u origin main
```

If you encounter authentication issues, please sign in to GitHub in your terminal or use a Personal Access Token.


If the push fails due to authentication, configure Git credentials or use a personal access token. I can also help you create a deploy-ready workflow if you want CI/CD deployment.