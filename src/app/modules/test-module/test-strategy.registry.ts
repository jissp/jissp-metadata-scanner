import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { MetadataScannerService } from '@libs/metadata-scanner';
import { BaseStrategy } from './strategies';
import {
    REGISTER_STRATEGY_EXECUTE_METADATA,
    RegisterStrategy,
    RegisterStrategyOptions,
} from './decorators';

@Injectable()
export class TestStrategyRegistry implements OnModuleInit {
    private readonly strategiesMap: Map<string, BaseStrategy> = new Map();
    private readonly strategyExecutesMap: Map<string, CallableFunction> =
        new Map();

    constructor(
        private readonly metadataScannerService: MetadataScannerService,
    ) {}

    onModuleInit() {
        const metadataList =
            this.metadataScannerService.scan<RegisterStrategyOptions>({
                decorator: RegisterStrategy,
            });

        metadataList.forEach(({ metadata, instance, isClassMetadata }) => {
            if (!isClassMetadata) {
                return;
            }

            const execute = this.metadataScannerService.scanProperties(
                REGISTER_STRATEGY_EXECUTE_METADATA,
                instance,
            );
            if (!execute.length) {
                return;
            }

            console.log(execute);
            const executeMethodName = execute[0].key;
            this.strategyExecutesMap.set(
                metadata.name || instance.constructor.name,
                (instance[executeMethodName] as CallableFunction).bind(
                    instance,
                ),
            );
        });
    }

    public getStrategy(strategyName: string): BaseStrategy {
        const strategy = this.strategiesMap.get(strategyName);
        if (!strategy) {
            throw new BadRequestException(
                `Invalid strategy name: ${strategyName}`,
            );
        }

        return strategy;
    }

    public getStrategyExecute(strategyName: string): CallableFunction {
        const execute = this.strategyExecutesMap.get(strategyName);
        if (!execute) {
            throw new BadRequestException(
                `Invalid ${strategyName} strategy execute`,
            );
        }

        return execute;
    }
}
