# Amanat Internal Admin System - Handover

**System Status**: Installed & Configured on Local Office Server.
**URL**: [http://localhost:1337/admin](http://localhost:1337/admin)
**Technology**: Strapi v5 (Headless CMS) + SQLite

---

## 🚀 Quick Start
1. **Start the Server**:
   Open a terminal in `amanat-admin` and run:
   ```bash
   npm run start
   ```
2. **First Login**:
   Open the URL. Create the **Super Admin** account (this is for YOU, the Trust Officer/IT Head).

---

## 👥 User Roles & Permissions
The system automatically creates 3 roles. You must assign users and check permissions manually in **Settings -> Administration Panel -> Roles**.

### 1. Field Agent
*   **Role**: Submits new listings.
*   **Workflow**: Can only save as `Draft`. Cannot Verify.
*   **Permissions to Check**:
    *   [x] Plugins -> Content Manager -> Residential/Commercial/Land -> Create
    *   [x] Plugins -> Content Manager -> Residential/Commercial/Land -> Read
    *   [x] Plugins -> Content Manager -> Residential/Commercial/Land -> Update (is Creator)

### 2. Verifier
*   **Role**: Checks docs, verifying listing.
*   **Workflow**: Can move `Draft` -> `Verified`. Cannot Publish.
*   **Permissions to Check**:
    *   [x] Plugins -> Content Manager -> ... -> Read
    *   [x] Plugins -> Content Manager -> ... -> Update

### 3. Trust Officer
*   **Role**: Final approval.
*   **Workflow**: Can move `Verified` -> `Published`. Triggers Export.
*   **Permissions to Check**:
    *   [x] ALL Permissions.

---

## 🔒 Verification Workflow
The system strictly enforces the following flow via code:
1.  **Draft**: Default state. Field Agents can work here.
2.  **Verified**: Only Verifiers can promote to this.
3.  **Published**: Only Trust Officers can promote to this.

**Note**: If a Field Agent tries to set "Verified", the system will reject the save check.

---

## 🌍 Exporting to Public Site
To update the Amanat.af website with the latest **Published** listings:

1.  Run the export script:
    ```bash
    node scripts/export-listings.js
    ```
2.  This generates:
    *   `public/data/kabul-residential.json`
    *   `public/data/kabul-commercial.json`
    *   `public/data/kabul-land.json`
    *   `public/data/listings.json` (Search Index)

3.  Commit and push the `public/data` folder to your Git repository to deploy the static site.

---

## ⚠️ STRICT RULES
1.  **NO IMAGES IN STRAPI**: Use Cloudinary URLs only in the "Images" text component.
2.  **NO VIDEOS**: Use YouTube URLs.
3.  **OFFLINE ONLY**: Do not port-forward 1337 to the internet. Keep it on the LAN.

---

## Content Types
*   **Residential**: Homes, Apartments (Price, Beds, Baths).
*   **Commercial**: Offices, Shops (Floors, Parking).
*   **Land**: Plots (Zoning, Size).
