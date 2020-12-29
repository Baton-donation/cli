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

  // Returns ID of download
  async createDownload(): Promise<string> {
    const {id} = await this.client.post('downloads').json();

    return id;
  }

  async getDownload(id: string) {
    return this.client.stream(`downloads/${id}`);
  }

  async getDownloadProgress(id: string): Promise<number> {
    const {progress} = await this.client.get(`downloads/${id}/progress`).json();

    return progress;
  }
}
