# Amanat Group business website

Standalone public website for amanat-group.af. The existing amanat.af customer site and Amanat System are separate applications.

## Local preview

Run `npm run build` then `npm run preview` in this directory. Open http://127.0.0.1:4180. No package installation is needed; the build uses Node's standard library.

## Included

English and Dari with right-to-left layout; official existing Amanat logo; About, Services, Partnerships, How It Works, Contact, FAQ, and Partner Login. Partnership enquiries open a prepared WhatsApp message for the visitor to review and send. This website does not store submissions, send messages automatically, or collect identity documents.

Contact information was copied from the current customer website: +93 791 606 227 and propertiesamanat@gmail.com. Confirm these remain the intended business contact before public launch.

The architectural illustration uses CSS and does not depict an actual Amanat property or office.

## GitHub and Vercel

Publish this directory as a separate GitHub repository, or add it as its own directory in the existing repository and set that directory as the Vercel project root. Do not change the existing amanat.af project's root or domain.

Build command: `npm run build`. Output directory: `dist`. Framework preset: Other. No environment variables or application secrets are needed. `vercel.json` includes clean URLs and security headers. Add amanat-group.af to this new project and apply the exact DNS records supplied by Vercel in the domain's Cloudflare account. Preserve mail and other unrelated DNS records. Public deployment requires an eligible commercial Vercel plan; Hobby is restricted to non-commercial personal use (https://vercel.com/docs/plans/hobby).

## Amanat System launch (pending)

The Partner Login buttons currently open `/login`, which clearly states that online system access is being prepared. There is no pretend sign-in form. After the backend has been deployed and verified at https://system.amanat-group.af/admin/plugins/amanat-workspace, replace the login holding page with a link or redirect to that address. Do not activate the redirect before the system is working over HTTPS.

The current Strapi backend requires separate hosting with persistent database and private-document storage. Prepare fresh production keys/accounts, server backups and recovery, verify every role's access, then connect the public amanat.af catalog to approved HQ publications. The local development accounts, database, .env, encrypted uploads, and backups must not be uploaded with this website.

## Launch status

This is a local implementation. GitHub publication, Vercel project creation, Cloudflare DNS changes, backend hosting, and the live amanat.af catalog integration have not been performed. Domain account access and hosting setup are still required.
