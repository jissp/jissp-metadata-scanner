import { Injectable } from '@nestjs/common';
import { RegisterStrategy } from '../decorators/strategy.decorator';

@RegisterStrategy()
@Injectable()
export class BStrategy {}
