# Brevo MCP (Multi-Channel Platform)

A Model Context Protocol (MCP) implementation for the Brevo API, designed for seamless integration with Claude and other AI assistants.

## Features

- ✉️ Email Management
  - Send transactional emails
  - Track email delivery and events
  - Beautiful email templates
  
- 👥 Contact Management
  - Create and update contacts
  - Manage custom attributes
  - Track contact activity

## Installation

```bash
npm install @apicolet/brevo-mcp
```

## Configuration with Claude Desktop

1. First, set up your Brevo API key as an environment variable:
   ```bash
   export BREVO_API_KEY=your-api-key-here
   ```

2. Install the MCP in your Claude Desktop configuration folder:
   ```bash
   cd ~/.claude/functions
   npm install @apicolet/brevo-mcp
   ```

3. Add to your Claude Desktop configuration (typically `~/.claude/config.json`):
   ```json
   {
     "functions": {
       "brevo": {
         "command": ["node", "node_modules/@apicolet/brevo-mcp/dist/server.js"]
       }
     }
   }
   ```

4. Restart Claude Desktop to load the new configuration

## Usage in Claude

Once configured, you can use the Brevo MCP in your conversations with Claude. Here are some examples:

### Sending Emails

```typescript
// Send a transactional email
const result = await functions.brevo.send_email({
  to: [{ 
    email: "recipient@example.com",
    name: "John Doe"
  }],
  subject: "Hello from Claude!",
  htmlContent: "<h1>Welcome!</h1><p>This is a test email.</p>"
});
```

### Managing Contacts

```typescript
// Get contact details
const contact = await functions.brevo.get_contact("john@example.com");

// Update contact attributes
await functions.brevo.update_contact(contact.id, {
  attributes: {
    FIRSTNAME: "John",
    LASTNAME: "Doe",
    COMPANY: "Acme Inc"
  }
});
```

## Available Tools

The MCP provides several tools that can be used in Claude:

- `get_contact`: Retrieve contact details by email or ID
- `update_contact`: Update contact attributes
- `create_attribute`: Create new contact attributes
- `send_email`: Send transactional emails
- `get_email_events`: Track email delivery and engagement

## Development

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/apicolet/brevo-mcp.git
   cd brevo-mcp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the project:
   ```bash
   npm run build
   ```

### Running Tests

```bash
npm test
```

### Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Security

Never commit your Brevo API key to version control. Always use environment variables for sensitive configuration.
