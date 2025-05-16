# Dashboard Builder

## Project Description

Dashboard Builder is a Svelte-based application that allows users to create and manage customizable dashboards with various widgets.

## Installation Instructions

1. Clone the repository.
2. Navigate to the project directory.
3. Install dependencies using `npm install`.

## Usage Guidelines

- Run the development server using `npm run dev`.
- Access the application at `http://localhost:3000`.

## Features

- Drag and drop widgets.
- Resize and minimize widgets.
- Save and load dashboard configurations.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License.

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
