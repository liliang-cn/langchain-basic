import { Configuration, OpenAIApi } from "openai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";
import { HumanChatMessage } from "langchain/schema";
import { StructuredOutputParser } from "langchain/output_parsers";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// const chatCompletion = await openai.createChatCompletion({
//   model: "gpt-3.5-turbo",
//   messages: [{ role: "user", content: "Hello world" }],
// });
// console.log(chatCompletion.data.choices[0].message);

const get_completion = async (prompt, model = "gpt-3.5-turbo") => {
  const messages = [{ role: "user", content: prompt }];
  const response = await openai.createChatCompletion({
    model: model,
    messages: messages,
    temperature: 0,
  });
  return response.data.choices[0].message["content"];
};

// const res = await get_completion("What is 1+1?");
// console.log(res);

const customer_email = `
Arrr, I be fuming that me blender lid \n
flew off and splattered me kitchen walls \n
with smoothie! And to make matters worse,\n
the warranty don't cover the cost of \n
cleaning up me kitchen. I need yer help \n
right now, matey!
`;

const style = `American English in a calm and respectful tone`;

const prompt = `
Translate the text
that is delimited by triple brackets 
into a style that is ${style}.
text: \`\`\`${customer_email}\`\`\`
`;

// const res = await get_completion(prompt);
// console.log({ res });

const chat = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  temperature: 0,
  verbose: true,
});

const template_string = `
Translate the text 
that is delimited by triple backticks 
into a style that is {style}.
text: \`\`\`{text}\`\`\`
`;

const prompt_template = PromptTemplate.fromTemplate(template_string);

const customerMessage = await prompt_template.format({
  style,
  text: customer_email,
});

// const response = await chat.call([new HumanChatMessage(customerMessage)]);

// console.log({ response });

const customer_review = `
This leaf blower is pretty amazing.  It has four settings:
candle blower, gentle breeze, windy city, and tornado. 
It arrived in two days, just in time for my wife's 
anniversary present. 
I think my wife liked it so much she was speechless. 
So far I've been the only one using it, and I've been 
using it every other morning to clear the leaves on our lawn. 
It's slightly more expensive than the other leaf blowers 
out there, but I think it's worth it for the extra features.
`;

const review_template = `
For the following text, extract the following information:

gift: Was the item purchased as a gift for someone else? 
Answer true if yes, False if not or unknown.

delivery_days: How many days did it take for the product 
to arrive? If this information is not found, output -1.

price_value: Extract any sentences about the value or price,
and output them as a JSON array.

Format the output as JSON with the following keys:
gift
delivery_days
price_value

text: {text}
`;

const parser = StructuredOutputParser.fromNamesAndDescriptions({
  gift: "Was the item purchased as a gift for someone else? Answer true if yes, false if not or unknown.",
  delivery_days:
    "How many days did it take for the product to arrive? If this information is not found, output -1.",
  price_value:
    "Extract any sentences about the value or price, and output them as a array.",
});

const formatInstructions = parser.getFormatInstructions();

const prompt_template_for_review = new PromptTemplate({
  template: review_template,
  inputVariables: ["text"],
  partialVariables: { format_instructions: formatInstructions },
});

const prompt_for_review = await prompt_template_for_review.format({
  text: customer_review,
});

const response = await chat.call([new HumanChatMessage(prompt_for_review)]);

console.log(JSON.parse(response.text));
