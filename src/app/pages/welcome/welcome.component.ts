import { Component, OnInit, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { ApiService } from '../../services/api.service'
import { environment } from './../../../enviroments/enviroment'

interface Product {
  id: string
  name: string
  price: string
}

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./welcome.component.css'],
  templateUrl: './welcome.component.html',
})
export class WelcomeComponent implements OnInit {
  message = signal('Loading...')
  appName = signal(environment.APP_NAME || 'App')
  logoUrl = signal(environment.APP_LOGO_URL || 'assets/logo.svg')

  products = signal<Product[]>([])
  loading = signal<boolean>(false)

  name = ''
  minPrice = ''
  maxPrice = ''

  private debounceTimeout: any = null

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.fetchWelcomeMessage()
    this.fetchProducts()
  }

  fetchWelcomeMessage() {
    this.api
      .getWelcome()
      .then((res) => this.message.set(res.data))
      .catch(() => this.message.set('Error loading welcome message.'))
  }

  fetchProducts(filters: any = {}) {
    this.loading.set(true)
    this.api
      .getProducts(filters)
      .then((res) => this.products.set(res.data || []))
      .catch(() => this.products.set([]))
      .finally(() => this.loading.set(false))
  }

  onFilterChange() {
    clearTimeout(this.debounceTimeout)
    this.debounceTimeout = setTimeout(() => {
      this.fetchProducts({
        name: this.name,
        minPrice: this.minPrice || undefined,
        maxPrice: this.maxPrice || undefined,
      })
    }, 500)
  }
}
