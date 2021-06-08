import {Injectable, Ioc} from '@baidu/ioc';
import {UNetService} from '../services/net';
import {UNetInterceptor} from '../config/netInterceptor';
import {httpConfig} from '../config/http';
import {isProd} from '../helper/env';

@Injectable()
export class USetUp {
    async init() {
        await this.initNet();
    }

    async initNet() {
        // 超时时间
        UNetService.setTimeout(httpConfig.timeout);
        // 默认URL
        UNetService.setUrl(isProd() ? httpConfig.urlProd : httpConfig.urlDev);
        // 拦截器
        UNetService.setInterceptors([
            Ioc(UNetInterceptor),
        ]);
    }
}
