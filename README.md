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
    ├── src/functions/
    │   ├── function.json
    │   ├── DemoFunction.js
    ├── host.json
    ├── local.settings.json
    └── package.json
   ```

---

## **Code Example**

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
**function.json**
   ```json
      {
        "bindings": [
          {
            "authLevel": "anonymous",
            "type": "httpTrigger",
            "direction": "in",
            "name": "req",
            "methods": [ "get", "post" ]
          },
          {
            "type": "http",
            "direction": "out",
            "name": "res"
          }
        ]
      }
   ```
---

## **Local Testing**

### 1. Start the Azure Function Locally: Run the following command to start the function runtime:

```bash
func start
```

Example output:

```plaintext
Functions:
    DemoFunction: [GET,POST] http://localhost:7071/api/DemoFunction
```

### 2. Test the Function: Use curl, a browser, or Postman to send requests to the function.

GET Request:
```bash
curl "http://localhost:7071/api/DemoFunction?name=Azure"
```

Response:
```plaintext
Hello, Azure!
```

POST Request:
```bash
curl -X POST "http://localhost:7071/api/DemoFunction" -d "Azure"
```

Response:
```plaintext
Hello, Azure!
```

---

## **Deploying to Azure**

### 1. Login to Azure:
```bash
az login
```

### 2. Create a Resource Group:
```bash
az group create --name demoResourceGroup --location centralus
```

### 3. Create a Storage Account: Azure Functions require a storage account.
```bash
az storage account create --name demoStorageAccount --location centralus --resource-group demoResourceGroup --sku Standard_LRS
```

### 4. Create a Function App:
```bash
az functionapp create \
    --name demoAzureFunctionApp \
    --resource-group demoResourceGroup \
    --consumption-plan-location centralus \
    --runtime node \
    --functions-version 4 \
    --storage-account demoStorageAccount
```

### 5. Deploy Your Function:
```bash
func azure functionapp publish demoAzureFunctionApp
```

---

## **Useful Commands**
To List Deployed Functions:
```bash
az functionapp list --output table
```
To Get Function URL:
```bash
az functionapp show --name demoAzureFunctionApp --resource-group demoResourceGroup --query defaultHostName -o tsv
```
To Delete Function App:
```bash
az functionapp delete --name demoAzureFunctionApp --resource-group demoResourceGroup
```
---
## Cleanup/Delete Resources
After completing this demo, it’s a good idea to clean up your Azure resources to avoid charges:

### 1. Delete the Function App:
```bash
az functionapp delete --name demoAzureFunctionApp --resource-group demoResourceGroup
```

### 2. Delete the Storage Account:
```bash
az storage account delete --name demoStorageAccount --resource-group demoResourceGroup
```

### 3. Delete the Resource Group (Deletes All Associated Resources):
```bash
az group delete --name demoResourceGroup --yes --no-wait
```

---

## **Conclusion**
This demo demonstrates how to create, test, and deploy a simple HTTP-triggered Azure Function using Node.js. Azure Functions is an excellent service for building lightweight, serverless applications that scale automatically.

Feel free to extend this demo by adding more triggers, bindings, logging, or integrating it into a larger application!

Happy Serverless Coding! 🚀
