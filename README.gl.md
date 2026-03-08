<p align="center">
  <img src="logos/logo_horizontal_sinFondo.png" alt="TestMind Logo" width="500">
</p>

# 🧠 TestMind - Frontend (Angular)

<p align="center">
    <strong>IDIOMA</strong><br>
    <a href="README.md"><strong>ES</strong></a> &nbsp;|&nbsp; 
    <strong>GL</strong> &nbsp;|&nbsp; 
    <a href="README.en.md"><strong>EN</strong></a>
</p>

---

**TestMind** é unha interface moderna e intuitiva deseñada para a xestión e realización de tests académicos xerados por IA. Esta aplicación SPA (Single Page Application) permite aos usuarios subir apuntamentos en PDF, visualizar os cuestionarios creados e realizar avaliacións en tempo real cunha experiencia de usuario fluída.

Este repositorio contén toda a lóxica da interface, xestión de estados e consumo da API REST.

---

## 🏗️ Arquitectura do Sistema

O proxecto baséase nunha arquitectura de **Frontend e Backend desacoplados**:

* **Frontend (Este repositorio):** Aplicación desenvolvida en **Angular 18/19**. Utiliza compoñentes reactivos e servizos para a comunicación co servidor.
* **Backend:** API REST desenvolvida en **Laravel 11**, encargada do procesamento de ficheiros e integración con Google Gemini.
    > 🔗 **Repositorio do Backend:** [TestMind Laravel](https://github.com/AdrianVG27/TestMind)

---

## 🛠️ Stack Tecnolóxico

* **Framework:** Angular (v18+)
* **Linguaxe:** TypeScript
* **Estilos:** Tailwind CSS / Angular Material
* **Xestión de API:** HttpClient con Interceptores para a xestión de tokens JWT.
* **Iconografía:** Lucide Angular / FontAwesome.

---

## 🚀 Instalación e Configuración

### 1. Clonar e configurar

```bash
# Clonar o repositorio
git clone https://github.com/AdrianVG27/TestMind_front.git
cd TestMind_front

# Instalar dependencias de Node
npm install
```

### 2. Variables de contorna
Crea ou edita o ficheiro `src/environments/environment.ts` (e a súa variante `.prod.ts` se é necesario) para configurar a URL da túa API de Laravel:

```typescript
export const environment = {
    production: false,
    apiUrl: 'http://localhost:8000/api'
};
```

### 3. Execución en desenvolvemento
Para levantar o servidor de desenvolvemento e ver os cambios en tempo real, executa o seguinte comando:

```bash
ng serve
```

A aplicación estará dispoñible por defecto en `http://localhost:4200`.

---

## 📦 Compilación para Produción

Se desexas integrar o frontend dentro do directorio `public/` de Laravel para realizar un despregamento conxunto (monolito servido por Laravel):

1. Xera o build optimizado da aplicación:

```bash
ng build --configuration production
```

2. Copia o contido da carpeta de saída (normalmente situada en `dist/test-mind/browser/`) directamente ao directorio `public/` do teu proxecto backend.

---

## 🔄 Fluxo de Usuario (Frontend)

1. **Autenticación:** O usuario inicia sesión e o `AuthInterceptor` encárgase de adxuntar o token JWT a cada petición HTTP de forma automática.
2. **Subida de PDF:** Envíase o ficheiro ao servidor. Mentres o backend procesa coa IA, o frontend xestiona un estado de carga (loading) reactivo.
3. **Renderizado Dinámico:** Unha vez recibido o JSON do test, Angular mapea os datos a compoñentes reactivos para construír o exame.
4. **Avaliación:** O alumno completa as respostas e o frontend valida os resultados antes de envialos para o seu almacenamento definitivo.

---

## 🚧 En Proceso (Roadmap)

Actualmente, o frontend atópase en fase de mellora continua coas seguintes funcionalidades en desenvolvemento:
- [ ] **Modo Escuro:** Implementación de temas dinámicos.
- [ ] **Dashboard de Analíticas:** Integración de gráficas interactivas con Chart.js para visualizar o progreso do alumno.

---

## ⚖️ Licenza
Este proxecto é de código aberto baixo a licenza [MIT](https://opensource.org/licenses/MIT).

---

## 👨‍💻 Autor
**[@AdrianVG27](https://github.com/AdrianVG27)** - Estudante de Desenvolvemento de Aplicacións Web.
*Este proxecto é o resultado do meu Traballo de Fin de Ciclo (TFC) - 2026.*
