# Azure Functions Demo Example Using Node.js

This repository provides a step-by-step guide and code example for creating, testing, and deploying an **Azure Function** using **Node.js**. Azure Functions is a serverless compute service that enables you to run code on demand without managing infrastructure.

---

## **Table of Contents**

1. [Introduction](#introduction)
2. [Prerequisites](#prerequisites)
3. [Project Setup](#project-setup)
4. [Code Example](#code-example)
5. [Local Testing](#local-testing)
6. [Deploying to Azure](#deploying-to-azure)
7. [Useful Commands](#useful-commands)
8. [Cleanup/Delete Resources](#cleanupdelete-resources)
9. [Conclusion](#conclusion)

---

## **Introduction**

In this demo, we’ll create a simple HTTP-triggered **Azure Function** using **Node.js**. The function responds to HTTP requests and processes either query string parameters or request body data to return a greeting message.

---

## **Prerequisites**

Before you begin, ensure you have the following:

1. **Azure Subscription**:
   - If you don't have an Azure subscription, create a free account [here](https://azure.microsoft.com/en-us/free/).

2. **Tools Required**:
   - **Azure CLI**: Install from [Azure CLI Installation Guide](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli).
   - **Node.js**: Install from [Node.js Official Website](https://nodejs.org/), version >= 18.  
     - Verify: `node -v`
   - **Azure Functions Core Tools**: Install using npm:
     ```bash
     npm install -g azure-functions-core-tools@4 --unsafe-perm true
     ```
     - Verify: `func --version`

---

## **Project Setup**

1. **Create a New Azure Function Project**:
   ```bash
   mkdir azure-functions-demo
   cd azure-functions-demo
   func init . --worker-runtime node --model modern
   ```
   * Choose Node.js as the runtime.
   * The --model modern flag ensures you're using the Azure Functions modern programming model.

2. **Create a New HTTP-Triggered Function**:
   ```bash
   func new
   ```
   * Select HTTP Trigger as the template.
   * Name the function (e.g., DemoFunction).
   * Choose anonymous as the authorization level.

Your project structure should now look like this:
   ```bash
    azure-functions-demo/
    ├── DemoFunction/
    │   ├── function.json
    │   ├── index.js
    ├── host.json
    ├── local.settings.json
    └── package.json
   ```

---

## Code Example

Replace the content of DemoFunction.js with the following code:

**DeemoFunction.js**
   ```javascript
   const { app } = require('@azure/functions');
   
   app.http('DemoFunction', {
       methods: ['GET', 'POST'], // Accept GET and POST requests
       authLevel: 'anonymous',  // Anonymous access
       handler: async (request, context) => {
           context.log(`Http function processed request for URL "${request.url}"`);
   
           // Retrieve 'name' from query string or request body
           const name = request.query.get('name') || await request.text() || 'world';
   
           // Return greeting message
           return { body: `Hello, ${name}!` };
       }
   });
   ```
