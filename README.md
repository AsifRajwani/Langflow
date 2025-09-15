## **LangFlow Tutorial Examples**

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
    ```

2.  **Build the Project**: Use the TypeScript compiler in watch mode to automatically compile your code.

    ```bash
    tsc -w
    ```

---

## **🚀 Examples**

### **1. Simple Agent**

This example corresponds to the [LangFlow quickstart tutorial](https://docs.langflow.org/get-started-quickstart). It demonstrates a basic, pre-configured agent that uses a single tool (the Calculator) to show fundamental functionality.

- **To run**:
  ```bash
  node dist/simple-agent/simple-agent.js
  ```

### **2. Connect Applications to Agents**

This tutorial focuses on how to **build an agent** within LangFlow itself. It teaches you to design and assemble an agent by connecting components and tools, such as a calculator and a web scraper.

- **To run**:
  ```bash
  node dist/agent-tutorial/agent-tutorial.js
  ```

### **3. Vector Store RAG**

This example demonstrates a Retrieval-Augmented Generation (RAG) system. It shows how to create a chatbot that can answer questions based on a provided document. Note that the behavior of this flow can sometimes be inconsistent.

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

This example explains the **Model Context Protocol (MCP)** and how to use LangFlow as both an MCP **client** and a **server**. It demonstrates how to expose your flows as tools for other applications.

- **To run**:
  ```bash
  node dist/mcp-tutorial/mcp-tutorial.js
  ```

This video explains how to use LangFlow as both an MCP client and server. [Learn how to use Langflow as both an MCP client & server\!](https://www.youtube.com/watch?v=pEjsaVVPjdI)
http://googleusercontent.com/youtube_content/4
