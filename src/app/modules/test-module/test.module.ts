import { Module } from '@nestjs/common';
import { MetadataScannerModule } from '@libs/metadata-scanner';
import { AStrategy, BStrategy } from './strategies';
import { TestStrategyRegistry } from './test-strategy.registry';

const strategies = [AStrategy, BStrategy];

@Module({
    imports: [MetadataScannerModule],
    providers: [...strategies, TestStrategyRegistry],
})
export class TestModule {}
