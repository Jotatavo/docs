# バリデーターマルチキャスト接続
!!! warning "This translation was generated using artificial intelligence and has not been reviewed by a human translator. It may contain inaccuracies or errors and should not be relied upon."

!!! warning "DoubleZeroに接続することで、[DoubleZero利用規約](https://doublezero.xyz/terms-protocol)に同意します"

DoubleZeroにまだ接続していない場合は、[セットアップ](https://docs.malbeclabs.com/setup/)と[Mainnet-Beta](https://docs.malbeclabs.com/DZ%20Mainnet-beta%20Connection/)バリデーター接続ドキュメントを完了してください。

トレーディングファームおよびその他のサブスクライバー：[エッジサブスクライバー接続](Edge%20Subscriber%20Connection.md)。

DoubleZeroにすでに接続しているバリデーターの方は、このガイドを続けてください。

## 1. クライアント設定

### Jito-Agave（v3.1.9+）および Harmonic（3.1.11+）

1. バリデーターの起動スクリプトに以下を追加します：`--shred-receiver-address 233.84.178.1:7733`

    JitoとDoubleZeroの`edge-solana-shreds`グループに同時に送信できます。

    例：

    ```json
    #!/bin/bash
    export PATH="/home/sol/.local/share/solana/install/releases/v3.1.9-jito/bin:$PATH"
    BLOCK_ENGINE_URL=https://ny.mainnet.block-engine.jito.wtf
    RELAYER_URL=http://ny.mainnet.relayer.jito.wtf:8100
    SHRED_RECEIVER_ADDR=<JitoBlockEngineAddress>
    <...The rest of your config...>
    --shred-receiver-address 233.84.178.1:7733
    ```

2. バリデーターを再起動します。
3. パブリッシャーとしてDoubleZeroマルチキャストグループ`edge-solana-shreds`に接続します：`doublezero connect ibrl && doublezero connect multicast --publish edge-solana-shreds`

### Frankendancer

1. `config.toml`に以下を追加します：

    ```toml
    [tiles.shred]
    additional_shred_destinations_leader = [ "233.84.178.1:7733", ]
    ```

2. バリデーターを再起動します。
3. パブリッシャーとしてDoubleZeroマルチキャストグループ`edge-solana-shreds`に接続します：`doublezero connect ibrl && doublezero connect multicast --publish edge-solana-shreds`

## 2. リーダーシュレッドの発行確認

接続後、[このダッシュボード](https://data.malbeclabs.com/dz/publisher-check)でシュレッドを発行していることを確認できます。少なくとも1スロット分のリーダーシュレッドを発行した後でないと確認は表示されません。

## 3. バリデーター報酬

バリデーターがリーダーシュレッドを発行した各エポックにおいて、サブスクリプションに基づいた貢献度に応じて比例的に報酬が付与されます。このシステムの詳細は後日発表・詳述される予定です。

## トラブルシューティング

### リーダーシュレッドが発行されない場合：

シュレッドが送信されない最も一般的な原因はクライアントのバージョンです：

Jito-Agave 3.1.9+、JitoBam 3.1.9+、Frankendancer、またはHarmonic 3.1.11+を実行している必要があります。他のクライアントバージョンは動作しません。

### 再送信している場合：

1. シュレッドの再送信の一般的な原因は設定の問題です。起動スクリプトで再送信シュレッドを送信するフラグが有効になっている場合は、無効にする必要があります。

    Jito-Agaveで削除するフラグは：`--shred-retransmit-receiver-address`です。

1. [パブリッシャーダッシュボード](https://data.malbeclabs.com/dz/publisher-check)を確認し、再送信シュレッドがあるかどうかを確認します。表の**No Retransmit Shreds**列を確認してください——赤いXは再送信していることを意味します。

    !!! note "エポックビュー"
        パブリッシャーダッシュボードには異なる時間ウィンドウがあります。**2エポックビュー**で再送信が見られるが最近変更を加えた場合は、**最近のスロット**ビューに切り替えてみてください。

    ![パブリッシャーチェックダッシュボード](images/publisher-check-dashboard.png)

2. クライアントIPを見つけ、[DoubleZeroデータ](https://data.malbeclabs.com/dz/users)でユーザーを検索します。

    ![DoubleZeroデータユーザー](images/doublezero-data-users.png)

3. **マルチキャスト**をクリックしてマルチキャストビューを開きます。

    以下のスクリーンショットは：**再送信**（望ましくない）リーダースロットパターンのない安定した送信トラフィックを示しています。

    ![ユーザーマルチキャストビュー — 再送信の例](images/user-multicast-view-retransmit.png)

    以下のスクリーンショットは：**正常**（リーダーシュレッドのみを発行）スパイク状の送信トラフィック（鋸歯状波パターン）を示しており、リーダースロットと一致しています。

    ![ユーザーマルチキャストビュー — 正常なパブリッシャーの例](images/user-multicast-view-healthy.png)

チャートはリーダーシュレッドのみを送信しているかどうかを示します。トラフィックのスパイクはリーダースロットがある時と一致するはずです。リーダースロットがない場合はトラフィックがないはずです。再送信している場合は、スロットに合わせたスパイクではなく、安定したトラフィックの流れが見えます。
