# @jissp/metadata-scanner

NestJS 기반의 애플리케이션에서 클래스, 메서드 및 속성에 부여된 메타데이터를 동적으로 스캔하고 수집할 수 있게 도와주는 강력한 유틸리티 라이브러리입니다.

## 특징

- **자동 탐색**: 모든 Provider와 Controller를 전수 조사하여 특정 데코레이터가 붙은 대상을 찾아냅니다.
- **다양한 타겟**: 클래스 레벨, 메서드 레벨은 물론 속성(Property) 레벨의 메타데이터 스캔을 지원합니다.
- **NestJS 호환성**: @nestjs/core의 DiscoveryService와 Reflector를 활용하여 NestJS 생태계와 완벽하게 통합됩니다.
- **타입 안전성**: TypeScript Generic을 지원하여 스캔된 메타데이터의 타입을 안전하게 보장합니다.

## 설치

```bash
npm install @jissp/metadata-scanner
# 또는
yarn add @jissp/metadata-scanner
```

## 시작하기

### 1. 모듈 등록

`AppModule` 등에서 `MetadataScannerModule`을 임포트합니다.

```typescript
import { Module } from '@nestjs/common';
import { MetadataScannerModule } from '@jissp/metadata-scanner';

@Module({
  imports: [MetadataScannerModule],
})
export class AppModule {}
```

### 2. 메서드/클래스 메타데이터 스캔

NestJS의 `Reflector.createDecorator`를 사용하여 생성된 데코레이터를 스캔할 수 있습니다.

#### 데코레이터 정의
```typescript
import { Reflector } from '@nestjs/core';

export const MyDecorator = Reflector.createDecorator<string>();
```

#### 스캐너 사용
`MetadataScannerService`를 주입받아 등록된 모든 컨트롤러와 프로바이더 중에서 `MyDecorator`가 적용된 대상을 찾아냅니다.

```typescript
import { Injectable, OnModuleInit } from '@nestjs/common';
import { MetadataScannerService } from '@jissp/metadata-scanner';
import { MyDecorator } from './my.decorator';

@Injectable()
export class MyService implements OnModuleInit {
  constructor(private readonly scanner: MetadataScannerService) {}

  onModuleInit() {
    // 모든 Provider/Controller에서 MyDecorator가 붙은 메서드/클래스를 스캔
    const results = this.scanner.scan({
      decorator: MyDecorator,
    });

    results.forEach((res) => {
      console.log(`Instance: ${res.instance.constructor.name}`);
      console.log(`Method: ${res.methodName}`); // 'constructor' 이면 클래스 레벨 메타데이터
      console.log(`Metadata: ${res.metadata}`);
      console.log(`Is Class: ${res.isClassMetadata}`);
    });
  }
}
```

### 3. 속성(Property) 메타데이터 스캔

속성에 대한 메타데이터는 `createPropertyDecorator`를 사용하여 등록된 대상을 스캔할 수 있습니다.

#### 속성 데코레이터 정의
```typescript
import { createPropertyDecorator } from '@jissp/metadata-scanner';

export const MY_PROP_KEY = 'MY_PROPERTY_KEY';
export const MyProperty = createPropertyDecorator<string>(MY_PROP_KEY);
```

#### 타겟 클래스 예시
```typescript
class MyTarget {
  @MyProperty('metadata_value_1')
  property1: string;

  @MyProperty('metadata_value_2')
  property2: number;
}
```

#### 속성 스캐너 사용
특정 인스턴스 혹은 클래스에서 지정된 메타데이터 키를 가진 모든 속성을 추출합니다.

```typescript
const target = new MyTarget();
const properties = this.scanner.scanProperties<string>(MY_PROP_KEY, target);

// 결과: [{ key: 'property1', metadata: 'metadata_value_1' }, { key: 'property2', metadata: 'metadata_value_2' }]
```

## API 상세

### `MetadataScannerService`

#### `scan<Metadata>(config: MetadataScannerConfig<Metadata>)`
NestJS 애플리케이션의 모든 Provider와 Controller를 탐색합니다.
- `config.decorator`: `Reflector.createDecorator<T>()`로 생성된 데코레이터 인스턴스.
- **반환**: `ScannedMetadata<object, Metadata>[]` 배열.
  - `instance`: 해당 메타데이터가 발견된 실제 클래스 인스턴스.
  - `methodName`: 메타데이터가 정의된 메서드 이름 (`'constructor'`인 경우 클래스 레벨).
  - `metadata`: 정의된 메타데이터 값.
  - `isClassMetadata`: 클래스 레벨의 메타데이터인지 여부.

#### `scanProperties<Metadata>(metadataKey: string | symbol, target: any)`
특정 객체(또는 클래스 프로토타입)의 속성에 정의된 메타데이터를 추출합니다.
- `metadataKey`: 데코레이터에서 사용한 메타데이터 키.
- `target`: 스캔 대상 객체 또는 클래스.
- **반환**: `ScannedPropertyMetadata<Metadata>[]` 배열.
  - `key`: 속성(Property) 이름.
  - `metadata`: 해당 속성에 정의된 메타데이터 값.

### `createPropertyDecorator<T>(metadataKey: string)`
속성 레벨에서 메타데이터를 수집하기 위한 전용 데코레이터를 생성하는 헬퍼 함수입니다. 이 함수를 통해 생성된 데코레이터는 `scanProperties`에서 탐색이 가능하도록 속성 정보를 자동으로 추적합니다.

---

## 라이선스

MIT
