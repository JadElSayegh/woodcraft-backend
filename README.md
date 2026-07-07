# Full Stack CMS Assessment

WoodCraft is a full-stack wood seller website built with a public frontend and a protected admin CMS dashboard.

The public website displays homepage content, wood materials, product photos, pricing information, and contact sections. The admin dashboard allows non-technical administrators to manage the website content without editing code.

---

## Deliverables

This submission includes:

- Frontend repository
- Backend repository
- Database migrations
- README documentation
- Environment variable examples
- Swagger API documentation
- Admin authentication values

---

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Axios

### Backend

- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT authentication
- HTTP-only cookies
- Swagger API documentation
- Multer image uploads

---

## Main Features

### Public Website

- Dynamic homepage hero section
- Dynamic wood materials section
- Product photo slideshow
- Pricing page with wood-type pricing navigation
- Contact form section
- Responsive design
- CMS-driven content

### Admin Dashboard

- Admin login/logout
- Protected CMS dashboard
- Edit homepage content
- Create, edit, and delete wood types
- Add and manage wood characteristics
- Create, edit, and delete pricing groups
- Create, edit, and delete pricing variants
- Upload images
- Manage product photos
- Reorder product photos

### API

- REST API built with NestJS
- Swagger API documentation
- Authentication endpoints
- Public CMS endpoints
- Protected admin CMS endpoints
- Image upload endpoint

---

## Folder Structure

```text
fullstack-assessment/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── package-lock.json
│   ├── next.config.ts
│   ├── tsconfig.json
│   └── .env.example
│
├── backend/
│   ├── src/
│   ├── prisma/
│   │   ├── migrations/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── package.json
│   ├── package-lock.json
│   ├── prisma.config.ts
│   └── .env.example
│
└── README.md
```

---

## Setup Instructions

### Prerequisites

Make sure the following are installed:

- Node.js
- npm
- PostgreSQL
- Git

---

## Environment Variables

### Backend Environment Variables

Create a `.env` file inside the `backend` folder.

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/wood_cms?schema=public"
PORT=3001
JWT_ACCESS_SECRET="access_secret_change_this"
JWT_REFRESH_SECRET="refresh_secret_change_this"
ACCESS_TOKEN_EXPIRES_IN="15m"
REFRESH_TOKEN_EXPIRES_IN="7d"
FRONTEND_URL="http://localhost:3000"
```

Change YOUR_PASSWORD to your postgres database server password.

### Frontend Environment Variables

Create a `.env.local` file inside the `frontend` folder.

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## Database Setup

Create a PostgreSQL database named:

```text
wood_cms
```

Then run the following commands from the `backend` folder:

```bash
cd backend
npm install
npx prisma migrate dev
npx prisma db seed
npm run start:dev
```

The database migrations are included in:

```text
backend/prisma/migrations
```

The Prisma schema is located at:

```text
backend/prisma/schema.prisma
```

---

## Backend Setup

From the project root:

```bash
cd backend
npm install
npx prisma migrate dev
npx prisma db seed
npm run start:dev
```

The backend runs on:

```text
http://localhost:3001
```

Swagger API documentation is available at:

```text
http://localhost:3001/api-docs
```

---

## Frontend Setup

From the project root:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on:

```text
http://localhost:3000
```

---

## Admin Authentication Values

Use the seeded admin account below:

```text
Email: admin@example.com
Password: Password123
```

Admin dashboard URL:

```text
http://localhost:3000/dashboard
```

Login page:

```text
http://localhost:3000/login
```

---

## API Documentation

Swagger documentation is available at:

```text
http://localhost:3001/api-docs
```

The Swagger documentation includes:

- Authentication endpoints
- Public CMS endpoints
- Protected admin CMS endpoints
- Image upload endpoint
- Request examples
- Response examples
- Authentication requirements

---

## Architecture Overview

The project is separated into two applications:

```text
frontend/  → Next.js public website and admin dashboard
backend/   → NestJS API, authentication, CMS logic, Prisma, and PostgreSQL
```

The frontend communicates with the backend through Axios.

Frontend API base URL:

```text
NEXT_PUBLIC_API_URL=http://localhost:3001
```

The backend exposes public CMS endpoints for website content and protected admin endpoints for dashboard management.

Authentication uses JWT tokens stored in HTTP-only cookies.

The backend sets the following cookies after login:

```text
access_token
refresh_token
```

Admin-only endpoints require:

- Valid access token
- Admin role

---

## Database Models

The main Prisma models are:

```text
User
HomepageContent
TextSection
WoodType
WoodCharacteristic
WoodPriceGroup
WoodPriceVariant
ProductPhoto
```

### Model Purpose

```text
User
Stores user accounts, roles, password hashes, and refresh token hashes.

