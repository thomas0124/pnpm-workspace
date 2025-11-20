# Backend - DDD (ドメイン駆動設計) × 関数型プログラミング

このバックエンドは、ドメイン駆動設計（DDD）の原則と**シンプルな関数型スタイル**を組み合わせた4層アーキテクチャで構成されています。
ドメインモデルの定義には**Zod**を使用し、普通のTypeScriptで書ける実用的な実装を目指します。

参考: [TypeScript × ドメイン駆動設計ハンズオン](https://zenn.dev/yamachan0625/books/ddd-hands-on)

## 技術スタック

- **TypeScript**: 型安全な開発
- **Zod**: スキーマバリデーションとドメインモデル定義
- **Hono**: 軽量高速なWebフレームワーク
- **関数型の考え方**: シンプルで予測可能なコード

## ディレクトリ構成

```
src/
├── domain/              # ドメイン層
│   ├── models/         # 値オブジェクト・エンティティ
│   │   └── user/
│   │       └── user.ts           # ユーザーの型とスキーマ
│   ├── factories/      # ファクトリ関数
│   │   └── user/
│   │       └── userFactory.ts    # ユーザー生成関数
│   ├── services/       # ドメインサービス
│   │   └── userDomainService.ts
│   └── repositories/   # リポジトリ型定義（インターフェース）
│       └── userRepository.ts
│
├── application/        # アプリケーション層
│   ├── usecases/      # ユースケース
│   │   └── user/
│   │       ├── createUser.ts    # ユーザー作成
│   │       ├── getUser.ts       # ユーザー取得
│   │       └── updateUser.ts    # ユーザー更新
│   └── dto/           # DTO定義
│       └── userDto.ts
│
├── infrastructure/     # インフラストラクチャ層
│   ├── di/            # 依存性注入
│   │   └── container.ts         # DIコンテナ
│   ├── persistence/   # データベース実装
│   │   ├── prisma/
│   │   │   └── prismaUserRepository.ts  # Prisma実装（関数群）
│   │   └── inmemory/
│   │       └── inMemoryUserRepository.ts # インメモリ実装（関数群）
│   └── external/      # 外部API連携
│       └── emailService.ts
│
└── presentation/       # プレゼンテーション層
    ├── routes/        # ルーティング
    │   ├── user.ts
    │   └── index.ts
    ├── middlewares/   # ミドルウェア
    │   ├── errorHandler.ts
    │   └── logger.ts
    └── handlers/      # ハンドラー関数
        └── userHandlers.ts
```

---

## 各層の説明

### 1. ドメイン層（Domain Layer）

**役割**: ビジネスロジックの中核を担う層。

**責務**:
- ビジネスルールの定義
- ドメインモデルの定義（Zodスキーマ）
- リポジトリの型定義（インターフェース）
- 他の層に依存しない

**特徴**:
- **Zodスキーマ**: バリデーションとドメイン知識の表現
- **シンプルな関数**: 副作用を少なく
- **型定義**: 実装ではなく契約を定義

#### 実装例

##### モデル定義

```typescript
// domain/models/user/user.ts

import { z } from 'zod';

// Zodスキーマで値オブジェクトを定義
export const EmailSchema = z.string()
  .email('Invalid email format')
  .toLowerCase()
  .trim();

export const UserNameSchema = z.string()
  .min(1, 'Name must not be empty')
  .max(100, 'Name must be 100 characters or less')
  .trim();

export const UserIdSchema = z.string().uuid();

// エンティティのスキーマ
export const UserSchema = z.object({
  id: UserIdSchema,
  name: UserNameSchema,
  email: EmailSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

// 型を生成
export type User = z.infer<typeof UserSchema>;
```

##### ファクトリ関数

```typescript
// domain/factories/user/userFactory.ts

import { v4 as uuidv4 } from 'uuid';
import { UserSchema, type User } from '../../models/user/user';

// 新規ユーザーを作成
export function createUser(name: string, email: string): User {
  const now = new Date();
  
  return UserSchema.parse({
    id: uuidv4(),
    name,
    email,
    createdAt: now,
    updatedAt: now,
  });
}

// DBから取得したデータを再構築
export function reconstructUser(data: {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}): User {
  return UserSchema.parse(data);
}

// ユーザー名を変更（新しいオブジェクトを返す）
export function updateUserName(user: User, newName: string): User {
  return UserSchema.parse({
    ...user,
    name: newName,
    updatedAt: new Date(),
  });
}

// メールアドレスを変更（新しいオブジェクトを返す）
export function updateUserEmail(user: User, newEmail: string): User {
  return UserSchema.parse({
    ...user,
    email: newEmail,
    updatedAt: new Date(),
  });
}
```

##### リポジトリ型定義（インターフェース）

```typescript
// domain/repositories/userRepository.ts

import type { User } from '../models/user/user';

/**
 * ユーザーリポジトリの型定義
 * 
 * この型定義は「契約（Contract）」として機能します：
 * - ドメイン層は実装に依存せず、この型だけに依存
 * - インフラ層がこの型を満たす実装を提供
 * - テスト時はモック実装を簡単に作成可能
 */
export type UserRepository = {
  save: (user: User) => Promise<void>;
  findById: (id: string) => Promise<User | null>;
  findByEmail: (email: string) => Promise<User | null>;
  delete: (id: string) => Promise<void>;
};
```

##### ドメインサービス

```typescript
// domain/services/userDomainService.ts

import type { User } from '../models/user/user';
import type { UserRepository } from '../repositories/userRepository';

/**
 * メールアドレスの重複チェック
 * エンティティに属さないビジネスロジック
 */
export async function isDuplicateEmail(
  user: User,
  repository: UserRepository
): Promise<boolean> {
  const existingUser = await repository.findByEmail(user.email);
  return existingUser !== null && existingUser.id !== user.id;
}
```

---

### 2. アプリケーション層（Application Layer）

**役割**: ユースケースを実装する層。

**責務**:
- ユースケースの実行
- ドメイン層のオーケストレーション
- トランザクション管理

**特徴**:
- **関数で実装**: シンプルな関数でユースケースを表現
- **Repository型を使用**: 実装ではなく型に依存

#### 実装例

##### DTO定義

```typescript
// application/dto/userDto.ts

import { z } from 'zod';

// DTOスキーマ
export const UserDtoSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type UserDto = z.infer<typeof UserDtoSchema>;

// リクエストDTO
export const CreateUserRequestSchema = z.object({
  name: z.string(),
  email: z.string(),
});

export type CreateUserRequest = z.infer<typeof CreateUserRequestSchema>;

export const UpdateUserRequestSchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
});

export type UpdateUserRequest = z.infer<typeof UpdateUserRequestSchema>;
```

##### ユースケース - ユーザー作成

```typescript
// application/usecases/user/createUser.ts

import { createUser } from '../../../domain/factories/user/userFactory';
import { isDuplicateEmail } from '../../../domain/services/userDomainService';
import type { UserRepository } from '../../../domain/repositories/userRepository';
import type { CreateUserRequest, UserDto } from '../../dto/userDto';

/**
 * ユーザー作成ユースケース
 * 
 * @param request - ユーザー作成リクエスト
 * @param repository - リポジトリ（型定義に依存、実装は問わない）
 * @returns 作成されたユーザー
 */
export async function createUserUseCase(
  request: CreateUserRequest,
  repository: UserRepository
): Promise<UserDto> {
  // 1. ユーザーを作成
  const user = createUser(request.name, request.email);

  // 2. 重複チェック
  const duplicate = await isDuplicateEmail(user, repository);
  if (duplicate) {
    throw new Error('User with this email already exists');
  }

  // 3. 保存
  await repository.save(user);

  // 4. DTOとして返す
  return user;
}
```

##### ユースケース - ユーザー取得

```typescript
// application/usecases/user/getUser.ts

import type { UserRepository } from '../../../domain/repositories/userRepository';
import type { UserDto } from '../../dto/userDto';

export async function getUserUseCase(
  userId: string,
  repository: UserRepository
): Promise<UserDto | null> {
  const user = await repository.findById(userId);
  return user;
}
```

##### ユースケース - ユーザー更新

```typescript
// application/usecases/user/updateUser.ts

import { updateUserName, updateUserEmail } from '../../../domain/factories/user/userFactory';
import type { UserRepository } from '../../../domain/repositories/userRepository';
import type { UpdateUserRequest, UserDto } from '../../dto/userDto';

export async function updateUserUseCase(
  userId: string,
  request: UpdateUserRequest,
  repository: UserRepository
): Promise<UserDto> {
  // 1. ユーザーを取得
  let user = await repository.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  // 2. 更新（イミュータブル）
  if (request.name) {
    user = updateUserName(user, request.name);
  }
  if (request.email) {
    user = updateUserEmail(user, request.email);
  }

  // 3. 保存
  await repository.save(user);

  return user;
}
```

---

### 3. インフラストラクチャ層（Infrastructure Layer）

**役割**: 外部システムとの接続を担当する層。

**責務**:
- データベースアクセスの実装
- 外部APIとの通信
- 技術的詳細の隠蔽

**特徴**:
- **関数を個別エクスポート**: 各関数を独立して実装
- **型定義を満たす**: ドメイン層の型定義に準拠

#### 実装例

##### Prismaリポジトリ実装

```typescript
// infrastructure/persistence/prisma/prismaUserRepository.ts

import { PrismaClient } from '@prisma/client';
import { reconstructUser } from '../../../domain/factories/user/userFactory';
import type { User } from '../../../domain/models/user/user';
import type { UserRepository } from '../../../domain/repositories/userRepository';

const prisma = new PrismaClient();

/**
 * ユーザーを保存（作成または更新）
 */
export async function save(user: User): Promise<void> {
  await prisma.user.upsert({
    where: { id: user.id },
    update: {
      name: user.name,
      email: user.email,
      updatedAt: user.updatedAt,
    },
    create: {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  });
}

/**
 * IDでユーザーを検索
 */
export async function findById(id: string): Promise<User | null> {
  const userData = await prisma.user.findUnique({
    where: { id },
  });

  if (!userData) return null;

  return reconstructUser(userData);
}

/**
 * メールアドレスでユーザーを検索
 */
export async function findByEmail(email: string): Promise<User | null> {
  const userData = await prisma.user.findUnique({
    where: { email },
  });

  if (!userData) return null;

  return reconstructUser(userData);
}

/**
 * ユーザーを削除
 */
export async function deleteUser(id: string): Promise<void> {
  await prisma.user.delete({
    where: { id },
  });
}

// 型チェック（オプション）: 実装が型定義を満たしているか確認
const _typeCheck: UserRepository = {
  save,
  findById,
  findByEmail,
  delete: deleteUser,
};
```

##### インメモリリポジトリ（テスト用）

```typescript
// infrastructure/persistence/inmemory/inMemoryUserRepository.ts

import type { User } from '../../../domain/models/user/user';
import type { UserRepository } from '../../../domain/repositories/userRepository';

// プライベートストレージ
const users = new Map<string, User>();

/**
 * ユーザーを保存
 */
export async function save(user: User): Promise<void> {
  users.set(user.id, { ...user });
}

/**
 * IDでユーザーを検索
 */
export async function findById(id: string): Promise<User | null> {
  const user = users.get(id);
  return user ? { ...user } : null;
}

/**
 * メールアドレスでユーザーを検索
 */
export async function findByEmail(email: string): Promise<User | null> {
  for (const user of users.values()) {
    if (user.email === email) {
      return { ...user };
    }
  }
  return null;
}

/**
 * ユーザーを削除
 */
export async function deleteUser(id: string): Promise<void> {
  users.delete(id);
}

/**
 * すべてのユーザーをクリア（テスト用）
 */
export function clear(): void {
  users.clear();
}

// 型チェック（オプション）
const _typeCheck: UserRepository = {
  save,
  findById,
  findByEmail,
  delete: deleteUser,
};
```

##### DIコンテナ

```typescript
// infrastructure/di/container.ts

import { PrismaClient } from '@prisma/client';
import type { UserRepository } from '../../domain/repositories/userRepository';
import * as prismaUserRepo from '../persistence/prisma/prismaUserRepository';
import * as inMemoryUserRepo from '../persistence/inmemory/inMemoryUserRepository';

/**
 * シンプルなDIコンテナ
 * 
 * 複雑なDIライブラリは不要。
 * ただのオブジェクトで依存性を管理します。
 */

// 環境変数で実装を切り替え
const isTest = process.env.NODE_ENV === 'test';

export const container = {
  // Prismaクライアント（シングルトン）
  prisma: new PrismaClient(),
  
  /**
   * ユーザーリポジトリ
   * 環境に応じて実装を切り替え
   */
  get userRepository(): UserRepository {
    // テスト環境ではインメモリ
    if (isTest) {
      return {
        save: inMemoryUserRepo.save,
        findById: inMemoryUserRepo.findById,
        findByEmail: inMemoryUserRepo.findByEmail,
        delete: inMemoryUserRepo.deleteUser,
      };
    }
    
    // 本番・開発環境ではPrisma
    return {
      save: prismaUserRepo.save,
      findById: prismaUserRepo.findById,
      findByEmail: prismaUserRepo.findByEmail,
      delete: prismaUserRepo.deleteUser,
    };
  },
  
  // 他のリポジトリも同様に追加
  // get postRepository(): PostRepository { ... },
  // get commentRepository(): CommentRepository { ... },
};

export type Container = typeof container;
```

---

### 4. プレゼンテーション層（Presentation Layer）

**役割**: 外部とのインターフェースを提供する層。

**責務**:
- HTTPリクエストの受付
- リクエストのバリデーション
- ユースケースの呼び出し
- レスポンスの整形

**特徴**:
- **シンプルなハンドラー**: 直接的な関数でリクエストを処理
- **DIコンテナ経由**: リポジトリはコンテナから取得

#### 実装例

##### ハンドラー関数

```typescript
// presentation/handlers/userHandlers.ts

import type { Context } from 'hono';
import { createUserUseCase } from '../../application/usecases/user/createUser';
import { getUserUseCase } from '../../application/usecases/user/getUser';
import { updateUserUseCase } from '../../application/usecases/user/updateUser';
import { CreateUserRequestSchema, UpdateUserRequestSchema } from '../../application/dto/userDto';
import type { UserRepository } from '../../domain/repositories/userRepository';

/**
 * ユーザー作成ハンドラー
 */
export async function handleCreateUser(
  c: Context,
  userRepository: UserRepository
) {
  try {
    const body = await c.req.json();
    
    // リクエストバリデーション
    const request = CreateUserRequestSchema.parse(body);

    // ユースケース実行
    const user = await createUserUseCase(request, userRepository);

    return c.json(user, 201);
  } catch (error) {
    if (error instanceof Error) {
      return c.json({ error: error.message }, 400);
    }
    return c.json({ error: 'Internal server error' }, 500);
  }
}

/**
 * ユーザー取得ハンドラー
 */
export async function handleGetUser(
  c: Context,
  userRepository: UserRepository
) {
  try {
    const id = c.req.param('id');
    
    const user = await getUserUseCase(id, userRepository);
    
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    return c.json(user);
  } catch (error) {
    if (error instanceof Error) {
      return c.json({ error: error.message }, 400);
    }
    return c.json({ error: 'Internal server error' }, 500);
  }
}

/**
 * ユーザー更新ハンドラー
 */
export async function handleUpdateUser(
  c: Context,
  userRepository: UserRepository
) {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    
    // リクエストバリデーション
    const request = UpdateUserRequestSchema.parse(body);
    
    const user = await updateUserUseCase(id, request, userRepository);

    return c.json(user);
  } catch (error) {
    if (error instanceof Error) {
      return c.json({ error: error.message }, 400);
    }
    return c.json({ error: 'Internal server error' }, 500);
  }
}

/**
 * ユーザー削除ハンドラー
 */
export async function handleDeleteUser(
  c: Context,
  userRepository: UserRepository
) {
  try {
    const id = c.req.param('id');
    
    await userRepository.delete(id);
    
    return c.json({ message: 'User deleted successfully' });
  } catch (error) {
    if (error instanceof Error) {
      return c.json({ error: error.message }, 400);
    }
    return c.json({ error: 'Internal server error' }, 500);
  }
}
```

##### ルーティング

```typescript
// presentation/routes/user.ts

import { Hono } from 'hono';
import { container } from '../../infrastructure/di/container';
import {
  handleCreateUser,
  handleGetUser,
  handleUpdateUser,
  handleDeleteUser,
} from '../handlers/userHandlers';

export const userRoutes = new Hono();

// DIコンテナから依存性を取得
const { userRepository } = container;

// ルーティング
userRoutes.post('/users', (c) => handleCreateUser(c, userRepository));
userRoutes.get('/users/:id', (c) => handleGetUser(c, userRepository));
userRoutes.put('/users/:id', (c) => handleUpdateUser(c, userRepository));
userRoutes.delete('/users/:id', (c) => handleDeleteUser(c, userRepository));
```

##### メインルーター

```typescript
// presentation/routes/index.ts

import { Hono } from 'hono';
import { userRoutes } from './user';
import { errorHandler } from '../middlewares/errorHandler';
import { logger } from '../middlewares/logger';

export function createApp() {
  const app = new Hono();

  // グローバルミドルウェア（エラーハンドラーが先）
  app.use('*', errorHandler);
  app.use('*', logger);

  // ヘルスチェック
  app.get('/health', (c) => c.json({ status: 'ok' }));

  // APIルーティング
  app.route('/api', userRoutes);

  return app;
}
```

##### ミドルウェア - エラーハンドリング

```typescript
// presentation/middlewares/errorHandler.ts

import type { Context, Next } from 'hono';
import { ZodError } from 'zod';

export async function errorHandler(c: Context, next: Next) {
  try {
    await next();
  } catch (error) {
    console.error('Error:', error);
    
    // Zodエラーの処理
    if (error instanceof ZodError) {
      return c.json(
        {
          error: 'Validation error',
          details: error.errors,
          timestamp: new Date().toISOString(),
        },
        400
      );
    }
    
    // 一般的なエラー
    if (error instanceof Error) {
      return c.json(
        {
          error: error.message,
          timestamp: new Date().toISOString(),
        },
        500
      );
    }
    
    return c.json(
      {
        error: 'Internal server error',
        timestamp: new Date().toISOString(),
      },
      500
    );
  }
}
```

##### ミドルウェア - ロガー

```typescript
// presentation/middlewares/logger.ts

import type { Context, Next } from 'hono';

export async function logger(c: Context, next: Next) {
  const start = Date.now();
  const method = c.req.method;
  const path = c.req.path;
  
  await next();
  
  const duration = Date.now() - start;
  const status = c.res.status;
  
  console.log(`[${method}] ${path} - ${status} (${duration}ms)`);
}
```

---

## DIコンテナ（依存性注入）

### DIコンテナとは

DIコンテナは、アプリケーション全体の**依存性を一元管理**するオブジェクトです。このプロジェクトでは、複雑なDIライブラリではなく、**シンプルなオブジェクト**で実装します。

### なぜDIコンテナが必要か

#### 1. **依存関係の一元管理**

DIコンテナがない場合、各ルーティングファイルで毎回インスタンス化が必要：

```typescript
// DIコンテナなし - コードの重複
// routes/user.ts
const prisma = new PrismaClient();
const userRepository = createPrismaUserRepository(prisma);

// routes/post.ts
const prisma = new PrismaClient(); // 重複
const userRepository = createPrismaUserRepository(prisma); // 重複
const postRepository = createPrismaPostRepository(prisma);
```

DIコンテナがあれば、1箇所で管理：

```typescript
// DIコンテナあり - 一元管理
import { container } from '../../infrastructure/di/container';
const { userRepository } = container;
```

#### 2. **シングルトンの保証**

PrismaClientなどは、複数インスタンスを作るとコネクションプールの問題が発生します。DIコンテナで1つのインスタンスを共有：

```typescript
export const container = {
  prisma: new PrismaClient(), // シングルトン
  
  get userRepository() {
    return createPrismaUserRepository(this.prisma); // 同じprismaを使用
  },
};
```

#### 3. **環境による実装切り替え**

テスト環境と本番環境で、自動的に実装を切り替え：

```typescript
const isTest = process.env.NODE_ENV === 'test';

export const container = {
  get userRepository(): UserRepository {
    // テスト環境ではインメモリ、本番環境ではPrisma
    return isTest ? inMemoryUserRepo : prismaUserRepo;
  },
};
```

#### 4. **テストの容易性**

モックに簡単に差し替え可能：

```typescript
// テストコード
import { container } from './container';

beforeEach(() => {
  // テスト用にモックに差し替え
  container.userRepository = mockUserRepository;
});
```

---

### いつDIコンテナを使うべきか

| プロジェクト規模 | DIコンテナ | 理由 |
|---|---|---|
| **小規模**<br>（エンドポイント ~10個） | 不要 | 直接インポートで十分 |
| **中規模**<br>（エンドポイント 10-30個） | **推奨** | 管理が楽になる |
| **大規模**<br>（エンドポイント 30個~） | **必須** | DIライブラリも検討 |

---

### DIコンテナの実装パターン

#### パターン1: シンプルなオブジェクト（推奨）

```typescript
// infrastructure/di/container.ts

import { PrismaClient } from '@prisma/client';
import * as prismaUserRepo from '../persistence/prisma/prismaUserRepository';

export const container = {
  prisma: new PrismaClient(),
  
  get userRepository() {
    return {
      save: prismaUserRepo.save,
      findById: prismaUserRepo.findById,
      findByEmail: prismaUserRepo.findByEmail,
      delete: prismaUserRepo.deleteUser,
    };
  },
};
```

#### パターン2: 環境による切り替え

```typescript
// infrastructure/di/container.ts

import * as prismaUserRepo from '../persistence/prisma/prismaUserRepository';
import * as inMemoryUserRepo from '../persistence/inmemory/inMemoryUserRepository';

const isTest = process.env.NODE_ENV === 'test';

export const container = {
  get userRepository(): UserRepository {
    const impl = isTest ? inMemoryUserRepo : prismaUserRepo;
    
    return {
      save: impl.save,
      findById: impl.findById,
      findByEmail: impl.findByEmail,
      delete: impl.deleteUser || impl.delete,
    };
  },
};
```

#### パターン3: ファクトリ関数

```typescript
// infrastructure/di/container.ts

export function createContainer(env: 'test' | 'production') {
  const prisma = new PrismaClient();
  
  return {
    prisma,
    
    get userRepository(): UserRepository {
      if (env === 'test') {
        return createInMemoryUserRepository();
      }
      return createPrismaUserRepository(prisma);
    },
  };
}

export const container = createContainer(
  process.env.NODE_ENV === 'test' ? 'test' : 'production'
);
```

---

### DIコンテナの使い方

#### ルーティングで使用

```typescript
// presentation/routes/user.ts

import { container } from '../../infrastructure/di/container';
import { handleCreateUser } from '../handlers/userHandlers';

export const userRoutes = new Hono();

// コンテナから依存性を取得
const { userRepository } = container;

userRoutes.post('/users', (c) => handleCreateUser(c, userRepository));
```

#### ハンドラーで使用

```typescript
// presentation/handlers/userHandlers.ts

export async function handleCreateUser(
  c: Context,
  userRepository: UserRepository // 型定義に依存
) {
  const request = CreateUserRequestSchema.parse(await c.req.json());
  const user = await createUserUseCase(request, userRepository);
  return c.json(user, 201);
}
```

---

### DIコンテナなしの代替案

小規模プロジェクトでは、DIコンテナなしでも問題ありません：

```typescript
// presentation/routes/user.ts

import { PrismaClient } from '@prisma/client';
import * as prismaUserRepo from '../../infrastructure/persistence/prisma/prismaUserRepository';

const prisma = new PrismaClient();

const userRepository = {
  save: prismaUserRepo.save,
  findById: prismaUserRepo.findById,
  findByEmail: prismaUserRepo.findByEmail,
  delete: prismaUserRepo.deleteUser,
};

userRoutes.post('/users', (c) => handleCreateUser(c, userRepository));
```

**メリット**:
- シンプル
- ファイル数が少ない

**デメリット**:
- コードの重複
- 環境切り替えが面倒

---

## Repository型定義の使用方法

Repository型定義は**契約（Contract）**として機能します。実装に依存せず、型だけに依存することで、柔軟で保守性の高いコードを実現できます。

### 1. ユースケースで型を指定

```typescript
// application/usecases/user/createUser.ts

import type { UserRepository } from '../../../domain/repositories/userRepository';

// 引数の型として UserRepository を指定
export async function createUserUseCase(
  request: CreateUserRequest,
  repository: UserRepository  // ← どの実装でも受け入れ可能
): Promise<UserDto> {
  // repository.save, repository.findById などが使える
  // 具体的な実装は知らなくて良い
}
```

**メリット**:
- ユースケースは実装の詳細を知らない（疎結合）
- テスト時に簡単にモックに差し替え可能
- Prisma、InMemory、MongoDB など、どの実装でも動作

---

### 2. テストでモック作成

```typescript
// application/usecases/user/createUser.test.ts

import { describe, it, expect } from 'vitest';
import { createUserUseCase } from './createUser';
import type { UserRepository } from '../../../domain/repositories/userRepository';

describe('createUserUseCase', () => {
  it('should create user', async () => {
    // モックリポジトリ（型定義を満たす）
    const mockRepository: UserRepository = {
      save: async (user) => {
        console.log('Saved:', user);
      },
      findById: async (id) => null,
      findByEmail: async (email) => null,
      delete: async (id) => {},
    };
    
    const result = await createUserUseCase(
      { name: 'Test', email: 'test@example.com' },
      mockRepository
    );
    
    expect(result.name).toBe('Test');
  });
});
```

**メリット**:
- 型定義があるので、モックが簡単に作れる
- 実装が変わってもテストコードは変わらない

---

### 3. 型チェック（実装側）

実装が型定義を満たしているか確認：

```typescript
// infrastructure/persistence/prisma/prismaUserRepository.ts

import type { UserRepository } from '../../../domain/repositories/userRepository';

export async function save(user: User): Promise<void> { ... }
export async function findById(id: string): Promise<User | null> { ... }
export async function findByEmail(email: string): Promise<User | null> { ... }
export async function deleteUser(id: string): Promise<void> { ... }

// 型チェック用（ビルド時にエラーが出る）
const _typeCheck: UserRepository = {
  save,
  findById,
  findByEmail,
  delete: deleteUser,  // 関数名が違っても OK
};
```

**メリット**:
- コンパイル時に型の不一致を検出
- リファクタリング時の安全性向上

---

## 依存関係のルール

DDDアーキテクチャの依存関係：

```
Presentation → Application → Domain ← Infrastructure
                               ↑
                        (型定義のみ依存)
```

### 重要な原則

1. **ドメイン層は他の層に依存しない**
   - ドメイン層は純粋なTypeScriptの関数と型のみ
   - リポジトリは型定義だけ（実装はインフラ層）
   - Zodは許容（バリデーションはドメイン知識）

2. **依存性の逆転（Dependency Inversion）**
   - ドメイン層: リポジトリの型定義（Contract）
   - インフラ層: リポジトリの実装（関数群）
   - アプリケーション層: 型定義に依存、実装は注入される

3. **シンプルなDI**
   - 小規模: 直接インポート
   - 中規模: シンプルなコンテナオブジェクト
   - 大規模: DIライブラリ検討

---

## テスト戦略

### 単体テスト - バリデーション

```typescript
// domain/models/user/user.test.ts

import { describe, it, expect } from 'vitest';
import { EmailSchema, UserNameSchema } from './user';

describe('EmailSchema', () => {
  it('should validate correct email', () => {
    const result = EmailSchema.safeParse('test@example.com');
    expect(result.success).toBe(true);
  });

  it('should reject invalid email', () => {
    const result = EmailSchema.safeParse('invalid-email');
    expect(result.success).toBe(false);
  });

  it('should normalize email', () => {
    const email = EmailSchema.parse('  TEST@EXAMPLE.COM  ');
    expect(email).toBe('test@example.com');
  });
});
```

### 単体テスト - ファクトリ関数

```typescript
// domain/factories/user/userFactory.test.ts

import { describe, it, expect } from 'vitest';
import { createUser, updateUserName } from './userFactory';

describe('createUser', () => {
  it('should create user with valid data', () => {
    const user = createUser('Test User', 'test@example.com');
    
    expect(user.name).toBe('Test User');
    expect(user.email).toBe('test@example.com');
    expect(user.id).toBeDefined();
    expect(user.createdAt).toBeInstanceOf(Date);
  });

  it('should throw error for invalid email', () => {
    expect(() => createUser('Test', 'invalid')).toThrow();
  });
});

describe('updateUserName', () => {
  it('should update name immutably', () => {
    const user = createUser('Old Name', 'test@example.com');
    const updated = updateUserName(user, 'New Name');
    
    // 元のオブジェクトは変更されない
    expect(user.name).toBe('Old Name');
    // 新しいオブジェクトは変更されている
    expect(updated.name).toBe('New Name');
    // IDは同じ
    expect(updated.id).toBe(user.id);
  });
});
```

### 統合テスト - ユースケース（モックリポジトリ使用）

```typescript
// application/usecases/user/createUser.test.ts

import { describe, it, expect, beforeEach } from 'vitest';
import { createUserUseCase } from './createUser';
import type { UserRepository } from '../../../domain/repositories/userRepository';
import type { User } from '../../../domain/models/user/user';

describe('createUserUseCase', () => {
  let mockRepository: UserRepository;
  let savedUsers: User[];

  beforeEach(() => {
    savedUsers = [];
    
    // モックリポジトリ
    mockRepository = {
      save: async (user: User) => {
        savedUsers.push(user);
      },
      findById: async (id: string) => {
        return savedUsers.find(u => u.id === id) || null;
      },
      findByEmail: async (email: string) => {
        return savedUsers.find(u => u.email === email) || null;
      },
      delete: async (id: string) => {
        savedUsers = savedUsers.filter(u => u.id !== id);
      },
    };
  });

  it('should create new user', async () => {
    const result = await createUserUseCase(
      {
        name: 'Test User',
        email: 'test@example.com',
      },
      mockRepository
    );

    expect(result.name).toBe('Test User');
    expect(result.email).toBe('test@example.com');
    expect(result.id).toBeDefined();
    expect(savedUsers).toHaveLength(1);
  });

  it('should throw error for duplicate email', async () => {
    await createUserUseCase(
      { name: 'Test User', email: 'test@example.com' },
      mockRepository
    );

    await expect(
      createUserUseCase(
        { name: 'Another User', email: 'test@example.com' },
        mockRepository
      )
    ).rejects.toThrow('User with this email already exists');
  });
});
```

### 統合テスト - ユースケース（インメモリリポジトリ使用）

```typescript
// application/usecases/user/createUser.integration.test.ts

import { describe, it, expect, beforeEach } from 'vitest';
import { createUserUseCase } from './createUser';
import * as inMemoryUserRepo from '../../../infrastructure/persistence/inmemory/inMemoryUserRepository';

describe('createUserUseCase (with InMemory)', () => {
  beforeEach(() => {
    inMemoryUserRepo.clear();
  });

  it('should create and persist user', async () => {
    const repository = {
      save: inMemoryUserRepo.save,
      findById: inMemoryUserRepo.findById,
      findByEmail: inMemoryUserRepo.findByEmail,
      delete: inMemoryUserRepo.deleteUser,
    };

    const result = await createUserUseCase(
      { name: 'Test User', email: 'test@example.com' },
      repository
    );

    // 実際に保存されているか確認
    const saved = await inMemoryUserRepo.findById(result.id);
    expect(saved).not.toBeNull();
    expect(saved?.name).toBe('Test User');
  });
});
```

---

## まとめ

このアーキテクチャは、**DDDの原則**と**シンプルな関数型スタイル**を組み合わせることで、保守性が高く、テストしやすいコードを実現します。

### 主な特徴

✅ **シンプル**: クラス不要、普通のTypeScriptで書ける  
✅ **実用的**: Zodで型安全、Repository型定義で柔軟な実装切り替え  
✅ **保守性**: 4層アーキテクチャで関心事を分離

## 参考資料

- [TypeScript × ドメイン駆動設計ハンズオン](https://zenn.dev/yamachan0625/books/ddd-hands-on)
- [Zod Documentation](https://zod.dev/)
- エリック・エヴァンスのドメイン駆動設計（DDD本）