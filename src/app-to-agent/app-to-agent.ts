import { LangflowClient } from "@datastax/langflow-client";
import dotenv from 'dotenv';
import readline from 'readline';

dotenv.config();

const LANGFLOW_SERVER_ADDRESS = process.env.LANG_FLOW_SERVER_ADDRESS || "";
const FLOW_ID = process.env.APP_TO_AGENT_FLOW_ID || "";
const LANGFLOW_API_KEY = process.env.LANG_FLOW_API_KEY || "";
const APP_TO_AGENT_DIRECTORY_NODE_ID = process.env.APP_TO_AGENT_DIRECTORY_NODE_ID || "Dry-vcXQS";
const APP_TO_AGENT_DIRECTORY = process.env.APP_TO_AGENT_DIRECTORY || "";

// Create readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let previousAnswer: string | null = null;

async function askAgent(question: string, sessionId: string): Promise<string> {
    try {
        // Initialize the Langflow client
        const client = new LangflowClient({
            baseUrl: LANGFLOW_SERVER_ADDRESS,
            apiKey: LANGFLOW_API_KEY
        });

        // Get the flow instance
        const flow = client.flow(FLOW_ID);

        // Run the flow with the question
        const response = await flow.run(question, {
            session_id: sessionId,
            tweaks: {
                APP_TO_AGENT_DIRECTORY_NODE_ID: {
                    "path": APP_TO_AGENT_DIRECTORY
                }
            }
        });

        const chatMessage = response.chatOutputText();
        return typeof chatMessage === 'string' ? chatMessage : 'No response received';

    } catch (error: any) {
        console.error('Error running flow:', error);
        if (error instanceof Error) {
            if (error.message.includes('fetch')) {
                return `Error: Make sure your Langflow server is running and accessible at: ${LANGFLOW_SERVER_ADDRESS}`;
            }
            if (error.message.includes('401') || error.message.includes('403')) {
                return 'Error: Check your API key configuration';
            }
            if (error.message.includes('404')) {
                return 'Error: Check your Flow ID - make sure it exists and is correct';
            }
        }
        return `Error: ${error.message}`;
    }
}

async function startChat(sessionId: string) {
    // Use the existing session ID passed from main
    console.log('\nStarting interactive chat...');
    console.log("\nType Email address to get recommendation based on historical purchases. Type 'quit' to exit or 'compare' to see the previous answer");

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

            if (userQuestion.toLowerCase() === 'urls') {
                if (previousAnswer) {
                    const messageUrls = previousAnswer.match(/https?:\/\/[^\s"')\]]+/g) || [];
                    const cleanMessageUrls = [...new Set(messageUrls)].map(url => url.trim());
                    console.log('\n=== URLs from last response ===');
                    cleanMessageUrls.slice(0, 3).forEach(url => console.log(url));
                } else {
                    console.log("\nNo previous response to extract URLs from!");
                }
                askQuestion();
                return;
            }

            const result = await askAgent(userQuestion, sessionId);
            console.log(`\nAgent's answer: ${result}`);
            previousAnswer = result;
            askQuestion();
        });
    };

    askQuestion();
}

async function askInitialQuestions(sessionId: string) {
    const initialQuestions = [
        "Where you are looking for purchase data I uploaded csv already.",
        //"How can you help me with customer information information?"
    ];

    console.log("\n=== Initial Questions ===");
    for (const question of initialQuestions) {
        console.log(`\nAsking: ${question}`);
        const answer = await askAgent(question, sessionId);
        console.log(`Answer: ${answer}`);
    }
    console.log("\n=== Initial Questions Complete ===\n");
}

async function main() {
    console.log('Starting Langflow Agent...\n');
    
    // Generate a session ID using timestamp that will be used for the entire session
    const sessionId = `session_${Date.now()}`;
    console.log(`Session ID: ${sessionId}`);

    // Ask initial questions before starting interactive chat
    await askInitialQuestions(sessionId);

    // Start the interactive chat using the same session ID
    await startChat(sessionId);
}

// Start the application
main().catch(console.error);
