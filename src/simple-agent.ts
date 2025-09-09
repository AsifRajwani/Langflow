import readline from 'readline';
import fetch from 'node-fetch';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const url = 'http://localhost:7860/api/v1/run/29808535-af71-4266-b7d0-e22be36f87b1';

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
            'x-api-key': 'sk-_IKks_HrBBRLy7JxIBrxVFbF8U-kcuVsqflgBh3nKxs'
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
