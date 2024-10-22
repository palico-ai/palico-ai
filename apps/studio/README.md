# Palico Studio

Palico Studio is the control panel for your Palico App. It provides a visual interface for previewing your changes, managing experiments, and monitoring telemetry.

## Development

Make sure you have your workspace setup. If you haven't already, follow the [Workspace Setup](../../CONTRIBUTING.md#workspace-setup) guide.

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
