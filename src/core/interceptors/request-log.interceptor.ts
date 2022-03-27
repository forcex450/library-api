import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class RequestLogInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const client = {
      date: new Date().toISOString(),
      urlRequest: '',
      navigator: '',
    };

    const request = context.switchToHttp().getRequest();
    client.navigator = request.headers['user-agent'];
    client.urlRequest = `${request.method} ${request.url}`;
    console.log(client);

    return next.handle();
  }
}
