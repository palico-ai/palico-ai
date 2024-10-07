export default class AppRoute {
  static github() {
    return 'https://github.com/palico-ai/palico-ai';
  }

  static scheduleDemo() {
    return 'https://calendar.app.google/3rsaXFkGFNBXniZGA';
  }

  static newsletter() {
    return 'https://forms.gle/HX3Dn4TYu3o1anoP6';
  }

  static blog() {
    return 'https://blog.palico.ai';
  }
}

export class DocRoute {
  static docs() {
    if (process.env['NEXT_PUBLIC_DOCS_URL']) {
      return process.env['NEXT_PUBLIC_DOCS_URL'];
    }
    return 'https://docs.palico.ai';
  }

  static quickStart() {
    return DocRoute.docs();
  }

  static buildingAnApp() {
    return `${DocRoute.docs()}/guides/build`;
  }

  static previewChanges() {
    return `${DocRoute.docs()}/guides/preview_changes`;
  }

  static logsAndTracing() {
    return `${DocRoute.docs()}/guides/telemetry`;
  }

  static clientSdk() {
    return `${DocRoute.docs()}/guides/client_sdk`;
  }

  static cookbook() {
    return `${DocRoute.docs()}/cookbooks`;
  }

  static docsChatbot() {
    return `${DocRoute.cookbook()}/building_a_chatbot_with_memory`;
  }

  static docsBuildARagApp() {
    return `${DocRoute.cookbook()}/building_a_rag_application`;
  }

  static docsAiTextEditor() {
    return `${DocRoute.cookbook()}/building_ai_text_editor`;
  }

  static docsClassifyDocuments() {
    return `${DocRoute.cookbook()}/classify_news_articles`;
  }

  static docsConvertTextToSQL() {
    return `${DocRoute.cookbook()}/text_to_sql`;
  }

  static docsUnstructuredToJSON() {
    return `${DocRoute.cookbook()}/unstructured_to_json`;
  }

  static docsBuildApp() {
    return `${DocRoute.docs()}/guides/build`;
  }

  static docsAppConfig() {
    return `${DocRoute.docs()}/guides/feature_flag`;
  }

  static docsExperiment() {
    return `${DocRoute.docs()}/guides/experiments`;
  }

  static docsLangChain() {
    return `${DocRoute.docs()}/integrations/langchain`;
  }

  static docsLlamaIndex() {
    return `${DocRoute.docs()}/integrations/llamaindex`;
  }

  static docsModelProviders() {
    return `${DocRoute.docs()}/integrations/llm_providers`;
  }

  static docsPortkey() {
    return `${DocRoute.docs()}/integrations/llm_providers#portkey`;
  }

  static docsOpenAI() {
    return `${DocRoute.docs()}/integrations/llm_providers#open-ai`;
  }

  static docsAnthropic() {
    return `${DocRoute.docs()}/integrations/llm_providers#anthropic`;
  }

  static docsAwsBedrock() {
    return `${DocRoute.docs()}/integrations/llm_providers#aws-bedrock`;
  }

  static docsGcpVertex() {
    return `${DocRoute.docs()}/integrations/llm_providers#gcp-vertex-ai`;
  }

  static docsPinecone() {
    return `${DocRoute.docs()}/integrations/vector_db`;
  }

  static docsPGVector() {
    return `${DocRoute.docs()}/integrations/vector_db`;
  }

  static docsChroma() {
    return `${DocRoute.docs()}/integrations/vector_db`;
  }
}
