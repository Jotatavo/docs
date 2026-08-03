# Connexion Multicast Validateur
!!! warning "This translation was generated using artificial intelligence and has not been reviewed by a human translator. It may contain inaccuracies or errors and should not be relied upon."

!!! warning "En me connectant à DoubleZero, j'accepte les [Conditions d'Utilisation de DoubleZero](https://doublezero.xyz/terms-protocol)"

Si vous n'êtes pas encore connecté à DoubleZero, veuillez d'abord compléter la documentation de [Configuration](https://docs.malbeclabs.com/setup/) et de connexion validateur [Mainnet-Beta](https://docs.malbeclabs.com/DZ%20Mainnet-beta%20Connection/).

Sociétés de trading et autres abonnés : [Connexion d'un abonné Edge](Edge%20Subscriber%20Connection.md).

Si vous êtes un validateur déjà connecté à DoubleZero, vous pouvez continuer ce guide.

## 1. Configuration du Client

### Jito-Agave (v3.1.9+) et Harmonic (3.1.11+)

1. Dans votre script de démarrage du validateur, ajoutez : `--shred-receiver-address 233.84.178.1:7733`

    Vous pouvez envoyer à Jito et au groupe `edge-solana-shreds` en même temps.

    Exemple :

    ```json
    #!/bin/bash
    export PATH="/home/sol/.local/share/solana/install/releases/v3.1.9-jito/bin:$PATH"
    BLOCK_ENGINE_URL=https://ny.mainnet.block-engine.jito.wtf
    RELAYER_URL=http://ny.mainnet.relayer.jito.wtf:8100
    SHRED_RECEIVER_ADDR=<JitoBlockEngineAddress>
    <...The rest of your config...>
    --shred-receiver-address 233.84.178.1:7733
    ```

2. Redémarrez votre validateur.
3. Connectez-vous au groupe multicast DoubleZero `edge-solana-shreds` en tant que publicateur : `doublezero connect ibrl && doublezero connect multicast --publish edge-solana-shreds`

### Frankendancer

1. Dans `config.toml`, ajoutez :

    ```toml
    [tiles.shred]
    additional_shred_destinations_leader = [ "233.84.178.1:7733", ]
    ```

2. Redémarrez votre validateur.
3. Connectez-vous au groupe multicast DoubleZero `edge-solana-shreds` en tant que publicateur : `doublezero connect ibrl && doublezero connect multicast --publish edge-solana-shreds`

## 2. Confirmer que vous publiez des shreds de leader

Une fois connecté, vous pouvez vérifier [ce tableau de bord](https://data.malbeclabs.com/dz/publisher-check) pour confirmer que vous publiez des shreds. Vous ne verrez pas de confirmation tant que vous n'aurez pas publié des shreds de leader pour au moins un slot.

## 3. Récompenses des Validateurs

Pour chaque époque où les validateurs publient des shreds de leader, ils seront récompensés proportionnellement pour leur contribution en fonction des abonnements. Les détails de ce système seront annoncés et détaillés ultérieurement.

## Dépannage

### Pas de publication de shreds de leader :

La cause la plus fréquente de non-transmission des shreds est la version du client :

Vous devez utiliser Jito-Agave 3.1.9+, JitoBam 3.1.9+, Frankendancer ou Harmonic 3.1.11+. Les autres versions de client ne fonctionneront pas.

### Retransmission :

1. Une cause courante de retransmission de shreds est une configuration simple. Vous avez peut-être activé le flag d'envoi de shreds de retransmission dans votre script de démarrage ; vous devrez le désactiver.

    Le flag à supprimer dans Jito-Agave est : `--shred-retransmit-receiver-address`.

1. Vérifiez le [tableau de bord des publicateurs](https://data.malbeclabs.com/dz/publisher-check) et voyez si vous avez des shreds retransmis. Dans le tableau, regardez la colonne **No Retransmit Shreds**—une croix rouge signifie que vous retransmettez.

    !!! note "Vue par époque"
        Notez qu'il existe différentes fenêtres temporelles pour afficher le tableau de bord des publicateurs. Si vous voyez une retransmission dans la **vue 2 époques**, mais que vous avez effectué un changement récent, essayez de passer à la vue **slot récent**.

    ![Tableau de bord de vérification des publicateurs](images/publisher-check-dashboard.png)

2. Trouvez l'IP de votre client et cherchez votre utilisateur dans [DoubleZero Data](https://data.malbeclabs.com/dz/users).

    ![Utilisateurs DoubleZero Data](images/doublezero-data-users.png)

3. Cliquez sur **Multicast** pour ouvrir votre vue multicast.

    La capture d'écran ci-dessous montre : **Retransmission** (indésirable) un trafic sortant constant sans motif de slot de leader.

    ![Vue multicast utilisateur — exemple de retransmission](images/user-multicast-view-retransmit.png)

    La capture d'écran ci-dessous montre : **Sain** (publication uniquement de shreds de leader) un trafic sortant en pics, connu sous le nom de motif en dents de scie, qui s'aligne sur vos slots de leader.

    ![Vue multicast utilisateur — exemple de publicateur sain](images/user-multicast-view-healthy.png)

Le graphique indique si vous envoyez uniquement des shreds de leader. Les pics de trafic doivent s'aligner avec vos slots de leader. Lorsque vous n'avez pas de slot de leader, il ne doit y avoir aucun trafic. Si vous retransmettez, vous verrez un flux de trafic constant au lieu de pics alignés sur les slots.