HomepageContent
Stores editable homepage hero content.

TextSection
Stores reusable editable text sections.

WoodType
Stores wood material/product types.

WoodCharacteristic
Stores characteristics for each wood type.

WoodPriceGroup
Stores pricing groups by dimensions.

WoodPriceVariant
Stores pricing rows by length, volume, and price per piece.

ProductPhoto
Stores product gallery/slideshow images.
```

---

## Main API Sections

### Authentication

```text
POST /auth/register
POST /auth/login
POST /auth/logout
GET  /auth/me
```

### Public CMS

```text
GET /cms/homepage
GET /cms/text-sections
GET /cms/wood-types
GET /cms/product-photos
GET /cms/pricing
```

### Admin CMS

```text
PATCH  /cms/homepage

POST   /cms/wood-types
PATCH  /cms/wood-types/:id
DELETE /cms/wood-types/:id

POST   /cms/wood-types/:woodTypeId/characteristics
PATCH  /cms/characteristics/:id
DELETE /cms/characteristics/:id

POST   /cms/wood-types/:woodTypeId/pricing/groups
PATCH  /cms/pricing/groups/:id
DELETE /cms/pricing/groups/:id

POST   /cms/pricing/groups/:groupId/variants
PATCH  /cms/pricing/variants/:id
DELETE /cms/pricing/variants/:id

POST   /cms/product-photos
PATCH  /cms/product-photos/:id
DELETE /cms/product-photos/:id

POST   /cms/upload
```

---

## Image Uploads

Images are uploaded through the backend using Multer.

Uploaded images are served from:

```text
http://localhost:3001/uploads
```

The upload endpoint returns an image URL that is stored in the database and used by the frontend.

Example response:

```json
{
  "url": "/uploads/1719320000000-image.png"
}
```

---

## Dependencies

The installed libraries are not included as `node_modules` folders.

To install dependencies, run:

```bash
npm install
```

inside both the `frontend` and `backend` folders.

Dependency files are included:

```text
frontend/package.json
frontend/package-lock.json

backend/package.json
backend/package-lock.json
```

These files allow the reviewer to install the exact required dependencies.

---

## Development Commands

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
npx prisma migrate dev
npx prisma db seed
npm run start:dev
```

---

## AI Tools Used

AI tools were used during the project to assist with:

- Planning the full-stack architecture
- Designing the database schema
- Structuring the NestJS API
- Structuring the Next.js frontend
- Debugging frontend and backend issues
- Improving CMS dashboard UX
- Creating Swagger documentation structure
- Writing README documentation
- Reviewing implementation steps

All code was reviewed, edited, tested, and integrated manually.

---

## Time Spent

Approximate time spent:

```text
Frontend implementation: 12–16 hours
Backend implementation: 10–14 hours
CMS dashboard: 8–10 hours
Database schema and migrations: 3–4 hours
Testing and debugging: 6–8 hours
Documentation: 1–2 hours
```

Total estimated time:

```text
40–50 hours
```

---

## Deployment

```text
Frontend: http://localhost:3000
Backend: http://localhost:3001
Swagger: http://localhost:3001/api-docs
Dashboard: http://localhost:3000/dashboard
```

---

## Submission Notes

The submitted ZIP should include:

```text
frontend/
backend/
README.md
```

The backend folder includes the Prisma migrations required to recreate the database structure.

Admin credentials are included in this README for testing the CMS dashboard.
