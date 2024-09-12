# Preview Your Changes

Once you have built your agent, you can preview your changes in the Palico Studio. The Palico Studio is a web-based interface that lets you chat with your agent and see the responses in real-time.

Start your Palico App by running the following command:

```bash
npm start
```

Find your Palico Studio url in the terminal output. It should look something like this:

```bash
Palico Studio: http://localhost:3000
Tracing UI: http://localhost:16686
Database URL: postgresql://root:root@localhost:5433/palicoapp
API URL: http://localhost:8000
```
By default, the Palico Studio runs on http://localhost:3000. Open this URL in your browser to access the Palico Studio.

## Chat with your Agent

From Palico Studio, we can use the chat page to interact with our agent. You can type a message in the chat box and press Enter to send it to your agent.

![Chat UI](../../static/img/studio/chat_ui.png)
You can also pass in additional data from using the Request Payload tab, or use the App Config tab to manage feature flags and other configurations. Learn more about App Config in the [Hot-Swap Components](./03_feature_flag.md) section.

## Compare Responses Side-by-Side
You can use the quick-lab tab to compare responses from different variations of your LLM Agents side-by-side. You can compare responses across different agents, or with different app configs enabled.

![Quick Lab](../../static/img/studio/quicklab.png)