# Ophthalmology Resident Schedules

A React application for visualizing resident rotation schedules, call shifts, and vacation requests.

## Setup & Running Locally

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Run Development Server:**
    ```bash
    npm run dev
    ```
    Open `http://localhost:5173` in your browser.

## Deployment to GitHub Pages

This project is configured to deploy easily to GitHub Pages.

1.  **Create a Repository:**
    Create a new repository on GitHub and push this code to it.

    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    git branch -M main
    git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPO_NAME>.git
    git push -u origin main
    ```

2.  **Deploy:**
    Run the deploy script. This will build the project and push the `dist` folder to a `gh-pages` branch.
    
    ```bash
    npm run deploy
    ```

3.  **Configure GitHub:**
    Go to your repository settings on GitHub -> Pages. Ensure the source is set to the `gh-pages` branch.

## Customization

*   **Tailwind:** This project currently uses the Tailwind CSS CDN in `index.html` for simplicity.
*   **Data:** Data is loaded from `services/scheduleService.ts`. You can upload CSVs via the UI to override the defaults.
