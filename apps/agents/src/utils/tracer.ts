enum TraceSeverity {
  Info = "info",
  Warning = "warning",
  Error = "error",
}

interface TraceMessage {
  severity: string;
  label: string;
  data?: Record<string, unknown>;
  timestamp: string;
}

interface TraceLevel {
  label: string;
  parent?: TraceLevel;
  content: (TraceMessage | TraceLevel)[];
}

interface ConversationTraces {
  conversationId: number;
  trace: TraceLevel;
}

const info = (
  message: string,
  data?: Record<string, unknown>
): TraceMessage => ({
  severity: TraceSeverity.Info,
  data,
  label: message,
  timestamp: new Date().toISOString(),
});

const sampleConversationTracer: ConversationTraces = {
  conversationId: 1,
  trace: {
    label: "Conversation 1",
    content: [
      info("Called New Conversation", {
        userMessage: "Hi",
        context: undefined,
      }),
      info("User Identified", {
        userId: "abc",
      }),
      {
        label: "Retrieve content from Vector DB",
        content: [
          info("Querying Vector DB", {
            query: "SELECT * FROM vector",
          }),
          info("Record Retrieved", {
            records: 10,
          }),
          info("Record processed"),
        ],
      },
      {
        label: "Building Prompt",
        content: [
          info("Fetched user relavant info"),
          info("Combining vector DB info"),
          info("Prompt built", {
            prompt: "You are a helpful assistant",
          }),
        ],
      },
      {
        label: "Call OpenAI Service",
        content: [
          info("Sending Prompt", {
            prompt: "You are a helpful assistant",
          }),
          info("Received Response", {
            response: "Hello, how can I help you?",
          }),
          info("Logging token", {
            inputTokenCount: 10,
            outputTokenCount: 20,
          })
        ],
      },
      info("Updating Databases"),
      info("Conversation Ended"),
    ],
  },
};

const printTraceLevel = (level: TraceLevel, indent: number) => {
  console.log(`${"  ".repeat(indent)}${level.label}`);
  level.content.forEach((item) => {
    if ("content" in item) {
      printTraceLevel(item, indent + 1);
    } else {
      console.log(
        `${"  ".repeat(indent + 1)}${item.timestamp} - ${item.severity}:`,
        item.label
      );
    }
  });
};

// printTraceLevel(sampleConversationTracer.trace, 0);

console.log(JSON.stringify(sampleConversationTracer, null, 2));

export class Tracer {
  private static conversationTracers: TraceLevel[] = [];
  private static activeTracer: TraceLevel | undefined;

  static print(): void {
    this.conversationTracers.forEach((trace) => {
      printTraceLevel(trace, 0);
    });
  }

  static newRequest(conversationId?: string) {
    const newTrace: TraceLevel = {
      label: `Conversation ${conversationId || "new"}`,
      content: [],
    };
    this.conversationTracers.push(newTrace);
    this.activeTracer = newTrace;
  }

  static endRequest() {
    this.activeTracer = undefined;
  }

  static identify(conversationId: number) {
    if (!this.activeTracer) {
      throw new Error("No active tracer");
    }
    this.activeTracer.label = `Conversation ${conversationId}`;
  }

  static info(message: any) {
    if (!this.activeTracer) {
      throw new Error("No active tracer");
    }
    this.activeTracer.content.push({
      severity: TraceSeverity.Info,
      label: message.toString(),
      timestamp: new Date().toISOString(),
    });
  }

  static group(label: string) {
    if (!this.activeTracer) {
      throw new Error("No active tracer");
    }
    const newLevel: TraceLevel = {
      label,
      parent: this.activeTracer,
      content: [],
    };
    this.activeTracer.content.push(newLevel);
    this.activeTracer = newLevel;
  }

  static groupEnd() {
    if (this.activeTracer && this.activeTracer.parent) {
      this.activeTracer = this.activeTracer.parent;
    }
  }
}
