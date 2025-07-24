# 🧑‍💼 Job Portal – Laravel + Next.js

A full-stack Job Portal application with a Laravel backend and a Next.js frontend.

## 📁 Project Structure

```
job-portal/
├── backend/      # Laravel API (PHP, MySQL)
├── frontend/     # Next.js Frontend (React + Tailwind CSS)
├── .gitignore
└── README.md
```

---

## 🚀 Features

- Job listings and applications
- Role-based user accounts (Job Seekers & Companies)
- Skill and experience-based job recommendations
- Application tracking and status management

---

## ⚙️ Setup Instructions

### ✅ Prerequisites

Make sure the following are installed:

- PHP >= 8.1
- Composer
- MySQL or MariaDB
- Node.js (v16+ recommended)
- npm

---

## 📦 Backend Setup (Laravel)

```bash
cd backend

# 1. Install PHP dependencies
composer install

# 2. Copy .env file
cp .env.example .env

# 3. Set database credentials in `.env`
#    DB_DATABASE=job_portal
#    DB_USERNAME=root
#    DB_PASSWORD=your_password

# 4. Generate app key
php artisan key:generate

# 5. Run database migrations
php artisan migrate
# need for photo
php artisan storage:link

# (Optional) Seed test data
php artisan db:seed

# 6. Start Laravel development server
php artisan serve
```

Backend will run at: `http://127.0.0.1:8000`

---

## 💻 Frontend Setup (Next.js)

```bash
cd ../frontend

# 1. Install dependencies
npm install

# 2. Create environment file
touch .env.local
```

In `.env.local`, add:

```

NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
NEXT_PUBLIC_API_IMG_URL=http://127.0.0.1:8000/storage

```

Then run:

```bash
npm run dev
```

Frontend will run at: `http://localhost:3000`

---

## 🛢️ Import Database (Optional)

If you want to use existing data:

1. From the original PC:

   ```bash
   mysqldump -u root -p job_portal > job_portal.sql
   ```

2. On this PC:
   ```bash
   mysql -u root -p job_portal < job_portal.sql
   ```

---

## 🧾 License

This project is for educational purposes.

---

## 🙋‍♂️ Author

Made with ❤️ by Sayal Manandhar
