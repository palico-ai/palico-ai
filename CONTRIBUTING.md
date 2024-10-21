## Welcome
Thank you for considering contributing to Palico AI! We are at the very early stage of this framework and we'd love your help to make this the best AI Development Framework for developers! Whether you're reporting a bug, suggesting a feature, improving documentation, or writing code, your contributions are invaluable to us.

## Ways to Contribute
1. [Bug Reports](https://github.com/palico-ai/palico-ai/issues/new?assignees=&labels=&projects=&template=bug_report.md&title=)
2. [Feature Requests](https://github.com/palico-ai/palico-ai/issues/new?assignees=&labels=&projects=&template=feature_request.md&title=)
3. [Documentation](https://github.com/palico-ai/docs)
4. [Code Contributions](#code-contributions)


## Code Contributions
We encourage you to explore the existing [issues](https://github.com/palico-ai/palico-ai/issues) to see how you can make a meaningful impact. This document will help you setup your development environment.

### Workspace Setup
We want to setup the following folder structure:
```
palico-workspace/
├── palico-ai/
├── sample-app/
```
- **`palico-ai`**: This is the main repository you will make feature changes.
- **`sample-app`**: This is a sample application that uses the Palico AI framework.

#### Steps

1. Create a new folder called `palico-workspace` and navigate to it:
    ```bash
    mkdir palico-workspace
    cd palico-workspace
    ```
    
2. Fork this [repo](https://github.com/palico-ai/palico-ai) and clone it:
    ```bash
    git clone https://github.com/<github_username>/palico-ai
    ```
    
3. Setup `sample-app` for testing your changes:
    ```bash
    npx palico init sample-app
    ```
    
4. Setup `palico-ai` repo 
    ```bash
    cd palico-ai
    cp .template.env .env
    npm install
    ```
    
5. Install `nx` for managing `palico-ai` monorepo
   ```
   npm install -g nx
   ```
   
6. Open `palico-workspace` in VSCode (or your preferred editor)
   ```bash
   cd palico-workspace
   code .
   ```
   
7. Update `sample-app/.env` with your OpenAI API key.
    ```bash
    OPENAI_API_KEY=sk-<your-api-key>
    ```

### Testing Changes

#### Palico Studio

Palico Studio is the Control Panel for your Palico App. Source-code for Studio is located in `apps/studio`. Test your changes in Palico Studio by following the steps below:

1. Start `sample-app`
   ```bash
   # location: palico-workspace/sample-app
   npm start
   ```
   
2. Check that `PALICO_AGENT_API_URL` in `palico-ai/.env` is set to the correct API URL from the console output from previous step.
   ```bash
   # location: palico-workspace/palico-ai/.env
   PALICO_AGENT_API_URL="http://localhost:8000"
   ```
   
3. In a separate terminal window, from `palico-ai` directory, start studio:
   ```bash
   # location: palico-workspace/palico-ai
   nx run studio:dev
   ```

#### Palico Landing Page
Refers to https://www.palico.ai/

Start the website app locally
```bash
# location: palico-workspace/palico-ai
nx run website:dev
```


#### Core Framework
This is the core framework for your Palico Application. This is located in `packages/palico-app`

##### One-time setup

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
    
##### Testing Changes
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


### Pull Request
Prior to submitting a pull request. Make sure your code is properly formatted and builds successfully. 
```bash
nx run sanity-check
```
