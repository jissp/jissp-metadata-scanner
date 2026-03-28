import { Module } from '@nestjs/common';
import { TestModule } from './modules/test-module';

@Module({
    imports: [TestModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
