import { Module } from '@nestjs/common';
import { DiscoveryModule, MetadataScanner } from '@nestjs/core';
import { MetadataScannerService } from './metadata-scanner.service';

@Module({
    imports: [DiscoveryModule],
    providers: [MetadataScannerService, MetadataScanner],
    exports: [MetadataScannerService],
})
export class MetadataScannerModule {}
