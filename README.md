# Brevo MCP (Multi-Channel Platform)
[![smithery badge](https://smithery.ai/badge/@apicolet/brevo-mcp)](https://smithery.ai/server/@apicolet/brevo-mcp)

A TypeScript library for integrating Brevo (formerly Sendinblue) API with Claude and other applications. This MCP provides easy-to-use functions for managing contacts, sending transactional emails, and tracking email events.

## Features

- 📧 Transactional Email Management
  - Send beautiful HTML emails
  - Track email events (delivery, opens, clicks)
  - Pre-built email templates
  
- 👥 Contact Management
  - Create and update contacts
  - Manage custom attributes
  - Retrieve contact information
  
- 🎨 Beautiful Email Templates
  - Gradient headers
  - Modern design
  - Customizable styles

## Installation

```bash
npm install brevo-mcp
```
### Installing via Smithery

To install Brevo Multi-Channel Platform for Claude Desktop automatically via [Smithery](https://smithery.ai/server/@apicolet/brevo-mcp):

```bash
npx -y @smithery/cli install @apicolet/brevo-mcp --client claude
```

### Configuration in Claude Desktop

To use this MCP in Claude Desktop conversations, follow these steps:

1. Install the package in your Claude Desktop configuration directory:
   ```bash
   cd ~/.claude/functions
   npm install brevo-mcp
   ```

2. Create a configuration file (if not exists):
   ```bash
   touch ~/.claude/config.json
   ```

3. Add the Brevo MCP configuration to your config.json:
   ```json
   {
     "functions": {
       "brevo": {
         "path": "~/.claude/functions/node_modules/brevo-mcp",
         "config": {
           "apiKey": "YOUR_BREVO_API_KEY",
           "defaultSender": {
             "email": "your.validated@email.com",
             "name": "Your Name"
           }
         }
       }
     }
   }
   ```

4. Restart Claude Desktop to load the new configuration

## Usage in Claude

Once configured, you can use the Brevo MCP in your Claude conversations. Here are some examples:

### Sending a Beautiful Email

```typescript
const brevo = new BrevoMCP(config.apiKey, config.defaultSender.email, config.defaultSender.name);

await brevo.sendEmail({
  to: [{ email: "recipient@example.com", name: "John Doe" }],
  subject: "Hello from Claude!",
  htmlContent: BrevoMCP.getDefaultTemplate(
    "Welcome!",
    "This is a test email." + 
    BrevoMCP.formatEmailSignature("Claude", "AI Assistant")
  )
});
```

### Managing Contacts

```typescript
// Get contact details
const contact = await brevo.getContact("john@example.com");

// Update contact information
await brevo.updateContact(contact.id, {
  attributes: {
    FIRSTNAME: "John",
    LASTNAME: "Doe",
    LINKEDIN: "https://linkedin.com/in/johndoe"
  }
});
```

### Creating Custom Attributes

```typescript
// Create a new custom attribute
await brevo.createAttribute("LINKEDIN", "text");

// Get all available attributes
const attributes = await brevo.getAttributes();
```

## API Reference

### BrevoMCP Class

#### Constructor
```typescript
constructor(apiKey: string, defaultSenderEmail: string, defaultSenderName?: string)
```

#### Methods

- `getContact(identifier: string | number): Promise<BrevoContact>`
- `updateContact(id: number, data: Partial<BrevoContact>): Promise<void>`
- `createAttribute(name: string, type: 'text' | 'date' | 'float' | 'boolean'): Promise<void>`
- `getAttributes(): Promise<ContactAttribute[]>`
- `sendEmail(options: EmailOptions): Promise<{ messageId: string }>`
- `getEmailEvents(messageId?: string, email?: string): Promise<any[]>`
- `getSenders(): Promise<any>`

#### Static Methods

- `getDefaultTemplate(title: string, content: string, accentColor?: string): string`
- `formatEmailSignature(name: string, title?: string, extra?: string): string`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Security

Never commit your Brevo API key to version control. Always use environment variables or secure configuration files.
