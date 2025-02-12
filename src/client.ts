import fetch from 'node-fetch';
import type { BrevoContact, EmailOptions, ContactAttribute } from './types';

export class BrevoClient {
  private apiKey: string;
  private baseUrl = 'https://api.brevo.com/v3';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
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

    return response.json();
  }

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

  async sendEmail(options: EmailOptions): Promise<{ messageId: string }> {
    return this.makeRequest('/smtp/email', 'POST', options);
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
}
