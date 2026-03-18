# 🧩 Sales Support CRM

A web-based Customer Relationship Management (CRM) system built with **Laravel** to help businesses streamline their sales pipeline, manage leads, track customers, and generate insightful reports — all from a single, intuitive dashboard.

🌐 **Live Demo:** [https://crm.saitsolution.com.np](https://crm.saitsolution.com.np)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Setup](#environment-setup)
  - [Running the Application](#running-the-application)
- [Project Structure](#-project-structure)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

- **Lead Management** — Capture, track, and convert leads through the sales funnel
- **Customer & Contact Management** — Maintain a centralized database of clients and contacts
- **Task & Follow-up Tracking** — Schedule tasks and follow-ups to never miss an opportunity
- **Invoice & Billing** — Generate and manage invoices directly from the CRM
- **Reports & Analytics** — Visual dashboards and exportable reports for data-driven decisions
- **User Role Management** — Granular role-based access control (Admin, Manager, Sales Rep, etc.)
- **Activity Logs** — Track all actions and interactions for full audit trails
- **Responsive UI** — Clean, mobile-friendly interface built with Bootstrap / AdminLTE

---

## 🛠 Tech Stack

| Layer       | Technology              |
|-------------|-------------------------|
| Backend     | Laravel (PHP)           |
| Frontend    | Blade Templates, Bootstrap / AdminLTE |
| Database    | MySQL                   |
| Auth        | Laravel Breeze / Sanctum |
| Server      | Apache / Nginx          |
| Package Mgr | Composer, NPM           |

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed on your system:

- PHP >= 8.1
- Composer
- Node.js & NPM
- MySQL >= 5.7 or MariaDB
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/udaya0125/Sales-Support.git
   cd Sales-Support
   ```

2. **Install PHP dependencies**

   ```bash
   composer install
   ```

3. **Install Node dependencies**

   ```bash
   npm install && npm run build
   ```

### Environment Setup

4. **Copy the example environment file**

   ```bash
   cp .env.example .env
   ```

5. **Generate the application key**

   ```bash
   php artisan key:generate
   ```

6. **Configure your `.env` file**

   Open `.env` and update the following fields:

   ```env
   APP_NAME="Sales Support CRM"
   APP_URL=http://localhost

   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=sales_support
   DB_USERNAME=your_db_user
   DB_PASSWORD=your_db_password
   ```

7. **Run database migrations and seeders**

   ```bash
   php artisan migrate --seed
   ```

### Running the Application

8. **Start the development server**

   ```bash
   php artisan serve
   ```

   Visit [http://localhost:8000](http://localhost:8000) in your browser.

> **Default Admin Credentials** (seeded):
> - Email: `admin@example.com`
> - Password: `password`
>
> ⚠️ Change these immediately after first login.

---

## 📁 Project Structure

```
Sales-Support/
├── app/
│   ├── Http/Controllers/   # Application controllers
│   ├── Models/             # Eloquent models
│   └── Services/           # Business logic layer
├── database/
│   ├── migrations/         # Database schema migrations
│   └── seeders/            # Database seeders
├── resources/
│   ├── views/              # Blade templates
│   └── js/                 # Frontend JS assets
├── routes/
│   └── web.php             # Web routes
├── public/                 # Publicly accessible assets
└── .env.example            # Environment variable template
```

---

## 📸 Screenshots

> Screenshots of the dashboard, lead management, and reports sections can be viewed at the live demo:
> 👉 [https://crm.saitsolution.com.np](https://crm.saitsolution.com.np)

---

## 🤝 Contributing

Contributions are welcome! To get started:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit: `git commit -m "Add your feature"`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

Please make sure your code follows PSR-12 coding standards and includes relevant tests where applicable.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙋 Support

For issues, questions, or feature requests, please open an [issue on GitHub](https://github.com/udaya0125/Sales-Support/issues) or contact the team at [SAIT Solution](https://saitsolution.com.np).

---

<p align="center">Made with ❤️ by <a href="https://saitsolution.com.np">SAIT Solution</a></p>