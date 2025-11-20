# 🧮 Tax Calculator Application

A 3 tier full-stack web application for calculating income tax under both
**Old** and **New** Regimes with user authentication, calculation
history, JWT-based security, and responsive UI.

## 📋 Table of Contents

-   [Application Overview](#-application-overview)\
-   [Architecture & File Structure](#-architecture--file-structure)\
-   [Prerequisites](#-prerequisites)\
-   [Setup Guide](#-setup-guide)\
-   [Backend Configuration](#-backend-configuration)\
-   [Frontend Configuration](#-frontend-configuration)\
-   [Build & Deployment](#-build--deployment)\
-   [Validation & Testing](#-validation--testing)\
-   [Database Verification](#-database-verification)\

------------------------------------------------------------------------

# 🏗️ Application Overview

A complete **Java Spring Boot + React** tax calculator with:

### ⭐ Key Features

-   User Authentication (Signup, Login, Forgot Username, Forgot
    Password)
-   Old & New Regime Tax Calculation (FY 2024-25 & 2025-26)
-   Calculation History
-   Responsive Dark/Light Theme UI

------------------------------------------------------------------------

# 📁 Architecture & File Structure

TaxCalcWebApp/

## Backend (Spring Boot)

├── backend
│   ├── pom.xml
│   └── src
│       └── main
│           ├── java
│           │   └── com
│           │       └── example
│           │           └── taxcalculator
│           │               ├── config
│           │               │   └── AppConfig.java
│           │               ├── controller
│           │               │   ├── AuthController.java
│           │               │   ├── ConfigController.java
│           │               │   ├── TaxController.java
│           │               │   └── TaxHistoryController.java
│           │               ├── dto
│           │               │   ├── ChangePasswordRequest.java
│           │               │   ├── ForgotUsernameRequest.java
│           │               │   ├── ForgotUsernameResponse.java
│           │               │   ├── TaxHistoryResponse.java
│           │               │   ├── TaxRequest.java
│           │               │   └── TaxResponse.java
│           │               ├── model
│           │               │   ├── TaxCalculation.java
│           │               │   └── User.java
│           │               ├── repository
│           │               │   ├── TaxCalculationRepository.java
│           │               │   └── UserRepository.java
│           │               ├── security
│           │               │   ├── JwtFilter.java
│           │               │   ├── JwtUtil.java
│           │               │   └── SecurityConfig.java
│           │               ├── service
│           │               │   └── TaxService.java
│           │               └── TaxCalculatorApplication.java
│           └── resources
│               ├── application.properties
│               └── static
│                   └── index.html

## Frontend (React + Tailwind + Vite)

├── frontend
│   ├── .env
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── postcss.config.js
│   ├── src
│   │   ├── api.js
│   │   ├── App.jsx
│   │   ├── components
│   │   │   ├── Button.jsx
│   │   │   ├── InputField.jsx
│   │   │   └── Navbar.jsx
│   │   ├── context
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── main.jsx
│   │   ├── pages
│   │   │   ├── ChangePassword.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── TaxCalculator.jsx
│   │   └── styles.css
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md

## Database (Postgres SQL)

------------------------------------------------------------------------

# ⚙️ Prerequisites

-   Ubuntu 22.04 LTS\
-   Java 17+\
-   Node.js 18+\
-   PostgreSQL 14+\
-   Git

------------------------------------------------------------------------

# 🚀 Setup Guide

## Step 1: Update System

``` bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y git wget curl gnupg software-properties-common
sudo apt install -y net-tools #(optional)
```

## Step 2: Install Java 17

``` bash
sudo apt install -y openjdk-17-jdk
java -version
```

## Step 3: Install Node.js 18

``` bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node --version
```

## Step 4: Install PostgreSQL

``` bash
sudo apt install -y postgresql postgresql-contrib
sudo systemctl enable --now postgresql
sudo systemctl status postgresql
```

## Step 5: Create Database & User

``` bash
sudo -i -u postgres

psql -c "CREATE DATABASE tax_calculator;"
psql -c "CREATE USER tax_user WITH PASSWORD 'tax_pass';"
psql -c "GRANT ALL PRIVILEGES ON DATABASE tax_calculator TO tax_user;"

exit
```

## Step 6: Clone the Repository

``` bash
git clone <your-repository-url>
cd tax-calculator-app
```

------------------------------------------------------------------------

# 🛠️ Backend Configuration

Edit: `backend/src/main/resources/application.properties`

``` properties
app.frontend.url=http://your-server-ip:5173
app.backend.url=http://your-server-ip:8080

spring.datasource.url=jdbc:postgresql://localhost:5432/tax_calculator
spring.datasource.username=tax_user
spring.datasource.password=tax_pass

```

------------------------------------------------------------------------

# 🎨 Frontend Configuration

edit `.env` inside `frontend/`:
    VITE_API_URL=http://your-server-ip:8080

------------------------------------------------------------------------

# 🏗️ Build & Deployment

## Backend Build

``` bash
cd backend
mvn clean package
java -jar target/tax-calculator-0.0.1-SNAPSHOT.jar
```

## Frontend Run

``` bash
cd frontend
npm install
npm run dev
```

------------------------------------------------------------------------

# 🧪 Validation & Testing

-   Access webpage → `http://your-server-ip:5173`
-   Perform registration, login, tax calculations
-   Test password recovery & history

------------------------------------------------------------------------

# 🗄️ Database Verification

``` sql


# Login
sudo -u postgres psql -d tax_calculator
psql -h localhost -U tax_user -d tax_calculator  #or
psql postgresql://tax_user:tax_pass@localhost:5432/tax_calculator #or
# Switch to postgres user first
sudo -i -u postgres
psql -d tax_calculator -U tax_user

# Check users table
SELECT * FROM app_user;
SELECT id, username, full_name FROM app_user;
SELECT * FROM tax_calculations;
SELECT calculated_at AT TIME ZONE 'Asia/Kolkata' FROM tax_calculations;

# Check tax calculations
SELECT id, regime, financial_year, total_package, calculated_at 
FROM tax_calculations 
WHERE user_id = (SELECT id FROM app_user WHERE username = 'exampleuser');

# Count records
SELECT COUNT(*) as total_users FROM app_user;
SELECT COUNT(*) as total_calculations FROM tax_calculations;

# Verify IST timestamps
SELECT id, calculated_at AT TIME ZONE 'Asia/Kolkata' as ist_time 
FROM tax_calculations;
\q
```

------------------------------------------------------------------------

# End Session

### Kill Process on Port 8080

``` bash
sudo lsof -i :8080 or 
ps aux | grep java
ps aux | grep node
sudo kill -9 <PID>
```

### Delete Source Code

``` bash
sudo rm -rf directory/
```

