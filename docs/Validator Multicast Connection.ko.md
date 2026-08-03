# 검증자 멀티캐스트 연결
!!! warning "This translation was generated using artificial intelligence and has not been reviewed by a human translator. It may contain inaccuracies or errors and should not be relied upon."

!!! warning "DoubleZero에 연결함으로써 [DoubleZero 이용약관](https://doublezero.xyz/terms-protocol)에 동의합니다"

DoubleZero에 아직 연결되지 않은 경우 [설정](https://docs.malbeclabs.com/setup/) 및 [Mainnet-Beta](https://docs.malbeclabs.com/DZ%20Mainnet-beta%20Connection/) 검증자 연결 문서를 먼저 완료하세요.

거래 회사 및 기타 구독자: [엣지 구독자 연결](Edge%20Subscriber%20Connection.md).

이미 DoubleZero에 연결된 검증자라면 이 가이드를 계속 진행할 수 있습니다.

## 1. 클라이언트 구성

### Jito-Agave (v3.1.9+) 및 Harmonic (3.1.11+)

1. 검증자 시작 스크립트에 다음을 추가합니다：`--shred-receiver-address 233.84.178.1:7733`

    Jito와 `edge-solana-shreds` 그룹에 동시에 전송할 수 있습니다.

    예시：

    ```json
    #!/bin/bash
    export PATH="/home/sol/.local/share/solana/install/releases/v3.1.9-jito/bin:$PATH"
    BLOCK_ENGINE_URL=https://ny.mainnet.block-engine.jito.wtf
    RELAYER_URL=http://ny.mainnet.relayer.jito.wtf:8100
    SHRED_RECEIVER_ADDR=<JitoBlockEngineAddress>
    <...The rest of your config...>
    --shred-receiver-address 233.84.178.1:7733
    ```

2. 검증자를 재시작합니다.
3. 게시자로서 DoubleZero 멀티캐스트 그룹 `edge-solana-shreds`에 연결합니다：`doublezero connect ibrl && doublezero connect multicast --publish edge-solana-shreds`

### Frankendancer

1. `config.toml`에 다음을 추가합니다：

    ```toml
    [tiles.shred]
    additional_shred_destinations_leader = [ "233.84.178.1:7733", ]
    ```

2. 검증자를 재시작합니다.
3. 게시자로서 DoubleZero 멀티캐스트 그룹 `edge-solana-shreds`에 연결합니다：`doublezero connect ibrl && doublezero connect multicast --publish edge-solana-shreds`

## 2. 리더 슈레드 게시 확인

연결 후 [이 대시보드](https://data.malbeclabs.com/dz/publisher-check)에서 슈레드를 게시하고 있는지 확인할 수 있습니다. 최소 한 슬롯의 리더 슈레드를 게시한 후에야 확인이 표시됩니다.

## 3. 검증자 보상

검증자가 리더 슈레드를 게시하는 각 에포크에 대해, 구독에 따라 기여도에 비례하여 보상이 지급됩니다. 이 시스템의 세부 사항은 추후 발표 및 상세히 설명될 예정입니다.

## 문제 해결

### 리더 슈레드가 게시되지 않는 경우：

슈레드가 전송되지 않는 가장 일반적인 원인은 클라이언트 버전입니다：

Jito-Agave 3.1.9+, JitoBam 3.1.9+, Frankendancer 또는 Harmonic 3.1.11+를 실행해야 합니다. 다른 클라이언트 버전은 작동하지 않습니다.

### 재전송 중인 경우：

1. 슈레드 재전송의 일반적인 원인은 간단한 구성 문제입니다. 시작 스크립트에서 재전송 슈레드를 보내는 플래그가 활성화되어 있을 수 있습니다. 비활성화해야 합니다.

    Jito-Agave에서 제거해야 할 플래그는：`--shred-retransmit-receiver-address`입니다.

1. [게시자 대시보드](https://data.malbeclabs.com/dz/publisher-check)를 확인하여 재전송된 슈레드가 있는지 확인하세요. 테이블에서 **No Retransmit Shreds** 열을 확인하세요——빨간 X는 재전송 중임을 의미합니다.

    !!! note "에포크 뷰"
        게시자 대시보드에는 다른 시간 창이 있습니다. **2 에포크 뷰**에서 재전송이 보이지만 최근에 변경했다면 **최근 슬롯** 뷰로 전환해 보세요.

    ![게시자 확인 대시보드](images/publisher-check-dashboard.png)

2. 클라이언트 IP를 찾아 [DoubleZero 데이터](https://data.malbeclabs.com/dz/users)에서 사용자를 조회합니다.

    ![DoubleZero 데이터 사용자](images/doublezero-data-users.png)

3. **멀티캐스트**를 클릭하여 멀티캐스트 뷰를 엽니다.

    아래 스크린샷은：**재전송** (바람직하지 않음) 리더 슬롯 패턴 없는 안정적인 아웃바운드 트래픽을 보여줍니다.

    ![사용자 멀티캐스트 뷰 — 재전송 예시](images/user-multicast-view-retransmit.png)

    아래 스크린샷은：**정상** (리더 슈레드만 게시) 스파이크 형태의 아웃바운드 트래픽(톱니파 패턴)을 보여주며, 리더 슬롯과 일치합니다.

    ![사용자 멀티캐스트 뷰 — 정상 게시자 예시](images/user-multicast-view-healthy.png)

차트는 리더 슈레드만 보내고 있는지 보여줍니다. 트래픽 스파이크는 리더 슬롯이 있을 때와 일치해야 합니다. 리더 슬롯이 없을 때는 트래픽이 없어야 합니다. 재전송 중이라면 슬롯에 맞춘 스파이크 대신 안정적인 트래픽 흐름이 보일 것입니다.
