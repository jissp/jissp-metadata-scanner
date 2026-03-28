import { Injectable } from '@nestjs/common';
import { RegisterStrategy } from '../decorators/strategy.decorator';
import { BaseStrategy } from './base-strategy';

@RegisterStrategy({
    name: AStrategy.name,
})
@Injectable()
export class AStrategy extends BaseStrategy {}
