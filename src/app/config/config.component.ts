import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-config',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 20px; max-width: 800px; margin: 0 auto;">
      <h2>API Configuration</h2>
      
      <div class="config-section">
        <h3>Current Environment</h3>
        <p><strong>Environment:</strong> {{ apiConfig.environment }}</p>
        <p><strong>Base URL:</strong> {{ apiConfig.baseUrl }}</p>
      </div>
      
      <div class="config-section">
        <h3>Available Endpoints</h3>
        <ul>
          <li *ngFor="let endpoint of endpointList">
            <strong>{{ endpoint.name }}:</strong> {{ endpoint.url }}
          </li>
        </ul>
      </div>
      
      <div class="config-section">
        <h3>Environment Switching</h3>
        <p>To switch environments, update the baseUrl in:</p>
        <ul>
          <li><code>src/environments/environment.ts</code> (Development)</li>
          <li><code>src/environments/environment.prod.ts</code> (Production)</li>
        </ul>
        
        <div class="example-configs">
          <h4>Example Configurations:</h4>
          <div class="config-example">
            <strong>Development:</strong>
            <pre>baseUrl: 'http://3.7.210.24:9001'</pre>
          </div>
          <div class="config-example">
            <strong>Production:</strong>
            <pre>baseUrl: 'https://your-production-api.com'</pre>
          </div>
          <div class="config-example">
            <strong>Staging:</strong>
            <pre>baseUrl: 'https://staging-api.yourdomain.com'</pre>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .config-section {
      margin-bottom: 30px;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 8px;
      background: #f9f9f9;
    }
    
    .config-section h3 {
      margin-top: 0;
      color: #333;
    }
    
    .endpoint-list {
      list-style: none;
      padding: 0;
    }
    
    .endpoint-list li {
      padding: 8px 0;
      border-bottom: 1px solid #eee;
    }
    
    .example-configs {
      margin-top: 20px;
    }
    
    .config-example {
      margin: 10px 0;
      padding: 10px;
      background: white;
      border-radius: 4px;
    }
    
    .config-example pre {
      margin: 5px 0;
      padding: 8px;
      background: #f0f0f0;
      border-radius: 4px;
      font-family: monospace;
    }
  `]
})
export class ConfigComponent {
  private apiService = inject(ApiService);
  
  apiConfig = this.apiService.getApiConfig();
  
  get endpointList() {
    return Object.entries(this.apiConfig.endpoints).map(([name, path]) => ({
      name,
      url: `${this.apiConfig.baseUrl}${path}`
    }));
  }
} 