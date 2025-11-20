# 🚀 新規ドメインからAPI作成ガイド

## 📖 このガイドについて

DDD × 関数型プログラミングの4層アーキテクチャで、新しい機能（例：投稿機能）を作る手順をわかりやすく説明するよ！
ゼロからAPIエンドポイントを作れるようになります ✨

---

## 🎒 準備するもの

### 使う技術たち

- 🔷 **TypeScript** - 型安全な開発
- ✅ **Zod** - データのバリデーション
- ⚡ **Hono** - 軽くて速いWebフレームワーク
- 🗄️ **Prisma** - データベースとの橋渡し（or インメモリ実装）

### 📦 4層の関係を理解しよう

```
Presentation → Application → Domain ← Infrastructure
                               ↑
                        (型定義だけに依存)
```

**大事な約束ごと** 💡:
- ドメイン層は他の層に依存しない（ピュアに保つ！）
- リポジトリは「型定義」だけ、実際の動きはインフラ層が担当
- 各層の役割をしっかり分ける

---

## 🎯 作る順番（4層を積み上げていこう！）

```
1. 🏛️ ドメイン層（Domain）- ビジネスロジックの土台
   ↓
2. 📝 アプリケーション層（Application）- 業務フローを整理
   ↓
3. 🔌 インフラストラクチャ層（Infrastructure）- 外部との接続
   ↓
4. 🌐 プレゼンテーション層（Presentation）- APIの窓口
```

---

## 🏛️ ステップ1: ドメイン層

**役割**: ビジネスロジックの心臓部！他の層には一切頼らないよ 💪

### 作るファイルたち

#### 1-1. 📋 モデル定義
- **ファイル**: `src/domain/models/{domain}/{domain}.ts`
- **何を書く？**: Zodスキーマでデータの形とルールを定義
- **ここがポイント！**: バリデーションやビジネスルールをここで表現するよ

#### 1-2. 🏭 ファクトリ関数
- **ファイル**: `src/domain/factories/{domain}/{domain}Factory.ts`
- **何を書く？**: 
  - `create{Domain}()` - ✨ 新しく作る
  - `reconstruct{Domain}()` - 🔄 DBから取ったデータを組み立て直す
  - `update{Domain}Xxx()` - 📝 更新する（元のデータは変えないよ！）
- **ここがポイント！**: いつも新しいオブジェクトを返す（イミュータブル = 安全！）

#### 1-3. 📜 リポジトリ型定義
- **ファイル**: `src/domain/repositories/{domain}Repository.ts`
- **何を書く？**: データベース操作の「お約束」だけ（実装はまだ書かない）
- **メソッド例**: `save`, `findById`, `findAll`, `delete`
- **ここがポイント！**: 「こういう関数があるよ」って約束するだけ！

#### 1-4. 🤝 ドメインサービス（必要な時だけ）
- **ファイル**: `src/domain/services/{domain}DomainService.ts`
- **何を書く？**: 1つのエンティティに収まらないビジネスロジック
- **ここがポイント！**: 複数のデータをまたぐ処理はここに書くよ

---

## 📝 ステップ2: アプリケーション層

**役割**: 業務の流れを指揮する司令塔！ドメイン層の機能を組み合わせるよ 🎵

### 作るファイルたち

#### 2-1. 💌 DTO定義
- **ファイル**: `src/application/dto/{domain}Dto.ts`
- **何を書く？**:
  - レスポンスDTO: `{Domain}Dto` - 📤 返す時の形
  - リクエストDTO: `Create{Domain}Request`, `Update{Domain}Request` - 📥 受け取る時の形
- **ここがポイント！**: APIとドメインの間の通訳さん！

#### 2-2. ✨ ユースケース: 作成
- **ファイル**: `src/application/usecases/{domain}/create{Domain}.ts`
- **やることリスト**:
  1. ドメインオブジェクトを生成 🎨
  2. ビジネスルールをチェック ✅
  3. リポジトリで保存 💾
  4. DTOにして返す 📦

#### 2-3. 🔍 ユースケース: 取得
- **ファイル**: `src/application/usecases/{domain}/get{Domain}.ts`
- **何を書く？**: 
  - 単体取得: `get{Domain}UseCase()` - 1つだけ取る
  - 一覧取得: `getAll{Domain}sUseCase()` - 全部取る
  - 条件付き取得: `get{Domain}sByXxxUseCase()` - 条件を指定して取る

#### 2-4. ✏️ ユースケース: 更新
- **ファイル**: `src/application/usecases/{domain}/update{Domain}.ts`
- **やることリスト**:
  1. 今のデータを取得 📖
  2. 権限があるかチェック 🔐
  3. ファクトリ関数で更新（元のデータは変えない！） ✨
  4. リポジトリで保存 💾

#### 2-5. 🗑️ ユースケース: 削除
- **ファイル**: `src/application/usecases/{domain}/delete{Domain}.ts`
- **やることリスト**:
  1. 今のデータを取得 📖
  2. 権限があるかチェック 🔐
  3. リポジトリで削除 🗑️

---

## 🔌 ステップ3: インフラストラクチャ層

**役割**: データベースなど、外の世界とつながる架け橋！ 🌉

### 作るファイルたち

#### 3-1. 💭 インメモリリポジトリ実装（テスト用）
- **ファイル**: `src/infrastructure/persistence/inmemory/inMemory{Domain}Repository.ts`
- **何を書く？**: リポジトリの「お約束」を実際に動く形に！
- **実装方法**: Mapを使ってメモリにデータを保存（軽くて速い！）
- **メソッド**: `save`, `findById`, `findAll`, `delete` など
- **ここがポイント！**: テストや開発で使える軽量版だよ 🚀

