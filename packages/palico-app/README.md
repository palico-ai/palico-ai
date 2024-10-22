# Palico App

This is the core framework for Palico App. This framework has the following responsibilities:
- Help developers define their LLM application
- Help developers define their experiments
- Setup an API for other services to communicate with the LLM application
- Manage database tables and schemas

## Development

Make sure you have your workspace setup. If you haven't already, follow the [Workspace Setup](../../CONTRIBUTING.md#workspace-setup) guide.

### One-time Setup
To properly test our changes, we'll need to publish the `palico-app` package to a local npm registry, then consume it from the `sample-app` project. We'll use Verdaccio for this purpose.

1. Setup [Verdaccio](https://verdaccio.org/docs/installation/)
   ```bash
   npm install -g verdaccio
   ```
2. Point `sample-app` to Verdaccio:
   ```bash
   cd sample-app
   echo "registry=https://registry.npmjs.org/" >> ".npmrc"
   echo "@palico-ai:registry=http://localhost:4873/" >> ".npmrc"
   ```
3. Add a reinstall script in `sample-app/package.json`:
   ```json
   "scripts": {
     "rebuild": "(cd ../palico-ai && nx run-many -t publish-local -p palico-app -p common)",
     "reinstall": "npm run rebuild && npm uninstall @palico-ai/app && npm install @palico-ai/app"
   }
   ```

### Testing Changes

1. Make sure Verdaccio is running in a separate console window
   ```bash
   verdaccio
   ```
2. After you have made a change to `packages/palico-app`, publish these changes to `sample-app`:
   ```bash
   cd sample-app
   npm run reinstall
   ```
3. Start `sample-app` and test your changes:
   ```bash
   npm start
   ```