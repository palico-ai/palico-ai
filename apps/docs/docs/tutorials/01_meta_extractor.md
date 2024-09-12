# Building LLM Extractor

For this section, we'll build an LLM application that takes in raw content of an article, and extracts the following metadata:
```
{
  "oneLineSummary": "A one line summary of the article",
  "descriptiveSummary": "A descriptive summary of the article",
  "author": "The author of the article (if available)",
  "categories": ["List of categories the article belongs to"],
}
```
To do this, we will create a Palico agent takes in the following input:
```
{
  "payload": {
    "articleContent": "The raw content of the article"
  }
}
```
And the output will be the metadata as described above. We will use OpenAI models to extract this metadata.

## Implement the Agent class
To create an LLM application, we just need to create a folder within the `src/agents` directory, create a new file `index.ts` file, and implement the `Agent` interface.

Let's create a new agent within  `src/agents/meta_extractor/index.ts` the following content:
```typescript title="src/agents/meta_extractor/index.ts"
export default class MetadataExtractor implements Agent {
  async chat(
    content: ConversationRequestContent<Payload>,
    context: ConversationContext
  ): Promise<AgentResponse<any>> {
    if (!content.payload) throw new Error("Payload is required");
    const { articleContent } = content.payload;
    // highlight-start
    // 1. Construct the prompt
    // 2. Call OpenAI API
    // 3. Extract output from OpenAI and return the response
    // highlight-end
    throw new Error("Not implemented");
  }
}
```

### Understanding the `chat()` Method
The `chat` method is the main method that will be called when we interact with our agent. You have complete freedom over the implementation details and can use any external libraries or services to help you build your LLM application.

This method has the `content` parameter, which has the following structure:
```typescript
interface Content<Payload=Record<string, any>> {
  userMessage?: string;
  payload?: Payload;
}
```
This means when we call our agent, we can pass in a `userMessage`, `payload` or both. In this case, we'll pass in the raw content of the article in the `payload` object. 

So if we were to call our agent from a frontend application using Palico SDK, the request would look like the following:
```typescript
await client.agents.newConversation({
  name: "meta_extractor",
  payload: {
    articleContent: "The raw content of the article",
  },
});
```

## Extract Article Metadata using OpenAI SDK
Let's use a basic prompt and call OpenAI with the gpt3.5-turbo model.

```typescript title="src/agents/meta_extractor/index.ts"
interface Payload {
  articleContent: string;
}

class MetadataExtractor implements Agent {
  async chat(
    content: ConversationRequestContent<Payload>,
    context: ConversationContext
  ): Promise<AgentResponse<any>> {
    if (!content.payload) throw new Error("Payload is required");
    const { articleContent } = content.payload;
    // highlight-next-line
    // 1. Construct the prompt
    const prompt = `Based on the information on the page, extract the information from the schema. YOU MUST RESPOND WITH ONLY A VALID JSON OBJECT WITH THE FOLLOWING SCHEMA:
      {
        "oneLineSummary": {
          type: "string",
          description: "A one-line summary of the article"
        },
        "descriptiveSummary": {
          type: "string",
          description: "A descriptive summary of the article",
          required: false
        }
        "author": {
          type: "string",
          description: "The author of the article",
          required: false
        },
        "categories": {
          type: "array",
          possibleValues: ["technology", "science", "politics", "sports", "entertainment", "health", "business"],
          description: "The categories of the article"
        }
      }

      Information:
          ${articleContent}
    `;
    // highlight-next-line
    // 2. Call OpenAI API
    const response = await this.openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      temperature: 0,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });
    // highlight-next-line
    // 3. Extract output from OpenAI and return the response
    const jsonString = response.choices[0].message.content;
    if (!jsonString) {
      throw new Error("Failed to extract metadata");
    }
    return {
      data: JSON.parse(jsonString),
    };
  }

  get openai() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY is not set");
    }
    return new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
}
```

