import fetch from 'node-fetch';

// Types
export interface BrevoContact {
  email?: string;
  id?: number;
  emailBlacklisted?: boolean;
  smsBlacklisted?: boolean;
  listIds?: number[];
  attributes?: Record<string, any>;
}

export interface EmailOptions {
  to: { email: string; name?: string }[];
  subject: string;
  htmlContent: string;
  sender?: {
    name: string;
    email: string;
  };
}

export interface ContactAttribute {
  name: string;
  category: string;
  type: string;
  value?: string;
}

export class BrevoMCP {
  private apiKey: string;
  private defaultSender: { name: string; email: string };
  private baseUrl = 'https://api.brevo.com/v3';

  constructor(apiKey: string, defaultSenderEmail: string, defaultSenderName?: string) {
    this.apiKey = apiKey;
    this.defaultSender = {
      email: defaultSenderEmail,
      name: defaultSenderName || defaultSenderEmail.split('@')[0]
    };
  }

  private async makeRequest(endpoint: string, method: string = 'GET', body?: any) {
    const headers = {
      'accept': 'application/json',
      'api-key': this.apiKey,
      'content-type': 'application/json'
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Brevo API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return method === 'DELETE' ? null : await response.json();
  }

  // Contact Management
  async getContact(identifier: string | number): Promise<BrevoContact> {
    const endpoint = typeof identifier === 'number' 
      ? `/contacts/${identifier}`
      : `/contacts/${encodeURIComponent(identifier)}`;
    return this.makeRequest(endpoint);
  }

  async updateContact(id: number, data: Partial<BrevoContact>): Promise<void> {
    await this.makeRequest(`/contacts/${id}`, 'PUT', data);
  }

  async createAttribute(name: string, type: 'text' | 'date' | 'float' | 'boolean' = 'text'): Promise<void> {
    await this.makeRequest(`/contacts/attributes/normal/${name}`, 'POST', { type });
  }

  async getAttributes(): Promise<ContactAttribute[]> {
    const response = await this.makeRequest('/contacts/attributes');
    return response.attributes;
  }

  // Email Management
  async sendEmail(options: EmailOptions): Promise<{ messageId: string }> {
    const emailData = {
      ...options,
      sender: options.sender || this.defaultSender
    };
    return this.makeRequest('/smtp/email', 'POST', emailData);
  }

  async getEmailEvents(messageId?: string, email?: string): Promise<any[]> {
    let endpoint = '/smtp/statistics/events';
    const params = [];
    
    if (messageId) params.push(`messageId=${encodeURIComponent(messageId)}`);
    if (email) params.push(`email=${encodeURIComponent(email)}`);
    
    if (params.length > 0) {
      endpoint += `?${params.join('&')}`;
    }
    
    const response = await this.makeRequest(endpoint);
    return response.events;
  }

  // Sender Management
  async getSenders() {
    return this.makeRequest('/senders');
  }

  // Templates for Beautiful Emails
  static getDefaultTemplate(title: string, content: string, accentColor = '#667eea'): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
            }
            .container {
              max-width: 600px;
              margin: 40px auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, ${accentColor} 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              border-radius: 10px 10px 0 0;
              text-align: center;
            }
            .content {
              background: white;
              padding: 30px;
              border-radius: 0 0 10px 10px;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            .signature {
              color: #666;
              font-style: italic;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #eee;
            }
          </style>
        </head>
        <body>
          <div class='container'>
            <div class='header'>
              <h1>${title}</h1>
            </div>
            <div class='content'>
              ${content}
            </div>
          </div>
        </body>
      </html>
    `;
  }

  // Utility Functions
  static formatEmailSignature(name: string, title?: string, extra?: string): string {
    let signature = `<p class="signature">Best regards,<br>${name}`;
    if (title) signature += `<br><span style="color: #666;">${title}</span>`;
    if (extra) signature += `<br><span style="color: #666;">${extra}</span>`;
    signature += '</p>';
    return signature;
  }
}

export default BrevoMCP;