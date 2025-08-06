import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  template: `<h1>{{ welcomeMessage }}</h1>`,
})
export class AppComponent implements OnInit {
  welcomeMessage = '';

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getWelcome()
      .then(response => {
        // axios returns the response object
        this.welcomeMessage = response.data;
      })
      .catch(error => {
        console.error('API error:', error);
        this.welcomeMessage = 'Failed to load welcome message.';
      });
  }
}
