## **LangFlow Tutorial Examples**

[LangFlow](https://www.langflow.org/) is a powerful visual development tool that simplifies the creation of LLM (Large Language Model) applications. It provides a user-friendly interface where you can build complex AI workflows by dragging, dropping, and connecting components. Using LangFlow, you can create custom chatbots, design AI agents, and build document analysis systems with minimal code.

This repository contains code examples from the official [LangFlow tutorials](https://docs.langflow.org/). The code is written in **TypeScript** and demonstrates how to interact with flows created using the **LangFlow Desktop App**.

Each example resides in its own directory and includes the exported LangFlow JSON file, allowing you to easily import and use the corresponding flow.

---

## **📝 Requirements**

To run these examples, you need the following:

- **Node.js**: Version 22.15.x or above. You can download it from the official [Node.js website](https://nodejs.org/en/download/).
- **LangFlow Desktop App**: Download and install it from [langflow.org/desktop](https://www.langflow.org/desktop).
- **OpenAI API Key**: Some examples require an OpenAI API key. You can get one by creating an account on the [OpenAI platform](https://platform.openai.com/settings/organization/api-keys).

---

## **⚙️ Setup**

1.  **Environment Variables**: Create a `.env` file in the root directory of the repository with the following variables:

```ini
LANG_FLOW_API_KEY=your_langflow_api_key
LANG_FLOW_SERVER_ADDRESS=http://your_langflow_server_address:7860
SIMPLE_AGENT_FLOW_ID=your_simple_agent_flow_id
VECTOR_STORE_RAG_FLOW_ID=your_vector_store_rag_flow_id
INJEST_FILE_CHATBOT_FLOW_ID=your_injest_file_chatbot_flow_id
APP_TO_AGENT_FLOW_ID=your_app_to_agent_flow_id
APP_TO_AGENT_DIRECTORY_NODE_ID=your_directory_node_id
APP_TO_AGENT_DIRECTORY=your_directory_path
MCP_FLOW_ID=your_mcp_flow_id
```

2.  **Install Dependencies**: Run npm install to install all required packages.

```bash
npm install
```

3.  **Build the Project**: Use the TypeScript compiler in watch mode to automatically compile your code.

```bash
tsc -w
```

---

## **🚀 Examples**

### **1. Simple Agent**

This example corresponds to the [LangFlow quickstart tutorial](https://docs.langflow.org/get-started-quickstart). It demonstrates a basic, pre-configured agent that uses a single tool (the Calculator) to show fundamental functionality.

#### **Sample Prompts**

You can test the agent's capabilities with these prompts:

1. `What tools are available to answer my question?` (Lists the available tools)
2. `Evaluate 4+4` (Uses Calculator tool)
3. `Check Wikipedia for cryptography` (Uses URL Fetch Request tool)

- **To run**:
  ```bash
  node dist/simple-agent/simple-agent.js
  ```

### **2. Connect Applications to Agents**

This example corresponds to the [LangFlow Agent Tutorial](https://docs.langflow.org/agent-tutorial). Web Search component is not used as it was not adding any value, everything else aligns with the tutorial url.

---

#### **Troubleshooting & Usage Notes for CSV File and Directory Handling**

1. **Directory Component Path**: Setting up the directory path in the LangFlow directory component does not work as expected. You need to place your CSV file in the working directory. Copy the `customer-orders.csv` file from the `customer-order` directory to your default working directory.

   **What is the working directory?** For the LangFlow Desktop app, the working directory is the folder where LangFlow looks for files by default. On Mac, if you start LangFlow from the toolbar (not the terminal), this is usually `~/.langflow/data`. If you start LangFlow from the terminal, the working directory will be the folder from which you launched the app.

2. **CSV File Access**: There's a known issue where LangFlow might initially say it cannot access the CSV file. The TypeScript program handles this automatically, but if you're using the LangFlow playground directly, you'll need to type: `Where you are looking for purchase data I uploaded csv already` as your first prompt to make it work.

---

This tutorial focuses on how to **build an agent** within LangFlow itself. It teaches you to design and assemble an agent by connecting components and tools, such as a directory and a web scraper component.

#### **Sample Prompts**

You can test the agent's capabilities with these prompts:

1. `What tools are available to answer my question?` (Lists the available tools)
2. `Where you are looking for purchase data I uploaded csv already` (Makes sure CSV is read)
3. `henry.chen@example.com` (Based on order history, recommend 3 items)
4. `james.taylor@example.com` (Based on order history, recommend 3 items)

- **To run**:
  ```bash
  node dist/agent-tutorial/agent-tutorial.js
  ```

### **3. Vector Store RAG**

This example corresponds to the [LangFlow RAG Tutorial](https://docs.langflow.org/chat-with-rag). It demonstrates a Retrieval-Augmented Generation (RAG) system that shows how to create a chatbot that can answer questions based on a provided document. Note that the behavior of this flow is very inconsistent.

#### **Important Usage Note**

- **LangFlow Desktop**: You need to upload the file(s) in designer mode and then go to playground to ask questions about the file
- **TypeScript Program**: Automatically handles file upload and then allows you to ask questions about the uploaded file

#### **Sample Prompts**

After uploading your file (e.g., `kb/ultrabook-pro-15.md`), you can test the RAG system with these prompts:

1. `What tools are available to answer my question?` (Lists the available tools)
2. `Summarize ultrabook-pro-15.md` (Provides summary of the uploaded file)
3. `What are the key features mentioned in the document?` (Extracts specific information)
4. `What is the warranty coverage?` (Finds relevant details from the document)

- **To run**:
  ```bash
  node dist/vector-store-rag/file-upload.js
  ```

### **4. Chatbot that Ingests Files**

This example shows how to create a chatbot that can ingest files, as described in the [LangFlow "Chat with Files" tutorial](https://docs.langflow.org/chat-with-files). It demonstrates the process of uploading a file and passing its path to the flow.

- **To run**:
  ```bash
  node dist/injest-file-chatbot/injest-file-chatbot.js
  ```

### **5. Model Context Protocol (MCP) Tutorial**

This example corresponds to the [LangFlow MCP Tutorial](https://docs.langflow.org/mcp-tutorial). It explains the **Model Context Protocol (MCP)** and how to use LangFlow as both an MCP **client** and a **server**. It demonstrates how to expose your flows as tools for other applications.

#### **Prerequisites**

This example requires two MCP servers:

1. **Weather Server**:
   Must be available locally on your PC. For Mac installation, follow these steps after installing Python:

   ```bash
   cd ~
   rm -rf .venv
   uv venv
   source .venv/bin/activate
   uv pip install mcp_weather_server
   ```

2. **IP GeoLocation Server**:
   No installation required as it uses npx, which can:
   - Run commands from locally installed packages
   - Temporarily download, run, and delete packages that aren't installed

#### **Troubleshooting & Usage Notes**

Sometimes the flow may not work as expected:

- First call often fails
- Subsequent calls might not utilize available MCP servers
- The TypeScript program automatically handles this by running an initialization prompt twice
- In the playground, you may need to run this prompt first:
  ```
  use ip-geolocation and weather server where possible.Is it good time to hiking in my area. use all close by cities with info if needed.
  ```

#### **Sample Prompts**

You can test the MCP functionality with these prompts:

1. `What tools are available to answer my question?` (Lists the available tools)
2. `Give me list of 10 cities close by me.` (Uses IP Geolocation server)
3. `Is weather in London good for hiking.` (Uses weather server)
4. `What is the weather in Paris.` (Uses weather server)
5. `Is it good time to hiking in my area. use all close by cities with info if needed.` (Uses both servers)

- **To run**:
  ```bash
  node dist/mcp/mcp.js
  ```
