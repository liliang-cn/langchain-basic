import { ChatOpenAI } from "langchain/chat_models/openai";
import { ConversationChain } from "langchain/chains";
import { BufferMemory, BufferWindowMemory } from "langchain/memory";

const memory = new BufferMemory();
const llm = new ChatOpenAI({
  temperature: 0,
  verbose: true,
  openAIApiKey: process.env.OPENAI_API_KEY,
});

const conversation = new ConversationChain({
  memory,
  llm,
});

await conversation.predict({
  input: "Hi, my name is Leo",
});

await conversation.predict({
  input: "What is 1+1?",
});

await conversation.predict({
  input: "What is my name?",
});

let mem = await memory.loadMemoryVariables();
memory.saveContext({ input: "Hi" }, { output: "What's up" });
mem = await memory.loadMemoryVariables();
console.log({ mem });
