# mc2-conference-demo

This repo is a starter template to build, style, and deploy lightweight React apps to Salesforce Marketing Cloud CloudPages. It uses Vite for blazing-fast builds and Tailwind CSS for responsive styling. Built assets are deployed via SFMC Code Resources and embedded into CloudPages. This repo uses API hosted on code resource and written on SSJS.

---

# 🚀 SFMC Vite + TailwindCSS Starter

This repository contains a lightweight, modern frontend boilerplate using **Vite**, **React**, and **Tailwind CSS**, built specifically for projects targeting **Salesforce Marketing Cloud (SFMC) CloudPages**.

It simplifies frontend development while making it easy to integrate compiled HTML, JS, and CSS assets into SFMC via **CloudPages** and **Code Resources**.
It also helps in using modern frameworks to improve the capbility of the UI.

---

## 🧰 Tech Stack

- [Vite](https://vitejs.dev/) – Fast dev server & bundler  
- [React](https://react.dev/) – UI Library  
- [Tailwind CSS](https://tailwindcss.com/) – Utility-first CSS framework  
- [Salesforce Marketing Cloud](https://www.salesforce.com/products/marketing-cloud/)

---

## ⚙️ Getting Started

### 1. Create a new project with Vite

```bash
npm create vite@latest [project-name] 
cd [project-name]
```

### 2. Install Tailwind CSS

```bash
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p
```

Update `tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Update `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```
 
### 3. Testing the configuraiton


Copy the below code in app.jsx

 ```js
export default function App() {
  return (
    <h1 className="text-3xl font-bold underline">
      Hello world!
    </h1>
  )
}
 ```

Run the below command to test locally.

 ```bash

npm run dev

 ```


---

## 🧱 Build the Frontend for the Project

```bash
npm run build
```

This generates the `dist/` folder containing:

- `index.html`
- `assets/index-[hash].js`
- `assets/index-[hash].css`

---

## ☁️ Deploying Frontend to Salesforce Marketing Cloud (SFMC)

### 📝 Step 1: Create a CloudPage

1. Log in to SFMC
2. Go to **CloudPages**
3. Create a new **Landing Page** 
   - Name: e.g., `app-index.html`
4. Open `dist/index.html` in local code editor, copy its content, and paste it into the landing page.
5. Save the Landing page. (don’t publish yet)

---

### 📦 Step 2: Upload JavaScript File

1. Go to **CloudPages**
2. Create a new **Code Resource**
   - Type: `JavaScript`
   - Name: e.g., `app.js`
3. Copy the content of `dist/assets/index-[hash].js` and paste it
4. Save and **Publish**
5. Copy the **public URL** generated

---

### 🎨 Step 3: Upload CSS File

1. Create another **Code Resource**
   - Type: `CSS`
   - Name: e.g., `app.css`
2. Copy the content of `dist/assets/index-[hash].css` and paste it
3. Save and **Publish**
4. Copy the **public URL** generated

---

### 🔗 Step 4: Link Resources in CloudPage

1. Go back to the **Landing Page** (app-index.html)
2. Replace the `<script>` tag with:

```html
<script type="module" src="https://YOUR_JS_URL.js"></script>
```

3. Replace the `<link>` tag with:

```html
<link rel="stylesheet" href="https://YOUR_CSS_URL.css" />
```

4. Save and **Publish** the landing page

---

## ☁️ Writing the backend API

1. Create  **Code Resource**
   - Type: `Javascript`
2. Copy the SSJS code into the code resource and publish it. 
   - You can handle all the different type of API requests.
   - Helps you easily fetch data from the Data extension by using the Platform library.
   - Returns the JSON response.
3. Save and **Publish**
4. Copy the **public URL** generated and use it as the API endpoint.

## 🔗 Using `CloudPagesURL` for Personalization

When sending an email from SFMC, you can personalize a CloudPage by passing subscriber-specific data using the `CloudPagesURL` function and **query string parameters**.

### ✉️ Example in an Email:

```ampscript
%%[
SET @link = CloudPagesURL(12345, "email", emailaddr, "name", FirstName)
]%%
<a href="%%=RedirectTo(@link)=%%">View Your Offer</a>
```
---

## ✅ Final Notes

- To view how to use SSJS as API, refer to the backend folder in the repository. It has sample API endpoints used in the code.
- To copy and run the repositiory locally, make sure to run the command 

```bash
npm install
```
 before running the code locally.


---

## ✍️ Created By

This repo was created and maintained by **Yuvraj Singh Thakur**.  
Feel free to reach out for collaboration, feedback, or queries:

- 📧 **Email**: [yuvrajthakur30aug@gmail.com](mailto:yuvrajthakur30aug@gmail.com)  
- 💼 **LinkedIn**: [Click here](https://www.linkedin.com/in/yuvraj-singh-thakur-a5b004167/)  

---

## 🛡️ Disclaimer

This project is intended for educational and internal use within **Salesforce Marketing Cloud** environments.  
It is not officially affiliated with or endorsed by Salesforce.  
Please test thoroughly before deploying to production.

---

