#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ToolSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { BrevoClient } from './client';
import { ContactSchema, EmailOptionsSchema } from './types';

const ToolInputSchema = ToolSchema.shape.inputSchema;
type ToolInput = z.infer<typeof ToolInputSchema>;

interface ServerConfig {
  apiKey: string;
}

// Server setup
const server = new Server(
  {
    name: 'brevo-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

// Wait for config
let brevo: BrevoClient;

server.on('config', (config: ServerConfig) => {
  if (!config.apiKey) {
    console.error('Error: apiKey is required in config');
    process.exit(1);
  }
  brevo = new BrevoClient(config.apiKey);
});

// Tool handlers
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'get_contact',
      description: 'Get a contact\'s details from Brevo',
      inputSchema: zodToJsonSchema(z.object({
        identifier: z.union([z.string(), z.number()])
      })) as ToolInput,
    },
    {
      name: 'send_email',
      description: 'Send a transactional email via Brevo',
      inputSchema: zodToJsonSchema(EmailOptionsSchema) as ToolInput,
    },
    // Add other tools...
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;

    if (!brevo) {
      throw new Error('Server not configured');
    }

    switch (name) {
      case 'get_contact': {
        const contact = await brevo.getContact(args.identifier);
        return {
          content: [{ type: 'text', text: JSON.stringify(contact, null, 2) }],
        };
      }

      case 'send_email': {
        const result = await brevo.sendEmail(args);
        return {
          content: [{ type: 'text', text: `Email sent successfully. Message ID: ${result.messageId}` }],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [{ type: 'text', text: `Error: ${errorMessage}` }],
      isError: true,
    };
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Brevo MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});