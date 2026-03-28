import { Reflector } from '@nestjs/core';
import { createPropertyDecorator } from '@libs/metadata-scanner';

export const REGISTER_STRATEGY_EXECUTE_METADATA =
    'REGISTER_STRATEGY_EXECUTE_METADATA';
export interface RegisterStrategyOptions {
    name?: string;
}

export const RegisterStrategy =
    Reflector.createDecorator<RegisterStrategyOptions>();
export const RegisterStrategyExecute = createPropertyDecorator(
    REGISTER_STRATEGY_EXECUTE_METADATA,
);
