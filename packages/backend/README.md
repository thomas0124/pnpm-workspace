# 📚 Backend - DDD (ドメイン駆動設計) × 関数型プログラミング

このバックエンドは、ドメイン駆動設計（DDD）の原則と**シンプルな関数型スタイル**を組み合わせた4層アーキテクチャで構成されているよ！✨
ドメインモデルの定義には**Zod**を使用して、普通のTypeScriptで書ける実用的な実装を目指しているんだ。

参考: [TypeScript × ドメイン駆動設計ハンズオン](https://zenn.dev/yamachan0625/books/ddd-hands-on)

## 🛠️ 技術スタック

- 🔷 **TypeScript** - 型安全な開発ができるよ
- ✅ **Zod** - スキーマバリデーションとドメインモデル定義に使うよ
- ⚡ **Hono** - 軽量高速なWebフレームワークだよ
- 🗄️ **Drizzle ORM** - 型安全で軽量なORMだよ
- ☁️ **Cloudflare D1** - エッジで動くSQLiteデータベースだよ
- 💭 **関数型の考え方** - シンプルで予測可能なコードが書けるよ

## 📂 ディレクトリ構成

```
backend/
├── domain/              # ドメイン層
│   ├── models/         # 値オブジェクト・エンティティ
│   │   └── user.ts           # ユーザーの型とスキーマ
│   ├── factories/      # ファクトリ関数
│   │   └── user.ts    # ユーザー生成関数
│   ├── services/       # ドメインサービス
│   │   └── user.ts
│   └── repositories/   # リポジトリ型定義（インターフェース）
│       └── user.ts
│
├── application/        # アプリケーション層
│   ├── usecases/      # ユースケース
│   │   └── user/
│   │       └── createUser.ts    # ユーザー作成
│   └── dto/           # DTO定義
│       └── user.ts
│
├── infrastructure/     # インフラストラクチャ層
│   ├── di/            # 依存性注入
│   │   └── container.ts         # DIコンテナ
│   ├── persistence/   # データベース実装
│   │   └── drizzle/
│   │       ├── schema/
│   │       │   └── user.ts      # Drizzleスキーマ定義
│   │       ├── migrations/      # マイグレーションファイル
│   │       │   ├── 0000_xxx.sql
│   │       │   └── meta/
│   │       ├── client.ts        # Drizzleクライアント
│   │       └── userRepository.ts  # Drizzle実装（関数群）
│   └── external/      # 外部API連携
│       └── emailService.ts
│
├── presentation/       # プレゼンテーション層
│   ├── routes/        # ルーティング
│   │   ├── user.ts
│   │   └── index.ts
│   ├── middlewares/   # ミドルウェア
│   │   └── errorHandler.ts
│   └── handlers/      # ハンドラー関数
│       └── user.ts
│
├── drizzle.config.ts  # Drizzle設定ファイル
├── index.ts           # エントリポイント
└── server.ts          # サーバー設定
```

---

## 🏗️ 各層の説明

### 1. 🏛️ ドメイン層（Domain Layer）

**役割**: ビジネスロジックの心臓部！他の層には一切頼らないよ 💪

**責務**:

- ✨ ビジネスルールの定義
- 💎 ドメインモデルの定義（Zodスキーマ）
- 📜 リポジトリの型定義（インターフェース）
- 🔒 他の層に依存しない

**特徴**:

- **Zodスキーマ**: バリデーションとドメイン知識を表現できるよ
- **シンプルな関数**: 副作用を少なくして予測しやすいコードに
- **型定義**: 実装ではなく契約を定義するんだ

#### 📝 実装例

##### 💎 モデル定義

```typescript
// domain/models/user.ts

import { z } from 'zod'

// Zodスキーマで値オブジェクトを定義
export const EmailSchema = z.string().email('Invalid email format').toLowerCase().trim()

export const UserNameSchema = z
  .string()
  .min(1, 'Name must not be empty')
  .max(100, 'Name must be 100 characters or less')
  .trim()

export const UserIdSchema = z.string().uuid()

// エンティティのスキーマ
export const UserSchema = z.object({
  id: UserIdSchema,
  name: UserNameSchema,
  email: EmailSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
})

// 型を生成
export type User = z.infer<typeof UserSchema>
```

##### 🏭 ファクトリ関数

```typescript
// domain/factories/user.ts

import { v4 as uuidv4 } from 'uuid'
import { UserSchema, type User } from '../../models/user'

// 新規ユーザーを作成
export function createUser(name: string, email: string): User {
  const now = new Date()

  return UserSchema.parse({
    id: uuidv4(),
    name,
    email,
    createdAt: now,
    updatedAt: now,
  })
}

// DBから取得したデータを再構築
export function reconstructUser(data: {
  id: string
  name: string
  email: string
  createdAt: Date
  updatedAt: Date
}): User {
  return UserSchema.parse(data)
}
```

##### 📜 リポジトリ型定義（インターフェース）

```typescript
// domain/repositories/user.ts

import type { User } from '../models/user'

/**
 * ユーザーリポジトリの型定義
 *
 * この型定義は「契約（Contract）」として機能するよ！：
 * - ✨ ドメイン層は実装に依存せず、この型だけに依存するんだ
 * - 🔧 インフラ層がこの型を満たす実装を提供してくれる
 */
export type UserRepository = {
  save: (user: User) => Promise<void>
  findById: (id: string) => Promise<User | null>
  findByEmail: (email: string) => Promise<User | null>
  delete: (id: string) => Promise<void>
}
```

##### 🤝 ドメインサービス

```typescript
// domain/services/user.ts

import type { User } from '../models/user'
import type { UserRepository } from '../repositories/user'

/**
 * メールアドレスの重複チェック
 * エンティティに属さないビジネスロジックだよ
 */
export async function isDuplicateEmail(user: User, repository: UserRepository): Promise<boolean> {
  const existingUser = await repository.findByEmail(user.email)
  return existingUser !== null && existingUser.id !== user.id
}
```

---

### 2. 🎮 アプリケーション層（Application Layer）

**役割**: 業務の流れを指揮する司令塔！ドメイン層の機能を組み合わせるよ 🎵

**責務**:

- 🚀 ユースケースの実行
- 🎵 ドメイン層のオーケストレーション
- 💼 トランザクション管理

**特徴**:

- **関数で実装**: シンプルな関数でユースケースを表現するよ
- **Repository型を使用**: 実装ではなく型に依存するんだ

#### 📝 実装例

##### 💌 DTO定義

```typescript
// application/dto/user.ts

import { z } from 'zod'

// DTOスキーマ
export const UserDtoSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type UserDto = z.infer<typeof UserDtoSchema>

// リクエストDTO
export const CreateUserRequestSchema = z.object({
  name: z.string(),
  email: z.string(),
})

export type CreateUserRequest = z.infer<typeof CreateUserRequestSchema>
```

##### ✨ ユースケース - ユーザー作成

```typescript
// application/usecases/user/createUser.ts

import { createUser } from '../../domain/factories/user'
import { isDuplicateEmail } from '../../domain/services/user'
import type { UserRepository } from '../../domain/repositories/user'
import type { CreateUserRequest, UserDto } from '../../application/dto/user'

/**
 * ユーザー作成ユースケース
 *
 * @param request - ユーザー作成リクエストだよ
 * @param repository - リポジトリ（型定義に依存、実装は問わない）
 * @returns 作成されたユーザー
 */
export async function createUserUseCase(
  request: CreateUserRequest,
  repository: UserRepository
): Promise<UserDto> {
  // 1. ユーザーを作成するよ
  const user = createUser(request.name, request.email)

  // 2. 重複チェックするよ
  const duplicate = await isDuplicateEmail(user, repository)
  if (duplicate) {
    throw new Error('User with this email already exists')
  }

  // 3. 保存するよ
  await repository.save(user)

  // 4. DTOとして返すよ
  return user
}
```

---

### 3. 🔌 インフラストラクチャ層（Infrastructure Layer）

**役割**: データベースなど、外の世界とつながる架け橋！🌉

**責務**:

- 💾 データベースアクセスの実装
- 🌐 外部APIとの通信
- 🔐 技術的詳細の隠蔽

**特徴**:

- **関数を個別エクスポート**: 各関数を独立して実装するよ
- **型定義を満たす**: ドメイン層の型定義に準拠するんだ

#### 📝 実装例

##### 🗄️ Drizzleスキーマ定義

```typescript
// infrastructure/persistence/drizzle/schema/user.ts

import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

/**
 * ユーザーテーブルのスキーマ定義
 * Cloudflare D1はSQLiteベースだよ
 */
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
})

export type UserTable = typeof users.$inferSelect
export type NewUserTable = typeof users.$inferInsert
```

##### 🔌 Drizzleクライアント

```typescript
// infrastructure/persistence/drizzle/client.ts

import { drizzle } from 'drizzle-orm/d1'
import type { DrizzleD1Database } from 'drizzle-orm/d1'
import * as schema from './schema/user'

let db: DrizzleD1Database<typeof schema> | null = null

/**
 * Drizzleクライアントを取得（シングルトン）
 */
export function getDb(d1: D1Database): DrizzleD1Database<typeof schema> {
  if (!db) {
    db = drizzle(d1, { schema })
  }
  return db
}
```

##### 🗄️ Drizzleリポジトリ実装

```typescript
// infrastructure/persistence/drizzle/userRepository.ts

import { eq } from 'drizzle-orm'
import { getDb } from './client'
import { users } from './schema/user'
import { reconstructUser } from '../../domain/factories/user'
import type { User } from '../../domain/models/user'

/**
 * ユーザーを保存するよ（作成または更新）
 */
export async function save(user: User, d1: D1Database): Promise<void> {
  const db = getDb(d1)

  const existing = await db.select().from(users).where(eq(users.id, user.id)).get()

  if (existing) {
    await db
      .update(users)
      .set({
        name: user.name,
        email: user.email,
        updatedAt: user.updatedAt,
      })
      .where(eq(users.id, user.id))
  } else {
    await db.insert(users).values({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    })
  }
}

/**
 * IDでユーザーを検索するよ
 */
export async function findById(id: string, d1: D1Database): Promise<User | null> {
  const db = getDb(d1)

  const userData = await db.select().from(users).where(eq(users.id, id)).get()

  if (!userData) return null

  return reconstructUser({
    id: userData.id,
    name: userData.name,
    email: userData.email,
    createdAt: userData.createdAt,
    updatedAt: userData.updatedAt,
  })
}

/**
 * メールアドレスでユーザーを検索するよ
 */
export async function findByEmail(email: string, d1: D1Database): Promise<User | null> {
  const db = getDb(d1)

  const userData = await db.select().from(users).where(eq(users.email, email)).get()

  if (!userData) return null

  return reconstructUser({
    id: userData.id,
    name: userData.name,
    email: userData.email,
    createdAt: userData.createdAt,
    updatedAt: userData.updatedAt,
  })
}

/**
 * ユーザーを削除するよ
 */
export async function deleteUser(id: string, d1: D1Database): Promise<void> {
  const db = getDb(d1)
  await db.delete(users).where(eq(users.id, id))
}
```

##### 🎁 DIコンテナ

```typescript
// infrastructure/di/container.ts

import type { UserRepository } from '../../domain/repositories/user'
import * as drizzleUserRepo from '../persistence/drizzle/userRepository'

/**
 * シンプルなDIコンテナ
 *
 * 複雑なDIライブラリは不要だよ！
 * ただのオブジェクトで依存性を管理できるんだ。
 *
 * Cloudflare WorkersではD1DatabaseはリクエストごとにBindingから取得するため、
 * ここではリポジトリ関数のみを提供するよ
 */

export const container = {
  /**
   * ユーザーリポジトリ
   *
   * 注意: Drizzleの関数はD1Databaseを引数に取るため、
   * 実際の使用時にはBindingからD1を渡す必要があるよ
   */
  get userRepository() {
    return {
      save: drizzleUserRepo.save,
      findById: drizzleUserRepo.findById,
      findByEmail: drizzleUserRepo.findByEmail,
      delete: drizzleUserRepo.deleteUser,
    }
  },
}

export type Container = typeof container
```

---

### 4. 🌐 プレゼンテーション層（Presentation Layer）

**役割**: HTTPリクエストの受付窓口！外の世界とのやり取りを担当するよ 📞

**責務**:

- 📥 HTTPリクエストの受付
- ✅ リクエストのバリデーション
- 🚀 ユースケースの呼び出し
- 📤 レスポンスの整形

**特徴**:

- **シンプルなハンドラー**: 直接的な関数でリクエストを処理するよ
- **DIコンテナ経由**: リポジトリはコンテナから取得するんだ

#### 📝 実装例

##### 🎯 ハンドラー関数

```typescript
// presentation/handlers/user.ts

import type { Context } from 'hono'
import { createUserUseCase } from '../application/usecases/user/createUser'
import { CreateUserRequestSchema } from '../application/dto/user'
import type { UserRepository } from '../domain/repositories/user'

/**
 * ユーザー作成ハンドラーだよ
 */
export async function handleCreateUser(c: Context, userRepository: UserRepository) {
  try {
    const body = await c.req.json()

    // リクエストバリデーション
    const request = CreateUserRequestSchema.parse(body)

    // ユースケース実行
    const user = await createUserUseCase(request, userRepository)

    return c.json(user, 201)
  } catch (error) {
    if (error instanceof Error) {
      return c.json({ error: error.message }, 400)
    }
    return c.json({ error: 'Internal server error' }, 500)
  }
}
```

##### 🛣️ ルーティング

```typescript
// presentation/routes/user.ts

import { Hono } from 'hono'
import { container } from '../infrastructure/di/container'
import { handleCreateUser } from './handlers/user'

export const userRoutes = new Hono()

// DIコンテナから依存性を取得
const { userRepository } = container

// ルーティング
userRoutes.post('/users', (c) => handleCreateUser(c, userRepository))
```

##### 🎪 メインルーター

```typescript
// presentation/routes/index.ts

import { Hono } from 'hono'
import { userRoutes } from './user'
import { errorHandler } from '../middlewares/errorHandler'

export function createApp() {
  const app = new Hono()

  // グローバルミドルウェア
  app.use('*', errorHandler)

  // ヘルスチェック
  app.get('/health', (c) => c.json({ status: 'ok' }))

  // APIルーティング
  app.route('/api', userRoutes)

  return app
}
```

##### ⚠️ ミドルウェア - エラーハンドリング

```typescript
// presentation/middlewares/errorHandler.ts

import type { Context, Next } from 'hono'
import { ZodError } from 'zod'

export async function errorHandler(c: Context, next: Next) {
  try {
    await next()
  } catch (error) {
    console.error('Error:', error)

    // Zodエラーの処理
    if (error instanceof ZodError) {
      return c.json(
        {
          error: 'Validation error',
          details: error.errors,
          timestamp: new Date().toISOString(),
        },
        400
      )
    }

    // 一般的なエラー
    if (error instanceof Error) {
      return c.json(
        {
          error: error.message,
          timestamp: new Date().toISOString(),
        },
        500
      )
    }

    return c.json(
      {
        error: 'Internal server error',
        timestamp: new Date().toISOString(),
      },
      500
    )
  }
}
```

---

## 🎁 DIコンテナ（依存性注入）

### 💡 DIコンテナとは

DIコンテナは、アプリケーション全体の**依存性を一元管理**するオブジェクトだよ！このプロジェクトでは、複雑なDIライブラリではなく、**シンプルなオブジェクト**で実装するんだ。

### 🤔 なぜDIコンテナが必要か

#### 1. **📦 依存関係の一元管理**

DIコンテナがない場合、各ルーティングファイルで毎回インポートが必要になっちゃうよ：

```typescript
// DIコンテナなし - コードの重複
// routes/user.ts
import * as drizzleUserRepo from '../infrastructure/persistence/drizzle/userRepository'
const userRepository = drizzleUserRepo

// routes/post.ts
import * as drizzleUserRepo from '../infrastructure/persistence/drizzle/userRepository' // 重複
import * as drizzlePostRepo from '../infrastructure/persistence/drizzle/postRepository'
const userRepository = drizzleUserRepo // 重複
const postRepository = drizzlePostRepo
```

DIコンテナがあれば、1箇所で管理できちゃう！：

```typescript
// DIコンテナあり - 一元管理
import { container } from '../../infrastructure/di/container'
const { userRepository } = container
```

#### 2. **🔒 依存性の一貫性**

Drizzleクライアントは、D1Databaseインスタンスから生成されるよ。DIコンテナでリポジトリ関数を一元管理しよう：

```typescript
export const container = {
  get userRepository() {
    return {
      save: drizzleUserRepo.save,
      findById: drizzleUserRepo.findById,
      findByEmail: drizzleUserRepo.findByEmail,
      delete: drizzleUserRepo.deleteUser,
    }
  },
}
```

#### 3. **🔄 実装の切り替え**

環境に応じて、異なるリポジトリ実装を使用できるよ：

```typescript
export const container = {
  get userRepository(): UserRepository {
    return {
      save: drizzleUserRepo.save,
      findById: drizzleUserRepo.findById,
      findByEmail: drizzleUserRepo.findByEmail,
      delete: drizzleUserRepo.deleteUser,
    }
  },
}
```

---

### 📊 いつDIコンテナを使うべきか

| プロジェクト規模                         | DIコンテナ | 理由                     |
| ---------------------------------------- | ---------- | ------------------------ |
| **小規模**<br>（エンドポイント ~10個）   | 不要       | 直接インポートで十分だよ |
| **中規模**<br>（エンドポイント 10-30個） | **推奨**   | 管理が楽になるよ         |
| **大規模**<br>（エンドポイント 30個~）   | **必須**   | DIライブラリも検討しよう |

---

### 🎨 DIコンテナの実装パターン

#### シンプルなオブジェクト（推奨）✨

```typescript
// infrastructure/di/container.ts

import * as drizzleUserRepo from './persistence/drizzle/userRepository'

export const container = {
  get userRepository() {
    return {
      save: drizzleUserRepo.save,
      findById: drizzleUserRepo.findById,
      findByEmail: drizzleUserRepo.findByEmail,
      delete: drizzleUserRepo.deleteUser,
    }
  },
}
```

---

### 📖 DIコンテナの使い方

#### 🛣️ ルーティングで使用

```typescript
// presentation/routes/user.ts

import { container } from '../infrastructure/di/container'
import { handleCreateUser } from './handlers/user'

export const userRoutes = new Hono()

// コンテナから依存性を取得
const { userRepository } = container

userRoutes.post('/users', (c) => handleCreateUser(c, userRepository))
```

#### 🎯 ハンドラーで使用

```typescript
// presentation/handlers/user.ts

export async function handleCreateUser(
  c: Context,
  userRepository: UserRepository // 型定義に依存
) {
  const request = CreateUserRequestSchema.parse(await c.req.json())
  const user = await createUserUseCase(request, userRepository)
  return c.json(user, 201)
}
```

---

### 🤷 DIコンテナなしの代替案

小規模プロジェクトでは、DIコンテナなしでも問題ないよ：

```typescript
// presentation/routes/user.ts

import * as drizzleUserRepo from '../infrastructure/persistence/drizzle/userRepository'

const userRepository = {
  save: drizzleUserRepo.save,
  findById: drizzleUserRepo.findById,
  findByEmail: drizzleUserRepo.findByEmail,
  delete: drizzleUserRepo.deleteUser,
}

userRoutes.post('/users', (c) => handleCreateUser(c, userRepository))
```

**いいところ** ✨:

- シンプルだよ
- ファイル数が少なくて済むよ

**注意点** ⚠️:

- コードの重複が発生しちゃう

---

## 📋 Repository型定義の使用方法

Repository型定義は**契約（Contract）**として機能するよ！実装に依存せず、型だけに依存することで、柔軟で保守性の高いコードを実現できるんだ。

### 1. 🎯 ユースケースで型を指定

```typescript
// application/usecases/user/createUser.ts

import type { UserRepository } from '../../domain/repositories/user'

// 引数の型として UserRepository を指定
export async function createUserUseCase(
  request: CreateUserRequest,
  repository: UserRepository // ← どの実装でも受け入れ可能
): Promise<UserDto> {
  // repository.save, repository.findById などが使える
  // 具体的な実装は知らなくて良い
}
```

**いいところ** ✨:

- ユースケースは実装の詳細を知らなくていい（疎結合）
- Drizzle、MongoDB など、どの実装でも動くよ

---

### 2. ✅ 型チェック（実装側）

実装が型定義を満たしているか確認できるよ：

```typescript
// infrastructure/persistence/drizzle/userRepository.ts

import type { UserRepository } from '../../domain/repositories/user';

export async function save(user: User, d1: D1Database): Promise<void> { ... }
export async function findById(id: string, d1: D1Database): Promise<User | null> { ... }
export async function findByEmail(email: string, d1: D1Database): Promise<User | null> { ... }
export async function deleteUser(id: string, d1: D1Database): Promise<void> { ... }

// 型チェック用（ビルド時にエラーが出る）
// 注意: Drizzleの実装はD1Databaseを追加で受け取るため、
// 実際の使用時には引数を調整する必要があるよ
const _typeCheck: UserRepository = {
  save,
  findById,
  findByEmail,
  delete: deleteUser,  // 関数名が違っても OK
};
```

**いいところ** ✨:

- コンパイル時に型の不一致を検出できるよ
- リファクタリング時の安全性が上がるよ

---

## 🔗 依存関係のルール

DDDアーキテクチャの依存関係はこんな感じだよ：

```
Presentation → Application → Domain ← Infrastructure
                               ↑
                        (型定義のみ依存)
```

### 💡 大事な約束ごと

1. **🔒 ドメイン層は他の層に依存しない**
   - ドメイン層は純粋なTypeScriptの関数と型だけだよ
   - リポジトリは型定義だけ（実装はインフラ層で）
   - Zodは許容するよ（バリデーションはドメイン知識だからね）

2. **🔄 依存性の逆転（Dependency Inversion）**
   - ドメイン層: リポジトリの型定義（Contract）
   - インフラ層: リポジトリの実装（関数群）
   - アプリケーション層: 型定義に依存、実装は注入されるよ

3. **✨ シンプルなDI**
   - 小規模: 直接インポートでOK
   - 中規模: シンプルなコンテナオブジェクト
   - 大規模: DIライブラリも検討しよう

---

## 🔧 Drizzle設定ファイル

### 📄 drizzle.config.ts

プロジェクトルート（`backend/`）に配置するDrizzle設定ファイルだよ：

```typescript
// drizzle.config.ts

import type { Config } from 'drizzle-kit'

export default {
  schema: './infrastructure/persistence/drizzle/schema/*.ts',
  out: './infrastructure/persistence/drizzle/migrations',
  driver: 'd1',
  dbCredentials: {
    wranglerConfigPath: './wrangler.toml',
    dbName: 'your-d1-database-name',
  },
} satisfies Config
```

### 🚀 マイグレーションコマンド

```bash
# スキーマからマイグレーションファイルを生成
npx drizzle-kit generate:sqlite

# ローカルD1にマイグレーション適用
npx wrangler d1 migrations apply your-d1-database-name --local

# 本番D1にマイグレーション適用
npx wrangler d1 migrations apply your-d1-database-name --remote
```

### 📌 重要な注意点

- **Cloudflare D1はSQLiteベース**: Drizzleでは`sqlite`モードを使用するよ
- **ローカル開発**: `wrangler dev`でローカルD1環境が立ち上がるよ
- **Binding**: Cloudflare WorkersではD1DatabaseはBindingとして注入されるよ
- **リクエストごと**: D1Databaseはリクエストごとに`env.DB`などから取得するよ

### 🌐 Cloudflare Workersでの使用例

```typescript
// Honoアプリでの使用例
import { Hono } from 'hono'
import type { D1Database } from '@cloudflare/workers-types'

type Bindings = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

app.post('/users', async (c) => {
  const d1 = c.env.DB // Bindingから取得
  const request = CreateUserRequestSchema.parse(await c.req.json())

  // D1Databaseをリポジトリ関数に渡す
  const user = await createUserUseCase(request, {
    save: (user) => drizzleUserRepo.save(user, d1),
    findById: (id) => drizzleUserRepo.findById(id, d1),
    findByEmail: (email) => drizzleUserRepo.findByEmail(email, d1),
    delete: (id) => drizzleUserRepo.deleteUser(id, d1),
  })

  return c.json(user, 201)
})
```

---

## 🎉 まとめ

このアーキテクチャは、**DDDの原則**と**シンプルな関数型スタイル**を組み合わせることで、保守性が高いコードを実現できるよ！✨

### 💎 主な特徴

✅ **シンプル**: クラス不要、普通のTypeScriptで書けるよ！  
✅ **実用的**: Zodで型安全、Repository型定義で柔軟な実装切り替えができるよ  
✅ **保守性**: 4層アーキテクチャで関心事をきれいに分離できるんだ  
✅ **エッジ対応**: Cloudflare D1でエッジコンピューティングに最適化されているよ

この手順に従えば、保守しやすいコードが書けるよ！
頑張ってね！ 💪✨

## 📚 参考資料

- [TypeScript × ドメイン駆動設計ハンズオン](https://zenn.dev/yamachan0625/books/ddd-hands-on)
- [Zod Documentation](https://zod.dev/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Cloudflare D1 Documentation](https://developers.cloudflare.com/d1/)
- エリック・エヴァンスのドメイン駆動設計（DDD本）
