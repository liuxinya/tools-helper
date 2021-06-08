import {Injectable} from '@baidu/ioc';
import {FunReturnCache} from '../decorators/FunReturnCache';
import {UNetService} from './net';

@Injectable()
export class HttpCommonService {
    constructor(
        private net: UNetService
    ) {}

    @FunReturnCache()
    async test(): Promise<any> {
        return [];
    }
}
