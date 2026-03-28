import { RegisterStrategyExecute } from '../decorators/strategy.decorator';

export abstract class BaseStrategy {
    @RegisterStrategyExecute()
    public execute() {
        console.log('execute');
    }
}
