import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';

import { IUntranslatedProductItems } from 'src/domain/interfaces';

@Injectable()
export class ProductGetFromContentfulApiUseCase {
  constructor(private readonly httpService: HttpService) {}

  execute(
    contentfulApiProductUri: string,
  ): Promise<AxiosResponse<IUntranslatedProductItems>> {
    return this.httpService.axiosRef.get(contentfulApiProductUri);
  }
}
