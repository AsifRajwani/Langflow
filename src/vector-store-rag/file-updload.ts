// Node 18+ example using global fetch, FormData, and Blob
import fs from 'fs/promises';

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

async function main(): Promise<void> {
  // 1. Prepare the form data with the file to upload
  const fileBuffer = await fs.readFile('FILE_NAME');
  // Convert Node.js Buffer to Uint8Array, then to ArrayBuffer for Blob
  const uint8 = new Uint8Array(fileBuffer);
  const arrayBuffer = uint8.buffer.slice(uint8.byteOffset, uint8.byteOffset + uint8.byteLength);
  const data = new FormData();
  data.append('file', new Blob([arrayBuffer], { type: 'application/octet-stream' }), 'FILE_NAME');
  const headers = { 'x-api-key': 'LANGFLOW_API_KEY' };

  // 2. Upload the file to Langflow
  const uploadRes = await fetch('LANGFLOW_SERVER_ADDRESS/api/v2/files/', {
    method: 'POST',
    headers,
    body: data
  });
  const uploadData = await uploadRes.json() as UploadResponse;
  const uploadedPath = uploadData.path;

  // 3. Call the Langflow run endpoint with the uploaded file path
  const payload = {
    input_value: "Analyze this file",
    output_type: "chat",
    input_type: "text",
    tweaks: {
      'FILE_COMPONENT_NAME': {
        path: uploadedPath
      }
    }
  };
  const runRes = await fetch('LANGFLOW_SERVER_ADDRESS/api/v1/run/FLOW_ID', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': 'LANGFLOW_API_KEY' },
    body: JSON.stringify(payload)
  });
  const langflowData = await runRes.json() as LangflowResponse;
  // Output only the message
  console.log(langflowData.outputs?.[0]?.outputs?.[0]?.results?.message?.data?.text);
}

main().catch((err) => {
  console.error('Error:', err);
});
