export class LandingPageData {
  static readonly header = {
    title: 'Improve Accuracy with Experiment-Driven Development',
    subtitle: {
      v1: 'With our LLM Development Framework, you can quickly prototype and build your LLM application (agent), unit-test the accuracy of your agent , dig into and root-cause accuracy issues, and confidently ship your LLM features by making data-driven decisions',
      v2: 'Improving accuracy requires running hundreds of experiments across different prompt techniques, models, rag-pipeline versions, and more. We help structures your development to streamline this process so you can hit your accuracy targets much faster.',
    },
  };

  static readonly howItWorks = {
    step: {
      defineYourAgent: {
        title: 'Define your LLM Agent',
        descriptions: [
          'Build modular prompt-layer using feature-flags to be able to test how your LLM Agent performs under different models, prompts, business logics, and other variables',
          'Access your Agent using REST API endpoint, or use our Javascript SDK, to integrate it into your existing application',
        ],
      },
      runExperiments: {
        title: 'Experiment like a Scientist',
        descriptions: [
          "Test how indepedent variables (prompt, model, business logic, etc) affect your agent's performance",
          'Automatically version control your experiments alongside your code',
          'Organize and collaborate on experiments with your team',
        ],
        demoUrl:
          'https://www.loom.com/embed/ac36ce6824c241b891c3bb4c246dfdf4?sid=3be46e46-8fbf-4c74-8bc3-4078372b76fd',
      },
    },
  };

  static readonly protoToProd = {
    title: 'Take your Application from Prototype to Production',
    sections: {
      techStack: {
        title: 'Start with a set of integrated tools',
        items: [
          {
            label: 'Agent API and SDK',
            description:
              'Easily define any LLM components and automatically deploy them as a RESTful API.',
          },
          {
            label: 'Workflows',
            description:
              'Build complex interactions using multiple LLM components and business logics.',
          },
          {
            label: 'Observability',
            description:
              'Monitor and analyze your agent’s performance, accuracy, and other metrics.',
          },
          {
            label: 'Experimentation',
            description:
              'Run, track, analyze, and collaborate at scale with your experiments.',
          },
          {
            label: 'Dashboard UI',
            description:
              'Prototype your agent, run experiments, and review your traces and metrics from your locally hosted admin panel.',
          },
        ],
      },
      useCases: {
        title: 'Build any LLM Application',
        description:
          'Our LLM Development Framework provides you with all the flexiblity to build any types of LLM applications. Here are some examples:',
        items: [
          {
            summary: 'Build a Chatbot',
            detailText:
              'Build a chatbot that can answer questions about your product or service.',
          },
          {
            summary: 'Build a Copilot',
            detailText:
              'Build a copilot that can help your users be more productive.',
          },
          {
            summary: 'Writing Assistant',
            detailText:
              'Build a writing assistant that can help your users generate and refine ideas',
          },
          {
            summary: 'Q&A Over Document',
            detailText:
              'Help your users find answers to their questions faster',
          },
          {
            summary:
              'Data Extraction, Intent Classification, Sentiment Analysis, and More',
            detailText: 'Extract insights from unstructured data',
          },
        ],
      },
      prototype: {
        title: 'Prototype and Iterate Quickly',
        tabs: [
          {
            label: 'Compare Responses',
            description:
              'Compare responses from different versions of your agent side-by-side',
            demoUrl:
              'https://www.loom.com/embed/d578ca2a63e4461da469e3d8a6df74b5?sid=68b7ebec-2b0c-4c3e-adfb-4f695b765024',
          },
          {
            label: 'Chat UI',
            description:
              'Chat with your agent in a real-time with our Chat UI without writing any extra code',
            demoUrl:
              'https://www.loom.com/embed/d578ca2a63e4461da469e3d8a6df74b5?sid=68b7ebec-2b0c-4c3e-adfb-4f695b765024',
          },
          {
            label: 'Palico Studio',
            description:
              'Palico Studio is a admin ui that acts as a companion for your LLM development. It allows you to prototype your agent, run experiments, and review your traces and metrics from your locally hosted admin panel.',
            demoUrl:
              'https://www.loom.com/embed/d578ca2a63e4461da469e3d8a6df74b5?sid=68b7ebec-2b0c-4c3e-adfb-4f695b765024',
          },
        ],
      },
    },
  };
}
