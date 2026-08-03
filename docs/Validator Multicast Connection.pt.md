# Conexão Multicast para Validadores
!!! warning "This translation was generated using artificial intelligence and has not been reviewed by a human translator. It may contain inaccuracies or errors and should not be relied upon."

!!! warning "Ao me conectar ao DoubleZero, concordo com os [Termos de Serviço do DoubleZero](https://doublezero.xyz/terms-protocol)"

Se você ainda não está conectado ao DoubleZero, complete a documentação de [Configuração](https://docs.malbeclabs.com/setup/) e de conexão de validador [Mainnet-Beta](https://docs.malbeclabs.com/DZ%20Mainnet-beta%20Connection/).

Empresas de trading e outros assinantes: [Conexão do Assinante de Borda](Edge%20Subscriber%20Connection.md).

Se você é um validador já conectado ao DoubleZero, pode continuar este guia.

## 1. Configuração do Cliente

### Jito-Agave (v3.1.9+) e Harmonic (3.1.11+)

1. No seu script de inicialização do validador, adicione: `--shred-receiver-address 233.84.178.1:7733`

    Você pode enviar para o Jito e para o grupo `edge-solana-shreds` ao mesmo tempo.

    Exemplo:

    ```json
    #!/bin/bash
    export PATH="/home/sol/.local/share/solana/install/releases/v3.1.9-jito/bin:$PATH"
    BLOCK_ENGINE_URL=https://ny.mainnet.block-engine.jito.wtf
    RELAYER_URL=http://ny.mainnet.relayer.jito.wtf:8100
    SHRED_RECEIVER_ADDR=<JitoBlockEngineAddress>
    <...The rest of your config...>
    --shred-receiver-address 233.84.178.1:7733
    ```

2. Reinicie seu validador.
3. Conecte-se ao grupo multicast do DoubleZero `edge-solana-shreds` como publicador: `doublezero connect ibrl && doublezero connect multicast --publish edge-solana-shreds`

### Frankendancer

1. Em `config.toml`, adicione:

    ```toml
    [tiles.shred]
    additional_shred_destinations_leader = [ "233.84.178.1:7733", ]
    ```

2. Reinicie seu validador.
3. Conecte-se ao grupo multicast do DoubleZero `edge-solana-shreds` como publicador: `doublezero connect ibrl && doublezero connect multicast --publish edge-solana-shreds`

## 2. Confirmar que está publicando shreds de líder

Após a conexão, você pode verificar [este painel](https://data.malbeclabs.com/dz/publisher-check) para confirmar que está publicando shreds. Você não verá a confirmação até ter publicado shreds de líder para pelo menos um slot.

## 3. Recompensas para Validadores

Para cada época em que os validadores publicam shreds de líder, eles serão recompensados proporcionalmente pela sua contribuição com base nas assinaturas. Os detalhes deste sistema serão anunciados e detalhados em uma data posterior.

## Solução de Problemas

### Não está publicando shreds de líder:

A causa mais comum de não transmitir shreds é a versão do cliente:

Você deve estar executando Jito-Agave 3.1.9+, JitoBam 3.1.9+, Frankendancer ou Harmonic 3.1.11+. Outras versões de cliente não funcionarão.

### Retransmissão:

1. Uma causa comum de retransmissão de shreds é uma configuração simples. Você pode ter o flag habilitado para enviar shreds de retransmissão no seu script de inicialização; você precisará desabilitá-lo.

    O flag a remover no Jito-Agave é: `--shred-retransmit-receiver-address`.

1. Verifique o [painel de publicadores](https://data.malbeclabs.com/dz/publisher-check) e veja se há shreds retransmitidos. Na tabela, observe a coluna **No Retransmit Shreds**—um X vermelho significa que você está retransmitindo.

    !!! note "Visão por época"
        Observe que há diferentes janelas de tempo para visualizar o painel de publicadores. Se você vê retransmissão na **visão de 2 épocas**, mas fez uma alteração recente, tente mudar para a visão de **slot recente**.

    ![Painel de verificação de publicadores](images/publisher-check-dashboard.png)

2. Encontre o IP do seu cliente e procure seu usuário em [DoubleZero Data](https://data.malbeclabs.com/dz/users).

    ![Usuários do DoubleZero Data](images/doublezero-data-users.png)

3. Clique em **Multicast** para abrir sua visão multicast.

    A captura de tela abaixo mostra: **Retransmitindo** (indesejável) tráfego de saída constante sem padrão de slot de líder.

    ![Visão multicast do usuário — exemplo de retransmissão](images/user-multicast-view-retransmit.png)

    A captura de tela abaixo mostra: **Saudável** (publicando apenas shreds de líder) tráfego de saída em picos, conhecido como padrão de dente de serra, que se alinha com seus slots de líder.

    ![Visão multicast do usuário — exemplo de publicador saudável](images/user-multicast-view-healthy.png)

O gráfico mostra se você está enviando apenas shreds de líder. Os picos de tráfego devem se alinhar com quando você tem um slot de líder. Quando não há slot de líder, não deve haver tráfego. Se você estiver retransmitindo, verá um fluxo constante de tráfego em vez de picos alinhados com slots.
