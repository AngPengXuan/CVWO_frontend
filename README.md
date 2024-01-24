# CVWO assignment frontend

A minimal implementation of the assignment, a forum that users can register and login, and perform basic CRUD operations for forum threads and comments.

The frontend has been deployed using Netlify [here](https://melodious-choux-dce252.netlify.app/)

## Getting Started

### Running the app
1. [Fork](https://docs.github.com/en/get-started/quickstart/fork-a-repo#forking-a-repository) this repo.
2. [Clone](https://docs.github.com/en/get-started/quickstart/fork-a-repo#cloning-your-forked-repository) **your** forked repo.
3. Update the file in src/utils/DeploymentConfig.ts to use local backend instead of deployed backend:
```
export const backendLink = "http://localhost:3000/";
//export const backendLink = "https://cvwo-backend-2voo.onrender.com/"
```

4. Open your terminal and navigate to the directory containing your cloned project.
5. Install dependencies for the project by entering this command:

```bash
yarn install
```
6. Run the app in development mode by entering this command:

```bash
yarn dev
```

7. Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

## Additional Notes
-   This project uses [Typescript](https://www.typescriptlang.org/).

## Acknowledgements

1. This project was bootstrapped with [Create Vite](https://github.com/vitejs/vite/tree/main/packages/create-vite).
2. This project uses [MUI](https://mui.com/),
[TypewriterJS](https://github.com/tameemsafi/typewriterjs#readme), [Prettier](https://prettier.io/).
3. Authentication page design was referenced from the following tutorial: [Create a simple React app (TypeScript) with Login / Register pages](https://medium.com/@prabhashi.mm/create-a-simple-react-app-typescript-with-login-register-pages-using-create-react-app-e5c12dd6db53)

