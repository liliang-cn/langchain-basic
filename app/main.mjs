import { ChatOpenAI } from "langchain/chat_models/openai";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
} from "langchain/prompts";
import { LLMChain } from "langchain/chains";

const llm = new ChatOpenAI({
  temperature: 0.9,
  openAIApiKey: process.env.OPENAI_API_KEY,
  verbose: true,
});

const prompt = ChatPromptTemplate.fromPromptMessages([
  HumanMessagePromptTemplate.fromTemplate(
    "What is the best name to describe a company that makes {product}?"
  ),
]);

console.log({ prompt });

const chain = new LLMChain({
  llm,
  prompt,
});

const product = "Queen Size Sheet Set";
const result = await chain.run(product);

console.log({ result });
