import { Injectable } from '@angular/core'
import { api } from '../../lib/axios'

@Injectable({ providedIn: 'root' })
export class ApiService {
  getWelcome() {
    return api.get('/welcome')
  }

  getProducts(filters: any) {
    return api.post('/products/get-all', filters)
  }
}
