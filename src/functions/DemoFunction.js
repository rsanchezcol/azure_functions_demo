const { app } = require('@azure/functions');

app.http('DemoFunction', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);

        const name = request.query.get('name') || await request.text() || 'world';

        if (name) {
            return { body: `Hello, ${name}! Welcome to Azure Functions!` };
        } else {
            return { body: "Please pass a name on the query string or in the request body." };
        }
    }
});
