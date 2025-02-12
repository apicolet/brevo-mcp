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

## Usage with Claude Desktop

1. Add this to your Claude Desktop configuration (typically `~/.config/claude-next/config.json`):
   ```json
   {
     "MCPServers": {
       "brevo": {
         "command": ["npx", "@apicolet/brevo-mcp"],
         "config": {
           "apiKey": "your-brevo-api-key-here"
         }
       }
     }
   }
   ```

2. Restart Claude Desktop to load the configuration

That's it! Now you can use Brevo functionality directly in your Claude conversations.

## Examples

Here are some examples of what you can do with the Brevo MCP in Claude:

### Sending Emails

```typescript
// Send a transactional email
const result = await mcp.brevo.send_email({
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
const contact = await mcp.brevo.get_contact("john@example.com");

// Update contact attributes
await mcp.brevo.update_contact(contact.id, {
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

- Keep your API keys safe and never commit them to version control
- Use environment variables or the secure config section in Claude Desktop for sensitive data
- The MCP server only handles communication between Claude and Brevo - no data is stored locally