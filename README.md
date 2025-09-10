# WhizLite | Secure Pairing Code System

![Version](https://img.shields.io/badge/version-5.3-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0-brightgreen.svg)
![Made by WHIZ MBURU](https://img.shields.io/badge/author-WHIZ%20MBURU-blueviolet)

A modern, secure, and visually stunning single-page web application to generate a WhatsApp Session ID using the Baileys Pairing Code system. This project provides a user-friendly and secure interface, replacing the need for scanning a QR code.

---

## ✨ Key Features

-   **Secure Pairing Code Generation:** Connects directly to WhatsApp servers to generate a temporary, secure code.
-   **Real-time UI Updates:** Built with Socket.IO for instant status updates without page reloads.
-   **Click-to-Copy:** Easily copy the generated pairing code with a single click.
-   **Restart Without Refresh:** Get a new code or pair another number seamlessly from the final screen.
-   **Responsive "Blue-Tech" Dark Theme:** A polished and professional user interface that looks great on both desktop and mobile devices.
-   **Instant Session ID Delivery:** The final session ID (prefixed with `WHIZ_`) is sent directly and securely to your "Message Myself" chat on WhatsApp.
-   **Automatic & Secure Cleanup:** All sensitive session files are permanently deleted from the server immediately after successful pairing.

## 📸 Screenshot

![WhizLite Screenshot](https://i.ibb.co/L5w29mD/whizlite-preview.png)
*The main interface of the WhizLite Pairing Code system.*

---

## 🛠️ Technology Stack

-   **Backend:** Node.js, Express.js
-   **Real-time Engine:** Socket.IO
-   **Frontend:** EJS (Embedded JavaScript), Tailwind CSS (for layout), Custom CSS
-   **WhatsApp Engine:** [@whiskeysockets/baileys](https://github.com/WhiskeySockets/Baileys) (`v6.5.0`)
-   **Phone Validation:** `libphonenumber-js`

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

You must have the following software installed on your machine:
-   [Node.js](https://nodejs.org/) (Version 18.x or higher is recommended)
-   npm (Node Package Manager, comes with Node.js)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/whizlite-final.git](https://github.com/your-username/whizlite-final.git)
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd whizlite-final
    ```

3.  **Install the dependencies:**
    ```bash
    npm install
    ```

4.  **Start the server:**
    ```bash
    npm start
    ```

5.  Once the server is running, you will see the following message in your terminal:
    `WHIZLITE Server v5.3 (Final) is running on http://localhost:3000`

6.  Open your favorite web browser and navigate to **`http://localhost:3000`**.

---

## 📖 How to Use

1.  The webpage will load with an input box.
2.  Enter your full WhatsApp number, including your country code (e.g., `254712345678`).
3.  Click the **"Get Code"** button.
4.  The interface will display a temporary 8-character pairing code (e.g., `ABCD-EFGH`).
5.  **Click the code** on the screen to instantly copy it.
6.  Open WhatsApp on your phone and go to `Settings > Linked Devices > Link a device > Link with phone number instead`.
7.  Enter the copied code.
8.  Once pairing is successful, check your "Message Myself" chat in WhatsApp. You will receive two messages: one with your `WHIZ_` prefixed Session ID, and a second welcome message.

---

## ⚠️ Security Warning

Your Session ID provides complete access to your WhatsApp account, just like a password.

-   **NEVER share your Session ID with anyone.**
-   **DO NOT post your Session ID publicly** (e.g., on GitHub, Pastebin, etc.).
-   This application is designed to be secure by deleting session files from the server instantly. Always ensure you are running a trusted version of this code.

---

## ✍️ Author

-   **WHIZ MBURU** - *Project Blueprint & Lead Developer*

---

## 📄 License

This project is licensed under the MIT License.
