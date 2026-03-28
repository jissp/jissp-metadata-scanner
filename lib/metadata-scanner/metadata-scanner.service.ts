import { Injectable } from '@nestjs/common';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import {
    MetadataScannerConfig,
    ScannedMetadata,
    ScannedPropertyMetadata,
} from './metadata-scanner.types';
import { isConstructorType } from './utils';
import { JISSP_PROPERTY_DECORATOR } from './decorators';

@Injectable()
export class MetadataScannerService {
    constructor(
        private readonly reflector: Reflector,
        private readonly discovery: DiscoveryService,
        private readonly metadataScanner: MetadataScanner,
    ) {}

    /**
     * 모든 프로바이더에서 특정 메타데이터를 스캔 (메서드/클래스용)
     */
    scan<Metadata>(
        config: MetadataScannerConfig<Metadata>,
    ): ScannedMetadata<object, Metadata>[] {
        const results: ScannedMetadata<object, Metadata>[] = [];

        const controllers = this.discovery.getControllers();
        const providers = this.discovery.getProviders();
        const wrappers = [...controllers, ...providers];

        for (const { instance } of wrappers) {
            if (!this.isObject(instance)) {
                continue;
            }

            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const prototype = Object.getPrototypeOf(instance);
            if (!prototype) {
                continue;
            }

            const methodNames = [
                'constructor',
                ...this.metadataScanner.getAllMethodNames(prototype),
            ];
            methodNames.forEach((methodName) => {
                const targetMethod = (instance as Record<string, unknown>)[
                    methodName
                ];
                if (typeof targetMethod !== 'function') {
                    return;
                }

                const metadata = this.reflector.get<Metadata>(
                    config.decorator,
                    targetMethod,
                );
                if (!metadata) {
                    return;
                }

                results.push({
                    instance,
                    methodName,
                    metadata,
                    isClassMetadata: methodName === 'constructor',
                });
            });
        }

        return results;
    }

    scanProperties<Metadata>(
        metadataKey: string | symbol,
        target: any,
    ): ScannedPropertyMetadata<Metadata>[] {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const _target = isConstructorType(target)
            ? target.prototype
            : Object.getPrototypeOf(target);

        const properties = Reflect.getMetadata(
            JISSP_PROPERTY_DECORATOR,
            _target,
        ) as string[];
        if (!properties) {
            return [];
        }

        return properties.map((property) => ({
            key: property,
            metadata: Reflect.getMetadata(
                metadataKey,
                _target,
                property,
            ) as Metadata,
        }));
    }

    /**
     * 객체 타입 여부 확인 (Type Guard)
     */
    private isObject(val: unknown): val is object {
        if (!val) {
            return false;
        }

        return typeof val === 'object';
    }
}
