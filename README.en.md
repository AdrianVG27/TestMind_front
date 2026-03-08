# 🧠 TestMind - Frontend (Angular)

<p align="center">
    <strong>LANGUAGE</strong><br>
    <a href="README.md"><strong>ES</strong></a> &nbsp;|&nbsp; 
    <a href="README.gl.md"><strong>GL</strong></a> &nbsp;|&nbsp; 
    <strong>EN</strong>
</p>

---

**TestMind** is a modern and intuitive interface designed for managing and taking AI-generated academic tests. This SPA (Single Page Application) allows users to upload PDF notes, view created questionnaires, and complete real-time assessments with a smooth user experience.

This repository contains all the interface logic, state management, and REST API consumption.

---

## 🏗️ System Architecture

The project is based on a **Decoupled Frontend and Backend** architecture:

* **Frontend (This repository):** Application developed in **Angular 18/19**. It uses reactive components and services for server communication.
* **Backend:** REST API developed in **Laravel 11**, responsible for file processing and Google Gemini integration.
    > 🔗 **Backend Repository:** [TestMind Laravel](https://github.com/AdrianVG27/TestMind)

---

## 🛠️ Technology Stack

* **Framework:** Angular (v18+)
* **Language:** TypeScript
* **Styles:** Tailwind CSS / Angular Material
* **API Management:** HttpClient with Interceptors for JWT token management.
* **Iconography:** Lucide Angular / FontAwesome.

---

## 🚀 Installation & Setup

### 1. Clone and Configure

```bash
# Clone the repository
git clone https://github.com/AdrianVG27/TestMind_front.git
cd TestMind_front

# Install Node dependencies
npm install
```

### 2. Environment Variables
Create or edit the `src/environments/environment.ts` file (and its `.prod.ts` variant if necessary) to configure your Laravel API URL:

```typescript
export const environment = {
    production: false,
    apiUrl: 'http://localhost:8000/api'
};
```

### 3. Development Execution
To launch the development server and see changes in real-time, run the following command:

```bash
ng serve
```

The application will be available by default at `http://localhost:4200`.

---

## 📦 Production Build

If you wish to integrate the frontend into the Laravel `public/` directory for a joint deployment (monolith served by Laravel):

1. Generate the optimized build of the application:

```bash
ng build --configuration production
```

2. Copy the content of the output folder (usually located in `dist/test-mind/browser/`) directly into the `public/` directory of your backend project.

---

## 🔄 User Workflow (Frontend)

1. **Authentication:** The user logs in, and the `AuthInterceptor` automatically attaches the JWT token to every HTTP request.
2. **PDF Upload:** The file is sent to the server. While the backend processes it with AI, the frontend manages a reactive loading state.
3. **Dynamic Rendering:** Once the test JSON is received, Angular maps the data to reactive components to build the exam.
4. **Evaluation:** The student completes the answers, and the frontend validates the results before sending them for final storage.

---

## 🚧 In Progress (Roadmap)

Currently, the frontend is in a continuous improvement phase with the following features under development:
- [ ] **Dark Mode:** Implementation of dynamic themes.
- [ ] **Analytics Dashboard:** Integration of interactive charts with Chart.js to visualize student progress.

---

## ⚖️ License
This project is open-source under the [MIT License](https://opensource.org/licenses/MIT).

---

## 👨‍💻 Author
**[@AdrianVG27](https://github.com/AdrianVG27)** - Web Application Development Student.
*This project is the result of my Final Project (TFC) - 2026.*
