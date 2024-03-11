import axios from 'axios'
import config from '../../config.js'

export class ClientAPIService {
  static async instance (): Promise<ClientAPIService> {
    return new ClientAPIService('')
  }

  private readonly apiKey: string

  constructor (apiKey: string) {
    this.apiKey = apiKey
  }

  private async getAuthHeader (): Promise<{
    'x-api-key': string
  }> {
    return {
      'x-api-key': this.apiKey
    }
  }

  async get<Response = any>(path: string): Promise<Response> {
    console.log('ClientAPIService.get', config.ClientAPIURL, path)
    const fullPath = `${config.ClientAPIURL}/${path}`
    const authHeader = await this.getAuthHeader()
    const response = await axios.get(fullPath, {
      headers: {
        ...authHeader
      }
    })
    return response.data
  }

  async post<Response = any>(path: string, body: any): Promise<Response> {
    const fullPath = `${config.ClientAPIURL}/${path}`
    const authHeader = await this.getAuthHeader()
    const response = await axios.post(fullPath, body, {
      headers: {
        ...authHeader
      }
    })
    return response.data
  }

  async del<Response = any>(path: string): Promise<Response> {
    const fullPath = `${config.ClientAPIURL}/${path}`
    const authHeader = await this.getAuthHeader()
    const response = await axios.delete(fullPath, {
      headers: {
        ...authHeader
      }
    })
    return response.data
  }
}
