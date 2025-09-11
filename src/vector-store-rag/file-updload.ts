// Node 18+ example using global fetch, FormData, and Blob
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

// TypeScript types for API responses
export type UploadResponse = {
  path: string;
};

export type LangflowResponse = {
  outputs?: Array<{
    outputs?: Array<{
      results?: {
        message?: {
          data?: {
            text?: string;
          }
        }
      }
    }>
  }>;
};

const uploadUrl = process.env.LANG_FLOW_SERVER_ADDRESS + "/api/v2/files/"  || "";
const injestUrl = process.env.LANG_FLOW_SERVER_ADDRESS + "/api/v1/run/" + process.env.VECTOR_STORE_RAG_FLOW_ID || ""
const langFlowApiKey = process.env.LANG_FLOW_API_KEY || ""

async function main(): Promise<void> {
  const kbDir = path.join(process.cwd(), 'kb');
  const files = await fs.readdir(kbDir);
  const headers = { 'x-api-key': langFlowApiKey };

  for (const fileName of files) {
    const filePath = path.join(kbDir, fileName);
    const fileBuffer = await fs.readFile(filePath);
    // Convert Node.js Buffer to Uint8Array, then to ArrayBuffer for Blob
    const uint8 = new Uint8Array(fileBuffer);
    const arrayBuffer = uint8.buffer.slice(uint8.byteOffset, uint8.byteOffset + uint8.byteLength);
    const data = new FormData();
    data.append('file', new Blob([arrayBuffer], { type: 'application/octet-stream' }), fileName);

    // Upload the file to Langflow
    const uploadRes = await fetch(uploadUrl, {
      method: 'POST',
      headers,
      body: data
    });
    const uploadData = await uploadRes.json() as UploadResponse;
    const uploadedPath = uploadData.path;

    // Call the Langflow run endpoint with the uploaded file path
    const payload = {
      input_value: `Analyze this file: ${fileName}`,
      output_type: "chat",
      input_type: "text",
      tweaks: {
        'FILE_COMPONENT_NAME': {
          path: uploadedPath
        }
      }
    };
    const runRes = await fetch(injestUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': langFlowApiKey },
      body: JSON.stringify(payload)
    });
    const langflowData = await runRes.json() as LangflowResponse;
    // Output only the message
    console.log(`Result for ${fileName}:`);
    console.log(langflowData.outputs?.[0]?.outputs?.[0]?.results?.message?.data?.text);
  }
}

main().catch((err) => {
  console.error('Error:', err);
});