## Preview Your Changes
Start your application by running `npm start` and navigate to palico studio (default: http://localhost:3000/). You can find the link to your Palico Studio in the terminal output. For example:
``` bash
# highlight-next-line
Palico Studio: http://localhost:3000
Tracing UI: http://localhost:16686
Database URL: postgresql://root:root@localhost:5433/palicoapp
API URL: http://localhost:8000
```

You can chat with your agent by going to the chat route, selecting the agent `meta_extractor`, and passing in the `articleContent` in the payload.

Let's test the agent by passing in content from this techcrunch article: https://techcrunch.com/2024/07/23/clio-raises-900m-at-a-3b-valuation-plans-to-double-down-on-ai-and-fintech
``` json
{
  "articleContent": "Legal tech Clio raises $900M at a $3B valuation, plans to double down on AI and fintech Embedded payments helped double its ARR to over $200M in two years, founder says Mary Ann Azevedo 5:00 AM PDT • July 23, 2024 Comment Woman at a desk with a laptop, brass scales and gavel representing the legal system Image Credits: ARMMY PICCA(opens in a new window) / Getty Images Clio, a Canadian software company that aims to help law practices run more efficiently with its cloud-based technology, has raised $900 million in a Series F round that values the company at $3 billion. The valuation is nearly double the $1.6 billion valuation the Vancouver, British Columbia company achieved in April 2021 when it raised $110 million. Clio, which describes itself as “the operating system for law firms,” recently crossed over $200 million in ARR, up from $100 million ARR in June of 2022 and has been profitable (EBITDA positive) for several years, according to Clio founder and CEO Jack Newton. The company works to simplify law firm management by centralizing client intake, case and document management, and payments, among other things. It is used by over 150,000 legal professionals and recently expanded to the APAC region, as well as gaining more mid-sized law firms as customers, it says. New Enterprise Associates (NEA) led the raise with an investment of over $500 million — its first in the company. New investors Goldman Sachs Asset Management, Sixth Street Growth, CapitalG and Tidemark joined existing backers TCV, JMI Equity, funds and accounts advised by T. Rowe Price and OMERS to also participate in the financing. Notably, “a substantial amount” of the round was secondary financing that will be used to allow existing investors and employees to cash out some of their shares, Newton said. The investment brings Clio’s total capital raised since its 2008 inception to nearly $1.3 billion. TechCrunch Disrupt 2024 Join 10,000+ startup & VC leaders, gain insights from tech giants, engage in 200+ Roundtables & Breakouts San Francisco | October 28-30 Register Now The mega-round is a significant amount but is, perhaps, especially notable in today’s environment where venture raises of this size are not nearly as common. For context, there were 105 mega-rounds raised globally in all of the first quarter, according to CB Insights. The company has benefited from a couple of major tailwinds, Newton told TechCrunch in an interview. “With COVID 19, we saw an explosive growth in the adoption of cloud technologies in general, and of Clio in particular,” he said. “We have also seen a huge tailwind thanks to AI and the enormous amount of interest lawyers and the broader legal community have in AI and how AI can enhance productivity.” Payments and AI as growth drivers In 2022, Clio began integrating payments into its offering — a move that has boosted its revenue beyond its core SaaS business, Newton told TechCrunch. Clio’s payments business now processes billions of dollars annually in legal-specific transactions. The company makes “a small percentage” on every transaction that posts through Clio payments, Newton said. “The embedded payments opportunity with Clio and the broader fintech opportunity is something we’re really excited about,” Newton said, “both because of the growth it’s driven to this point, and also because of what we believe is a huge amount of future growth.” Payments in the legal industry are more complex than general electronic payments, Newton pointed out. Image Credits: Clio “For example, there are trust funds and trust transactions that need to be managed in a really specific way. And you can’t take the fees for credit card transactions off the top of a trust account transaction in the way that you typically would if you were, for example, a small merchant using a Square account,” he said. In other words, if a lawyer charges $100 for a trust transaction and $3 comes off in processing fees and only $97 is deposited in a bank account, a lawyer is essentially committing malpractice by not depositing 100% of the funds into a trust account. “So the nuance with legal payments is that the fees need to get withdrawn from a separate operating account,” he said, adding that Clio’s offering is compliant with trust-related accounting needs and is easy for lawyers to use. Clio also offers an accounting product to help firms manage their finances. The company also began working on putting AI into its offerings in early 2023. This year, it plans to release GA Clio Duo, an integrated generative AI assistant aimed at helping lawyers “complete routine tasks, and leverage their firm analytics to run a more efficient practice,” including audit log functionality for court discovery. It can also do things like make recommendations on which marketing channels a lawyer should be using to best generate new leads. And Newton says the company has more plans for more AI features in the future. Presently, Clio has more than 1,100 employees. Its software is used by law firms in over 130 countries. “The company has grown beyond its initial SMB market to also become the leader in the mid-market, while showing explosive growth in payments, and being at the forefront of important product categories such as e-filing, document automation, and AI,” TCV general partner and Clio board member Amol Helekar said. Of course, Clio is not the only legal tech benefiting from the AI revolution. In April, U.K.-based legal tech startup Lawhive, which offers an AI-based, in-house “lawyer” through a software-as-a-service platform targeted at small law firms, raised $11.9 million in a seed round. Backed by the likes of Lightspeed and Menlo, Eve emerged out of stealth last October with a mission to harness the power of large language models (à la"
}
```
