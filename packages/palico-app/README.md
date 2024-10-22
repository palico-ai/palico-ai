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

## Appendix

### Quick-Start for Adding Eval Metrics
For adding eval metrics, you can skip all the other documents in this repo and quickly get started by following the steps below:

1. Fork this [repo](https://github.com/palico-ai/palico-ai) and clone it
   ```
   git clone https://github.com/<github_username>/palico-ai
   ```
   
2. Install npm dependencies
   ```
   cd palico-ai
   npm install
   ```
   
3. Add your changes for new metric in `packages/palico-app/src/experiments/metrics` folder. You will need to include the following changes:
   - [ ] Add metric definition ([example](https://github.com/palico-ai/palico-ai/pull/231/files#diff-ffbf5304f03b37c5949aa4255bf1db198352a9c4d3358a112d7726fc9162ad32))
   - [ ] Add unit tests ([example](https://github.com/palico-ai/palico-ai/pull/231/files#diff-0177e7c63f5617405450863b6b37fc97ee7f60ab47e6eb530d3e9410da0ac7ac))
   - [ ] Export the metric file ([example](https://github.com/palico-ai/palico-ai/pull/231/files#diff-16f7b08a649aecae44fa196ac5c6f7fcaf1e7a8e2a6986d6f266927cdb3da3d4))  

4. Confirm project builds properly
   ```
   npx nx run sanity-check
   ```
   
5. Pull Request
