import IHashAdapter from './hashAdapterInterface';
import bcrypt from 'bcrypt';

export default class HashAdapter implements IHashAdapter {
  public async compareHash(data: string, dataHashed: string): Promise<boolean> {
    return await bcrypt.compare(data, dataHashed);
  }

  public async createHash(data: string, salts: number = 10): Promise<string> {
    return await bcrypt.hash(data, salts);
  }
}
