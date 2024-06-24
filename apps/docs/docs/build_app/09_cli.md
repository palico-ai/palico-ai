# Palico CLI

Palico CLI is a command-line interface that helps you manage your Palico App. To use the Palico CLI, make sure you have a script in your `package.json` file that looks like this:

```json
{
  "scripts": {
    "palico": "palico-app"
  }
}
```

## Generate API Keys
You can generate API Key using the following command:

```bash
npm run palico generate apikey
```

## Bootstrap Resources
When you setup your Palico App in a new enviornment, for example, when you clone your Palico App to a new machine, you have to bootstrap the required resources using the following command:

```bash
npm run palico bootstrap
```

## Starting your Development Server
You can start your development server using the following command:

```bash
npm run palico start
```

If you have created your palico app using Palico CLI, you can also just run `npm start` to start your development server.