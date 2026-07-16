import { Injectable } from '@nestjs/common';

@Injectable()
export class NorthFlankTestMethod {
  constructor() {}
  async execute(): Promise<any> {
    return {
      status: 200,
      data: "O teste deu certo!",
    }
  }
}
