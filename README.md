# Farm Fresh App

## Setting Up AWS Amplify and Seeding Data

This guide will walk you through setting up AWS Amplify for your Farm Fresh app and seeding it with mock data.

### Prerequisites

- Node.js and npm installed
- AWS account
- Amplify CLI installed (`npm install -g @aws-amplify/cli`)

### Step 1: Initialize Amplify

1. Initialize Amplify in your project:
   ```bash
   amplify init
   ```
   - Follow the prompts to set up your project
   - Choose a name for your environment (e.g., dev, prod)
   - Select your AWS profile or create a new one

### Step 2: Add Authentication

1. Add authentication to your project:
   ```bash
   amplify add auth
   ```
   - Choose the default configuration or customize as needed
   - You can enable email/phone verification, MFA, etc.

### Step 3: Add API (GraphQL)

1. Add a GraphQL API:
   ```bash
   amplify add api
   ```
   - Select GraphQL
   - Choose Amazon Cognito User Pool for authorization
   - When asked for the schema, use the schema from `amplify/schema.graphql`

### Step 4: Add Storage (S3)

1. Add storage for images and files:
   ```bash
   amplify add storage
   ```
   - Select Content (Images, audio, video, etc.)
   - Provide a name for your S3 bucket
   - Configure access permissions (Auth/Guest)

### Step 5: Deploy Your Backend

1. Deploy your Amplify backend:
   ```bash
   amplify push
   ```
   - This will create all the necessary AWS resources
   - It will also generate the necessary code for your API

### Step 6: Update Configuration

1. After deployment, Amplify will generate configuration information
2. Update the `lib/amplify-config.ts` file with the values from your Amplify project
3. You can find these values in the AWS Amplify Console or in the `aws-exports.js` file that Amplify generates

### Step 7: Seed Mock Data

1. Install ts-node if you haven't already:
   ```bash
   npm install --save-dev ts-node
   ```

2. Run the seeding script:
   ```bash
   npm run seed-data
   ```
   - This will populate your database with the mock data from the `mocks` directory
   - The script will create farms, categories, products, posts, and comments

### Troubleshooting

- **API Throttling**: If you encounter API throttling errors, the script includes delays between operations. You may need to increase these delays.
- **Authentication Errors**: Make sure you're signed in with Amplify Auth before running the seeding script.
- **Schema Mismatches**: If you encounter schema validation errors, check that the mock data structure matches your GraphQL schema.

### Additional Resources

- [AWS Amplify Documentation](https://docs.amplify.aws/)
- [GraphQL API with AWS AppSync](https://docs.amplify.aws/lib/graphqlapi/getting-started/q/platform/js/)
- [Authentication with Amplify](https://docs.amplify.aws/lib/auth/getting-started/q/platform/js/)