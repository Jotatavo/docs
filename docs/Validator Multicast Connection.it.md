# Connessione Multicast Validatore
!!! warning "This translation was generated using artificial intelligence and has not been reviewed by a human translator. It may contain inaccuracies or errors and should not be relied upon."

!!! warning "Connettendomi a DoubleZero accetto i [Termini di Servizio di DoubleZero](https://doublezero.xyz/terms-protocol)"

Se non sei ancora connesso a DoubleZero, completa prima la documentazione di [Configurazione](https://docs.malbeclabs.com/setup/) e di connessione validatore [Mainnet-Beta](https://docs.malbeclabs.com/DZ%20Mainnet-beta%20Connection/).

Società di trading e altri subscriber: [Connessione Edge Subscriber](Edge%20Subscriber%20Connection.md).

Se sei un validatore già connesso a DoubleZero, puoi continuare questa guida.

## 1. Configurazione del Client

### Jito-Agave (v3.1.9+) e Harmonic (3.1.11+)

1. Nel tuo script di avvio del validatore, aggiungi: `--shred-receiver-address 233.84.178.1:7733`

    Puoi inviare a Jito e al gruppo `edge-solana-shreds` contemporaneamente.

    Esempio:

    ```json
    #!/bin/bash
    export PATH="/home/sol/.local/share/solana/install/releases/v3.1.9-jito/bin:$PATH"
    BLOCK_ENGINE_URL=https://ny.mainnet.block-engine.jito.wtf
    RELAYER_URL=http://ny.mainnet.relayer.jito.wtf:8100
    SHRED_RECEIVER_ADDR=<JitoBlockEngineAddress>
    <...The rest of your config...>
    --shred-receiver-address 233.84.178.1:7733
    ```

2. Riavvia il tuo validatore.
3. Connettiti al gruppo multicast DoubleZero `edge-solana-shreds` come publisher: `doublezero connect ibrl && doublezero connect multicast --publish edge-solana-shreds`

### Frankendancer

1. In `config.toml`, aggiungi:

    ```toml
    [tiles.shred]
    additional_shred_destinations_leader = [ "233.84.178.1:7733", ]
    ```

2. Riavvia il tuo validatore.
3. Connettiti al gruppo multicast DoubleZero `edge-solana-shreds` come publisher: `doublezero connect ibrl && doublezero connect multicast --publish edge-solana-shreds`

## 2. Confermare la pubblicazione degli shred leader

Una volta connesso, puoi verificare [questa dashboard](https://data.malbeclabs.com/dz/publisher-check) per confermare che stai pubblicando shred. Non vedrai la conferma finché non avrai pubblicato shred leader per almeno uno slot.

## 3. Ricompense per i Validatori

Per ogni epoca in cui i validatori pubblicano shred leader, verranno ricompensati proporzionalmente per il loro contributo in base alle sottoscrizioni. I dettagli di questo sistema saranno annunciati e approfonditi in una data successiva.

## Risoluzione dei Problemi

### Mancata pubblicazione degli shred leader:

La causa più comune della mancata trasmissione degli shred è la versione del client:

Devi eseguire Jito-Agave 3.1.9+, JitoBam 3.1.9+, Frankendancer o Harmonic 3.1.11+. Le altre versioni del client non funzioneranno.

### Ritrasmissione:

1. Una causa comune di ritrasmissione degli shred è una semplice configurazione. Potresti avere il flag abilitato per inviare shred di ritrasmissione nel tuo script di avvio; dovrai disabilitarlo.

    Il flag da rimuovere in Jito-Agave è: `--shred-retransmit-receiver-address`.

1. Controlla la [dashboard dei publisher](https://data.malbeclabs.com/dz/publisher-check) e verifica se hai shred ritrasmessi. Nella tabella, guarda la colonna **No Retransmit Shreds**—una X rossa significa che stai ritrasmettendo.

    !!! note "Vista per epoca"
        Tieni presente che ci sono diverse finestre temporali per visualizzare la dashboard dei publisher. Se vedi la ritrasmissione nella **vista 2 epoche**, ma hai apportato una modifica recente, prova a passare alla vista **slot recente**.

    ![Dashboard di verifica publisher](images/publisher-check-dashboard.png)

2. Trova l'IP del tuo client e cerca il tuo utente in [DoubleZero Data](https://data.malbeclabs.com/dz/users).

    ![Utenti DoubleZero Data](images/doublezero-data-users.png)

3. Clicca su **Multicast** per aprire la tua vista multicast.

    Lo screenshot seguente mostra: **Ritrasmissione** (indesiderata) traffico in uscita costante senza pattern di slot leader.

    ![Vista multicast utente — esempio di ritrasmissione](images/user-multicast-view-retransmit.png)

    Lo screenshot seguente mostra: **Sano** (pubblicazione solo di shred leader) traffico in uscita a picchi, noto come pattern a dente di sega, che si allinea con i tuoi slot leader.

    ![Vista multicast utente — esempio di publisher sano](images/user-multicast-view-healthy.png)

Il grafico mostra se stai inviando solo shred leader. I picchi di traffico dovrebbero allinearsi con quando hai uno slot leader. Quando non hai uno slot leader non ci dovrebbe essere traffico. Se stai ritrasmettendo, vedrai un flusso costante di traffico invece di picchi allineati agli slot.
