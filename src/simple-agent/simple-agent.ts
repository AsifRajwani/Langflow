import readline from 'readline';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const url = process.env.LANG_FLOW_SERVER_ADDRESS + "/api/v1/run/" + process.env.SIMPLE_AGENT_FLOW_ID || ""
const langFlowApiKey = process.env.LANG_FLOW_API_KEY || ""

if (!url || !langFlowApiKey) {  
    console.error("Error: SIMPLE_AGENT_URL or LANG_FLOW_API_KEY is not defined in environment variables.");
    process.exit(1);
}

let previousAnswer: string | null = null;

async function askAgent(question: string): Promise<string> {
    const payload = {
        output_type: "chat",
        input_type: "chat",
        input_value: question
    };

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': langFlowApiKey
        },
        body: JSON.stringify(payload)
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json() as any;
        const message = data.outputs[0].outputs[0].outputs.message.message;
        return message;
    } catch (error: any) {
        return `Error: ${error.message}`;
    }
}

async function startChat() {
    console.log("\nAsk the agent anything, such as 'What is 15 * 7?' or 'What is the capital of France?'");
    console.log("Type 'quit' to exit or 'compare' to see the previous answer");

    const askQuestion = () => {
        rl.question('\nYour question: ', async (userQuestion: string) => {
            if (userQuestion.toLowerCase() === 'quit') {
                rl.close();
                return;
            }

            if (userQuestion.toLowerCase() === 'compare') {
                if (previousAnswer) {
                    console.log(`\nPrevious answer was: ${previousAnswer}`);
                } else {
                    console.log("\nNo previous answer to compare with!");
                }
                askQuestion();
                return;
            }

            const result = await askAgent(userQuestion);
            console.log(`\nAgent's answer: ${result}`);
            previousAnswer = result;
            askQuestion();
        });
    };

    askQuestion();
}

startChat();
