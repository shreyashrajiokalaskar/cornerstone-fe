import { IUser } from "@cornerstone/types";
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getData(user?: IUser): { message: string } {
    return { message: 'Hello API' };
  }
}