#### 3-2. 🗄️ Prismaリポジトリ実装（本番用）
- **ファイル**: `src/infrastructure/persistence/prisma/prisma{Domain}Repository.ts`
- **何を書く？**: Prismaでデータベースとやり取りする実装
- **メソッド**: `save`, `findById`, `findAll`, `delete` など
- **ここがポイント！**: 
  - `upsert`で作成も更新もおまかせ！ 🔄
  - `reconstruct{Domain}()`でドメインオブジェクトに変身させる ✨
  - 型チェックで「お約束」通りか確認 ✅

#### 3-3. 🎁 DIコンテナに追加
- **ファイル**: `src/infrastructure/di/container.ts`
- **何を書く？**: 新しく作ったリポジトリを登録
- **実装例**:
```typescript
get postRepository(): PostRepository {
  // isTestは `process.env.NODE_ENV === 'test'` で定義されていると仮定します
  if (isTest) {
    // inMemoryPostRepoはインポートされていると仮定します
    return {
      save: inMemoryPostRepo.save,
      findById: inMemoryPostRepo.findById,
      findAll: inMemoryPostRepo.findAll,
      delete: inMemoryPostRepo.delete,
    };
  }
  // prismaPostRepoはインポートされていると仮定します
  return {
    save: prismaPostRepo.save,
    findById: prismaPostRepo.findById,
    findAll: prismaPostRepo.findAll,
    delete: prismaPostRepo.delete,
  };
}
```
- **ここがポイント！**: 環境に応じて自動で切り替わる賢い子 🧠

---

## 🌐 ステップ4: プレゼンテーション層

**役割**: HTTPリクエストの受付窓口！外の世界とのやり取りを担当するよ 📞

### 作るファイルたち

#### 4-1. 🎯 ハンドラー関数
- **ファイル**: `src/presentation/handlers/{domain}Handlers.ts`
- **何を書く？**: 各エンドポイントで何をするか
- **作る関数たち**:
  - `handleCreate{Domain}` - ✨ 作成
  - `handleGet{Domain}` - 🔍 1つ取得
  - `handleGetAll{Domain}s` - 📋 一覧取得
  - `handleUpdate{Domain}` - ✏️ 更新
  - `handleDelete{Domain}` - 🗑️ 削除
- **やることリスト**:
  1. リクエストのデータを受け取る 📥
  2. Zodスキーマでチェック ✅
  3. ユースケースにお願いする 🤝
  4. レスポンスを返す 📤
  5. エラーが出たら優しく教える 💕

#### 4-2. 🛣️ ルーティング定義
- **ファイル**: `src/presentation/routes/{domain}.ts`
- **何を書く？**: URLとハンドラーを紐付ける道案内
- **やること**:
  - DIコンテナからリポジトリをもらう 🎁
  - エンドポイントとハンドラーをつなぐ 🔗
- **エンドポイント例**:
  - `POST /{domains}` - ✨ 作成
  - `GET /{domains}/:id` - 🔍 1つ取得
  - `GET /{domains}` - 📋 一覧取得
  - `PUT /{domains}/:id` - ✏️ 更新
  - `DELETE /{domains}/:id` - 🗑️ 削除

#### 4-3. 🚪 メインルーターへマウント
- **ファイル**: `src/presentation/routes/index.ts`
- **何を書く？**: 新しいルートをメインに追加
- **実装**: `app.route('/api', {domain}Routes);` を1行追加するだけ！


---

## ✅ チェックリスト

新しいドメインを作る時は、これをチェックしていこう！

### 🏛️ ドメイン層
- [ ] 📋 モデル定義（Zodスキーマ）
- [ ] 🏭 ファクトリ関数（create, reconstruct, update）
- [ ] 📜 リポジトリ型定義（インターフェース）
- [ ] 🤝 ドメインサービス（必要な時だけ）

### 📝 アプリケーション層
- [ ] 💌 DTO定義（リクエスト・レスポンス）
- [ ] ✨ ユースケース: 作成
- [ ] 🔍 ユースケース: 取得（1つ・一覧）
- [ ] ✏️ ユースケース: 更新
- [ ] 🗑️ ユースケース: 削除

### 🔌 インフラストラクチャ層
- [ ] 💭 インメモリリポジトリ実装
- [ ] 🗄️ Prismaリポジトリ実装（本番用）
- [ ] 🎁 DIコンテナへの登録

### 🌐 プレゼンテーション層
- [ ] 🎯 ハンドラー関数（CRUD操作）
- [ ] 🛣️ ルーティング定義
- [ ] 🚪 メインルーターへのマウント

### 🎉 動作確認
- [ ] サーバー起動確認
- [ ] API動作確認（curl or Postman）

---

## 🆘 困った時は

### Zodバリデーションエラーが出る
- スキーマ定義を見直してみよう 👀
- `error.errors`で詳しい情報を確認できるよ

### DIコンテナでリポジトリが見つからない
- `container.ts`にちゃんと追加したかチェック！ 🔍

### ルーティングが動かない
- メインルーター（`routes/index.ts`）にマウントしたか確認してね 📝

---

## 🌟 まとめ

**大事なポイント**:

1. 🏛️ **ドメイン層から始めよう** - ビジネスロジックが土台だよ
2. 🔄 **型定義で依存性を逆転** - リポジトリは「お約束」だけ、実装は後で
3. ✨ **シンプルな関数で実装** - クラスは使わない、データは変えない（イミュータブル）
4. 📚 **4層の順序を守る** - Domain → Application → Infrastructure → Presentation

この手順に従えば、保守しやすくてテストもしやすいコードが書けるよ！
頑張ってね！ 💪✨

