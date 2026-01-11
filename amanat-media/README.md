# Amanat Media Service

A self-hosted, simplified media server (Local Cloudinary) for Amanat Real Estate.
Handles secure storage of originals and public optimization of property photos.

## Features
- **Public**: Optimizes variants (thumb, cover, full) using `sharp` (WebP).
- **Private**: Stores documents and originals securely; not accessible via public URL.
- **Security**: Basic API Key authentication for uploads and internal access.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure `.env`:
   ```bash
   cp .env.example .env
   ```
3. Run:
   ```bash
   npm run dev    # Watch mode
   npm run build  # Build TS
   npm start      # Production start
   ```

## API Usage

**Header required for uploads**: `x-api-key: <YOUR_KEY>`

### 1. Upload Property Image
Accessible publicly after processing.

```bash
curl -X POST http://localhost:3001/upload/property \
  -H "x-api-key: amanat-secret-media-key-123" \
  -F "file=@/path/to/house.jpg"
```

**Response**:
```json
{
  "id": "uuid...",
  "variants": {
    "thumb": "http://localhost:3001/public/uuid.../thumb",
    "cover": "http://localhost:3001/public/uuid.../cover",
    "full": "http://localhost:3001/public/uuid.../full"
  }
}
```

### 2. Upload Private Document
NOT accessible publicly.

```bash
curl -X POST http://localhost:3001/upload/document \
  -H "x-api-key: amanat-secret-media-key-123" \
  -F "file=@/path/to/qabala.pdf"
```

### 3. Get Public Image
No Auth required.
`GET /public/:id/:variant` (variant: `thumb`, `cover`, `full`)

### 4. Internal Access
Requires `x-api-key`.
`GET /internal/:id/original`
`GET /internal/:id/meta`
