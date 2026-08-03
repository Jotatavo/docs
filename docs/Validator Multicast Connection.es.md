# Conexión Multicast para Validadores
!!! warning "This translation was generated using artificial intelligence and has not been reviewed by a human translator. It may contain inaccuracies or errors and should not be relied upon."

!!! warning "Al conectarme a DoubleZero acepto los [Términos de Servicio de DoubleZero](https://doublezero.xyz/terms-protocol)"

Si aún no está conectado a DoubleZero, complete la documentación de [Configuración](https://docs.malbeclabs.com/setup/) y de conexión de validador [Mainnet-Beta](https://docs.malbeclabs.com/DZ%20Mainnet-beta%20Connection/).

Empresas de trading y otros suscriptores: [Conexión de Suscriptor Edge](Edge%20Subscriber%20Connection.md).

Si es un validador ya conectado a DoubleZero, puede continuar con esta guía.

## 1. Configuración del Cliente

### Jito-Agave (v3.1.9+) y Harmonic (3.1.11+)

1. En su script de inicio del validador, agregue: `--shred-receiver-address 233.84.178.1:7733`

    Puede enviar a Jito y al grupo `edge-solana-shreds` al mismo tiempo.

    Ejemplo:

    ```json
    #!/bin/bash
    export PATH="/home/sol/.local/share/solana/install/releases/v3.1.9-jito/bin:$PATH"
    BLOCK_ENGINE_URL=https://ny.mainnet.block-engine.jito.wtf
    RELAYER_URL=http://ny.mainnet.relayer.jito.wtf:8100
    SHRED_RECEIVER_ADDR=<JitoBlockEngineAddress>
    <...The rest of your config...>
    --shred-receiver-address 233.84.178.1:7733
    ```

2. Reinicie su validador.
3. Conéctese al grupo de multicast de DoubleZero `edge-solana-shreds` como publicador: `doublezero connect ibrl && doublezero connect multicast --publish edge-solana-shreds`

### Frankendancer

1. En `config.toml`, agregue:

    ```toml
    [tiles.shred]
    additional_shred_destinations_leader = [ "233.84.178.1:7733", ]
    ```

2. Reinicie su validador.
3. Conéctese al grupo de multicast de DoubleZero `edge-solana-shreds` como publicador: `doublezero connect ibrl && doublezero connect multicast --publish edge-solana-shreds`

## 2. Confirmar que está publicando shreds de líder

Una vez conectado, puede verificar [este panel](https://data.malbeclabs.com/dz/publisher-check) para confirmar que está publicando shreds. No verá la confirmación hasta que haya publicado shreds de líder para al menos un slot.

## 3. Recompensas para Validadores

Por cada época en que los validadores publiquen shreds de líder, serán recompensados proporcionalmente por su contribución según las suscripciones. Los detalles de este sistema serán anunciados y detallados en una fecha posterior.

## Solución de Problemas

### No se publican shreds de líder:

La causa más común de no transmitir shreds es la versión del cliente:

Debe estar ejecutando Jito-Agave 3.1.9+, JitoBam 3.1.9+, Frankendancer o Harmonic 3.1.11+. Otras versiones de cliente no funcionarán.

### Retransmisión:

1. Una causa común de retransmisión de shreds es una configuración simple. Es posible que tenga habilitado el flag para enviar shreds de retransmisión en su script de inicio; deberá deshabilitarlo.

    El flag que debe eliminar en Jito-Agave es: `--shred-retransmit-receiver-address`.

1. Revise el [panel de publicadores](https://data.malbeclabs.com/dz/publisher-check) y compruebe si tiene shreds retransmitidos. En la tabla, observe la columna **No Retransmit Shreds**—una X roja significa que está retransmitiendo.

    !!! note "Vista de época"
        Tenga en cuenta que hay diferentes ventanas de tiempo para ver el panel de publicadores. Si ve retransmisión en la **vista de 2 épocas**, pero realizó un cambio reciente, intente cambiar a la vista de **slot reciente**.

    ![Panel de verificación de publicadores](images/publisher-check-dashboard.png)

2. Encuentre la IP de su cliente y busque su usuario en [DoubleZero Data](https://data.malbeclabs.com/dz/users).

    ![Usuarios de DoubleZero Data](images/doublezero-data-users.png)

3. Haga clic en **Multicast** para abrir su vista de multicast.

    La captura de pantalla a continuación muestra: **Retransmitiendo** (indeseable) tráfico saliente constante sin patrón de slot de líder.

    ![Vista multicast del usuario — ejemplo de retransmisión](images/user-multicast-view-retransmit.png)

    La captura de pantalla a continuación muestra: **Saludable** (publicando solo shreds de líder) tráfico saliente en picos, conocido como patrón de diente de sierra, que se alinea con sus slots de líder.

    ![Vista multicast del usuario — ejemplo de publicador saludable](images/user-multicast-view-healthy.png)

El gráfico muestra si está enviando solo shreds de líder. Los picos de tráfico deben alinearse con cuando tiene un slot de líder. Cuando no tiene un slot de líder, no debe haber tráfico. Si está retransmitiendo, verá un flujo constante de tráfico en lugar de picos alineados con slots.
