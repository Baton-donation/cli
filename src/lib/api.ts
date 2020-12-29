import got, { Got } from 'got'

export default class APIClient {
  private client: Got;

  constructor() {
    this.client = got.extend({prefixUrl: 'http://3.23.85.222'})
  }

  async getPublicKey() {
    const {body} = await this.client.get('keys/public');

    return body;
  }

  async deleteSentence(uuid: string) {
    await this.client.delete(`sentences/${uuid}`);
  }
}
