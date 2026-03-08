<p align="center">
  <img src="logos/logo_horizontal_sinFondo.png" alt="TestMind Logo" width="500">
</p>

# 🧠 TestMind - Frontend (Angular)

<p align="center">
    <strong>IDIOMA</strong><br>
    <strong>ES</strong> &nbsp;|&nbsp; 
    <a href="README.gl.md"><strong>GL</strong></a> &nbsp;|&nbsp; 
    <a href="README.en.md"><strong>EN</strong></a>
</p>

---

**TestMind** es una interfaz moderna e intuitiva diseñada para la gestión y realización de tests académicos generados por IA. Esta aplicación SPA (Single Page Application) permite a los usuarios subir apuntes en PDF, visualizar los cuestionarios creados y realizar evaluaciones en tiempo real con una experiencia de usuario fluida.

Este repositorio contiene toda la lógica de la interfaz, gestión de estados y consumo de la API REST.

---

## 🏗️ Arquitectura del Sistema

El proyecto se basa en una arquitectura de **Frontend y Backend desacoplados**:

* **Frontend (Este repositorio):** Aplicación desarrollada en **Angular 18/19**. Utiliza componentes reactivos y servicios para la comunicación con el servidor.
* **Backend:** API REST desarrollada en **Laravel 11**, encargada del procesamiento de archivos e integración con Google Gemini.
    > 🔗 **Repositorio del Backend:** [TestMind Laravel](https://github.com/AdrianVG27/TestMind)

---

## 🛠️ Stack Tecnológico

* **Framework:** Angular (v18+)
* **Lenguaje:** TypeScript
* **Estilos:** Tailwind CSS / Angular Material
* **Gestión de API:** HttpClient con Interceptores para la gestión de tokens JWT.
* **Iconografía:** Lucide Angular / FontAwesome.

---

## 🚀 Instalación y Configuración

### 1. Clonar y configurar

```bash
# Clonar el repositorio
git clone [https://github.com/AdrianVG27/TestMind_front.git](https://github.com/AdrianVG27/TestMind_front.git)
cd TestMind_front

# Instalar dependencias de Node
npm install
```

### 2. Variables de entorno
Crea o edita el archivo `src/environments/environment.ts` (y su variante `.prod.ts` si es necesario) para configurar la URL de tu API de Laravel:

```typescript
export const environment = {
    production: false,
    apiUrl: 'http://localhost:8000/api'
};
```

### 3. Ejecución en desarrollo
Para levantar el servidor de desarrollo y ver los cambios en tiempo real, ejecuta el siguiente comando:

```bash
ng serve
```

La aplicación estará disponible por defecto en `http://localhost:4200`.

---

## 📦 Compilación para Producción

Si deseas integrar el frontend dentro del directorio `public/` de Laravel para realizar un despliegue conjunto (monolito servido por Laravel):

1. Genera el build optimizado de la aplicación:

```bash
ng build --configuration production
```

2. Copia el contenido de la carpeta de salida (normalmente ubicada en `dist/test-mind/browser/`) directamente al directorio `public/` de tu proyecto backend.

---

## 🔄 Flujo de Usuario (Frontend)

1. **Autenticación:** El usuario inicia sesión y el `AuthInterceptor` se encarga de adjuntar el token JWT a cada petición HTTP de forma automática.
2. **Subida de PDF:** Se envía el archivo al servidor. Mientras el backend procesa con la IA, el frontend gestiona un estado de carga (loading) reactivo.
3. **Renderizado Dinámico:** Una vez recibido el JSON del test, Angular mapea los datos a componentes reactivos para construir el examen.
4. **Evaluación:** El alumno completa las respuestas y el frontend valida los resultados antes de enviarlos para su almacenamiento definitivo.

---

## 🚧 En Proceso (Roadmap)

Actualmente, el frontend se encuentra en fase de mejora continua con las siguientes funcionalidades en desarrollo:
- [ ] **Modo Oscuro:** Implementación de temas dinámicos.
- [ ] **Dashboard de Analíticas:** Integración de gráficas interactivas con Chart.js para visualizar el progreso del alumno.

---

## ⚖️ Licencia
Este proyecto es de código abierto bajo la licencia [MIT](https://opensource.org/licenses/MIT).

---

## 👨‍💻 Autor
**[@AdrianVG27](https://github.com/AdrianVG27)** - Estudiante de Desarrollo de Aplicaciones Web.
*Este proyecto es el resultado de mi Trabajo de Fin de Ciclo (TFC) - 2026.*
