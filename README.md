# 🏡 urbnb - Vacation Rental Platform

> A pixel-perfect, end-to-end clone of Airbnb, featuring real-time booking, instant messaging, and a robust search engine.

**Live Demo:**  https://airbnb-backend-aavq.onrender.com
**Backend Repository:** https://github.com/Tsoorh/AirBnB-backend


<img width="1904" height="907" alt="image" src="https://github.com/user-attachments/assets/c0d6c11d-37b0-4e98-b1ea-16ad36fdabe0" />


---

## 📖 About The Project

RentMe is a fully functional Single Page Application (SPA) designed to facilitate vacation rentals. The project demonstrates a complex frontend architecture handling diverse data types, real-time communication, and optimistic UI updates.

Built as a capstone project, it mimics the core functionality of major booking platforms, focusing on UX/UI fidelity and performance.

### ✨ Key Features

* **Advanced Search & Filtering:** Dynamic filtering by amenities, price range, and location using URL search params for shareability.
* **Real-Time Interactions:**
    * **Instant Messaging:** WebSocket-based chat between hosts and guests.
    * **Live Notifications:** Toast notifications for booking status updates (`UserMsg`).
* **Booking Management:** Complete reservation flow with calendar integration.
* **Review System:** CRUD operations for user reviews and ratings.
* **Dashboard:** specialized dashboards for both Guests and Hosts to manage trips and assets.

---

## 🛠 Tech Stack

**Core:**
* **React 18** (Hooks & Functional Components)
* **Vite** (Build tool)
* **Redux** (State Management with Thunk for async actions)

**Styling:**
* **SCSS Modules** (Scoped styling)
* **BEM Methodology** (Naming convention)
* **CSS Grid & Flexbox** (Layouts)

**Services & Utilities:**
* **Socket.io Client** (Real-time communication)
* **Axios** (HTTP Requests)
* **Custom Event Bus** (Decoupled component communication)

---

## 🏗 Architecture & Design

### State Management (Redux)
The application uses a centralized store divided into domain-specific modules to maintain separation of concerns:
* `stayModule`: Handles inventory, filtering logic, and CRUD operations.
* `userModule`: Manages authentication, profiles, and wishlists.
* `systemModule`: Controls global UI states (modals, loaders).

### Styling Strategy
We implemented a scalable SCSS architecture inspired by the "7-1 Pattern":
* `basics/`: Reset, typography, and atomic helpers.
* `setup/`: Global variables (colors, spacing) and mixins for responsiveness.
* `cmps/`: Component-specific styles ensuring modularity.

### Service Layer
Logic is decoupled from UI components using dedicated service files:
* `http.service.js`: Wrapper for Axios with interceptors.
* `socket.service.js`: Singleton for managing WebSocket connections.
* `stay.service.js`: Business logic for pricing and data normalization.

---

## 🚀 Getting Started

### Prerequisites
* Node.js (v16+)
* NPM

### Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/your-username/rentme-frontend.git](https://github.com/your-username/rentme-frontend.git)
    cd rentme-frontend
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run the project**
    ```bash
    npm run dev
    ```

---

## 🤝 Contributing
This project was built by a team of developers.
* **Tsoor Hartov** - https://www.linkedin.com/in/tsoorhartov/
* **Inbal Carmy** - https://www.linkedin.com/in/inbal-carmy-22205222a/
* **Naor Tzadok** - https://www.linkedin.com/in/naortzadok/

---

## 📄 License
Distributed under the MIT License.

---


