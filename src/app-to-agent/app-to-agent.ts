import { LangflowClient } from "@datastax/langflow-client";
import dotenv from 'dotenv';

dotenv.config();

const LANGFLOW_SERVER_ADDRESS = process.env.LANG_FLOW_SERVER_ADDRESS || "";
const FLOW_ID = process.env.APP_TO_AGENT_FLOW_ID || "";
const LANGFLOW_API_KEY = process.env.LANG_FLOW_API_KEY || "";
const email = "isabella.rodriguez@example.com";

async function runAgentFlow(): Promise<void> {
    try {
        // Initialize the Langflow client
        const client = new LangflowClient({
            baseUrl: LANGFLOW_SERVER_ADDRESS,
            apiKey: LANGFLOW_API_KEY
        });

        console.log(`Connecting to Langflow server at: ${LANGFLOW_SERVER_ADDRESS} `);
        console.log(`Flow ID: ${FLOW_ID}`);
        console.log(`Email: ${email}`);

        // Get the flow instance
        const flow = client.flow(FLOW_ID);

        // Run the flow with the email as input
        console.log('\nSending request to agent...');
        const response = await flow.run(email, {
            session_id: email, // Use email as session ID for context
            tweaks: {
                "Directory-vcXQS": {
                    "path": "/Users/asifrajwani/stuff2/code/AI/Langflow/Langflow/customer-orders"
                }
            }
        });

        console.log('\n=== Response from Langflow ===');
        const chatMessage = response.chatOutputText();
        console.log('Chat Message:', chatMessage);
    
        console.log('\n=== URLs from Chat Message, if any ===');
        const messageUrls = typeof chatMessage === "string" ? chatMessage.match(/https?:\/\/[^\s"')\]]+/g) || [] : [];
        const cleanMessageUrls = [...new Set(messageUrls)].map(url => url.trim());
        console.log('URLs from message:');
        cleanMessageUrls.slice(0, 3).forEach(url => console.log(url));

    } catch (error) {
        console.error('Error running flow:', error);

        // Provide error messages
        if (error instanceof Error) {
            if (error.message.includes('fetch')) {
                console.error('\nMake sure your Langflow server is running and accessible at:', LANGFLOW_SERVER_ADDRESS);
            }
            if (error.message.includes('401') || error.message.includes('403')) {
                console.error('\nCheck your API key configuration');
            }
            if (error.message.includes('404')) {
                console.error('\nCheck your Flow ID - make sure it exists and is correct');
            }
        }
    }
}

// Run the function
console.log('Starting Langflow Agent...\n');
runAgentFlow().catch(console.error);
