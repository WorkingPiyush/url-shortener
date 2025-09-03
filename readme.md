# 🚀 URL Shortener

A simple and efficient URL shortening service built with Node.js and Express with the Frontend.

## 📝 Table of Contents

- [Features](#-features)  
- [Tech Stack](#-tech-stack)  
- [Project Structure](#-project-structure)  
- [Getting Started](#-getting-started)  
  - [Prerequisites](#prerequisites)  
  - [Installation](#installation)  
  - [Running the App](#running-the-app)  
- [Usage](#-usage)  
- [API Endpoints](#api-endpoints)  
- [Environment Variables](#environment-variables)  
- [Contributing](#-contributing)  
- [License](#-license)

---

## ✨ Features

- Shorten long URLs with unique, human-readable codes  
- Redirect from short URLs to their original long URLs  
- Organized code with MVC-like structure: controllers, models, routes, middleware  
- Easily connectable to various databases (e.g., MongoDB, PostgreSQL) via `connectDB.js`  
- Proper Authentication of User 

---

## 🛠 Tech Stack

- **Node.js** — JavaScript runtime for server-side execution  
- **Express** — Fast, minimalist web framework  
- **Database** — MongoDB Atlas using logic in `connectDB.js`  
- **Folder Structure:**  
  - `controllers/` — request handlers and business logic  
  - `middleware/` — for reusable request processing (e.g. validation, auth)  
  - `models/` — data schema definitions  
  - `public/` — client files / front faces of the app 
  - `routes/` — API endpoint definitions  
  - `app.js` — main Express application file  
  - `connectDB.js` — database connection utility  

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v14 or newer  
- [npm](https://www.npmjs.com/) (comes with Node)  
- A database (e.g., MongoDB, PostgreSQL) if you want persistent storage

### Installation

```bash
git clone https://github.com/WorkingPiyush/url-shortener.git
cd url-shortener
npm install
```

## 🚀 Running the App
1. Set up your .env file in the project root with appropriate variables.
2. Start the server:
```bash
npm start
```
3. The service will be running at http://localhost:3000

## Usage
1. Send a POST request to /shorten with a JSON body containing the long URL:
```json
{
  "OriginalUrl": "https://example.com/very/long/path"
}
```
2. Get back a response containing the shortened URL.
3. Access the shortened link in your browser — you'll be redirected to the original URL.

## API Endpoints
Endpoint		
		
	

| Endpoint |  Method  | Description |
|:-----|:--------:|------:|
| /short  | POST | Generate a new short URL |
| /getmy-Url   |  GET  |  Genrated Urls  by the user |
| /details/:shortUrl   |  GET  |  Detailed analytics of the selected Url |
| /update/:shortUrl   |  PUT  |  Extend the validity of the Url |


## Environment Variables
Create a .env file with the following
``` env
PORT = 7001
MONGO_DB_URI = <your_database_connection_string>
JWT_SECRET = <your_jwt_secret>
BASE=http://localhost:7001
```