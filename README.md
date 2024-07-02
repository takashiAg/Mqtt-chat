# shanai-sns

SNS的な感じ

## 構成図

```mermaid
graph TD
    A[frontend] -->|request| B[auth]
    B --> A
    A -->|request| C[api]
    C -->|response| A
    B -->|request| C
    C -->|response| B
```

## ポート

ローカルで開発する時用のデフォルトのポートとか

| name     | port | description      |
| -------- | :--- | ---------------- |
| frontend | 3000 | フロントエンド   |
| api      | 3001 | 通常のAPI        |
| auth     | 3002 | 認証用のサーバー |
