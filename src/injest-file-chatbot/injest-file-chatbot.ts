
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import FormData from 'form-data';
import fetch from 'node-fetch';
dotenv.config();

const LANGFLOW_SERVER_ADDRESS = process.env.LANG_FLOW_SERVER_ADDRESS
const LANGFLOW_API_KEY = process.env.LANG_FLOW_API_KEY || "";
const FLOW_ID = process.env.INJEST_FILE_CHATBOT_FLOW_ID;
const FILE_COMPONENT_ID = "File-lnT93"; // The ID of the component in your flow that handles the file
const CHAT_INPUT = "What is this file about?"; // The message you want to send to the chatbot

// The file to be uploaded
const filePath = "/Users/asifrajwani/stuff2/code/AI/Langflow/Langflow/kb/warranty.md"; // This is a placeholder for Node.js. In a browser, you'd get the file from an <input type="file"> element.
const fileName = "warranty.md";



const runLangFlowChat = async () => {
  try {
    // 1. Upload the file
    console.log("Starting file upload...");

    const uploadUrl = `${LANGFLOW_SERVER_ADDRESS}/api/v2/files/`;
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath), fileName);

    const uploadResponse = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'x-api-key': LANGFLOW_API_KEY,
        ...formData.getHeaders(),
        'Accept': 'application/json',
      },
      body: formData as any,
    });

  const uploadData = await uploadResponse.json() as any;
    if (!uploadResponse.ok) {
      throw new Error(uploadData.detail || 'File upload failed');
    }
    const uploadedPath = uploadData.path;
    console.log(`File uploaded successfully. Path: ${uploadedPath}`);

    // 2. Call the LangFlow run endpoint with the uploaded file path
    console.log("Calling LangFlow with file path...");
    const runUrl = `${LANGFLOW_SERVER_ADDRESS}/api/v1/run/${FLOW_ID}`;
    const runPayload = {
      "input_value": CHAT_INPUT,
      "output_type": "chat",
      "input_type": "chat",
      "tweaks": {
        [FILE_COMPONENT_ID]: {
          "path": uploadedPath
        }
      }
    };

    const runResponse = await fetch(runUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-api-key': LANGFLOW_API_KEY,
      },
      body: JSON.stringify(runPayload),
    });

  const langflowData = await runResponse.json() as any;
    if (!runResponse.ok) {
      throw new Error(langflowData.detail || 'LangFlow run failed');
    }

    // 3. Extract and display the message
    let message = null;
    try {
      message = langflowData.outputs[0].outputs[0].results.message.data.text;
    } catch (e) {
      console.error("Failed to parse message from response:", e);
    }
    console.log("LangFlow Response:");
    console.log(message);
    
    return message;
  } catch (error) {
    console.error("An error occurred:", error);
  }
};

runLangFlowChat();