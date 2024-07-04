# mqtt でいい感じに pubsub してリアルタイムにチャットするやつ

![動画](./docs/preview.gif)

## 構成図

```mermaid
graph TD
    FE[frontend] <--> Auth[auth]
    FE <--> API[api]
    pubsub[pubsub] --> FE
    API --> pubsub
    Auth <-->|jwt| API
```

## ポート

ローカルで開発する時用のデフォルトのポートとか

| name     | port  | description      |
| -------- | :---- | ---------------- |
| frontend | 3000  | フロントエンド   |
| api      | 3001  | 通常の API       |
| auth     | 3002  | 認証用のサーバー |
| pubsub   | 1883  | pubsub           |
| pubsub   | 15675 | pubsub (ws)      |
