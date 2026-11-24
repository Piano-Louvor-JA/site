---
title: Scène et appareils multiples
description: Utilisez un téléphone ou un ordinateur pour piloter le culte pendant que la TV ou le projecteur affiche les paroles, les versets et les ressources de PIANO LouvorJA.
nav_order: 10
platform: web
reviewed_at: 2026-11-15
toc: true
---

# Scène et appareils multiples

En mode Scène, une personne pilote le culte depuis l'ordinateur ou le téléphone tandis qu'un autre écran affiche le contenu pour l'église. La TV, le projecteur ou le récepteur Scène montre la projection ; l'appareil de contrôle continue d'afficher les commandes.

## Qu'est-ce que la Scène ?

La Scène est l'écran qui reçoit la projection du culte via le réseau. Elle est indiquée pour une TV séparée du projecteur ou pour les églises qui souhaitent afficher des paroles, la Bible, l'horloge et un compte à rebours sans que les commandes soient visibles.

PIANO fonctionne avec deux rôles :

| Rôle                      | Ce qu'il fait                                                                                              |
| ------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Opérateur ou télécommande | Recherche les cantiques, ouvre les éléments, avance les diapositives, active ou désactive les projections. |
| Scène, TV ou projecteur   | Affiche le contenu destiné à l'assemblée.                                                                  |

L'écran de projection ne doit pas servir d'écran d'exploitation. Seuls le contenu et le style visuel choisis pour l'église y apparaissent.

## Qu'est-ce qui s'affiche sur la TV et qu'est-ce qui reste sur le contrôle ?

La TV ou le projecteur reçoit la projection du module actif. L'ordinateur ou le téléphone conserve les boutons et les listes nécessaires pour conduire le culte.

| Contenu          | TV, projecteur ou Scène                                                              | Ordinateur ou téléphone de contrôle                                                |
| ---------------- | ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| Cantique         | Paroles, diapositives, pochette et aperçu de la prochaine phrase selon la projection | Recherche, sélection du cantique, lecteur, volume et avance des diapositives       |
| Bible            | Verset sélectionné avec son propre style                                             | Choix de la version, du livre, du chapitre, des versets et des commandes           |
| Liturgie         | Contenu projeté de l'élément actif                                                   | Ordre du culte, catégories, éléments terminés et annotations                       |
| Horloge et temps | Horloge, minuteur ou compte à rebours                                                | Configuration de la couleur, du format, démarrage, pause, repères et remise à zéro |
| Tirage au sort   | Résultat, son et animation                                                           | Liste de noms, de numéros ou d'éléments et commande de tirage                      |

Les annotations de la liturgie sont destinées à l'équipe et ne doivent pas apparaître sur l'écran de l'église.

## Comment préparer le réseau avant l'appairage ?

Pour utiliser l'appairage local, placez l'appareil de contrôle et le récepteur Scène sur le même réseau. Avant le culte, effectuez un test complet avec la TV déjà allumée.

1. Allumez la TV ou le projecteur et l'appareil qui affichera la Scène.
2. Allumez l'ordinateur qui pilotera PIANO ou préparez le téléphone de contrôle.
3. Connectez tous les appareils au même réseau Wi‑Fi ou au réseau filaire de l'église.
4. Évitez les réseaux des visiteurs qui empêchent les appareils de se voir entre eux.
5. Vérifiez que les deux appareils restent connectés pendant le test.
6. Gardez le chargeur à proximité du téléphone utilisé comme télécommande.

Le manuel indique deux formes d'appairage : **P2P sur le même réseau** et **via serveur**, dans des onglets d'appairage séparés. L'utilisation détaillée des écrans et les codes de connexion doivent être confirmés dans la version installée.

**Comment ça fonctionne en coulisses (pour l'équipe technique) :** c'est le récepteur Scène qui se connecte à l'ordinateur opérateur, jamais l'inverse. PIANO ouvre une connexion WebSocket propre sur le réseau local (P2P) ou via un serveur intermédiaire ; il n'utilise ni Chromecast ni AirPlay. Chaque TV supplémentaire occupe son propre « slot » de connexion, ce qui permet d'utiliser plusieurs écrans en même temps sans qu'ils se gênent mutuellement.

## Comment appairer le téléphone ou une autre télécommande ?

Ouvrez la zone de télécommande et utilisez la forme d'appairage adaptée à l'infrastructure de l'église. Une fois connecté, l'appareil appairé peut piloter la projection sans remplacer l'écran de la Scène.

1. Sur l'ordinateur principal, ouvrez la zone **Télécommande** ou d'appairage.
2. Choisissez l'onglet d'appairage disponible : **P2P sur le même réseau** ou **via serveur**.
3. Sur le téléphone ou un autre ordinateur, ouvrez l'option de connexion correspondante.
4. Suivez l'identification affichée par PIANO jusqu'à ce que les deux appareils indiquent qu'ils sont connectés.
5. Faites un test : recherchez un cantique, ouvrez-le et avancez d'une diapositive.
6. Gardez l'ordinateur principal ouvert comme solution de secours si le téléphone perd sa batterie ou sa connexion.

Une fois appairée, la télécommande peut rechercher des cantiques, ouvrir un morceau avec l'album, avancer dans les versets, effacer la sélection, fermer la projection, démarrer, mettre en pause ou remettre à zéro le minuteur et le compte à rebours, enregistrer des repères, configurer l'horloge et activer ou désactiver la projection de chaque module.

## Comment connecter la Scène à la TV ?

Le récepteur Scène se connecte au réseau et affiche la projection. Il est utile lorsque la TV est séparée de l'ordinateur opérateur ou lorsqu'il y a plusieurs écrans dans le lieu de culte.

1. Ouvrez la Scène ou le récepteur sur l'appareil connecté à la TV.
2. Connectez cet appareil au réseau utilisé par l'équipe.
3. Dans PIANO, ouvrez les options d'appairage ou de projection Scène.
4. Sélectionnez ou connectez le récepteur disponible.
5. Ouvrez un cantique et cliquez sur **Projeter**.
6. Avancez d'une diapositive et vérifiez la mise à jour sur la TV.
7. Testez également un verset biblique, l'horloge et le compte à rebours.

Le récepteur Scène existe pour TV LG (webOS), TV Samsung (Tizen), Android TV/Google TV et les navigateurs. Chaque récepteur supplémentaire apparaît comme un écran distinct : pour utiliser plusieurs TV en même temps, connectez chaque récepteur à l'ordinateur opérateur et choisissez sur quel écran chaque élément est projeté — une TV peut afficher les paroles pendant qu'une autre affiche l'horloge ou le compte à rebours.

## Comment projeter un cantique sur la Scène ?

Une fois la Scène connectée, la projection d'un cantique suit le même flux que pour un second moniteur.

1. Sur la télécommande, ouvrez la **Centrale multimédia**.
2. Recherchez un cantique de l'Hymnaire adventiste, un recueil sacré ou un autre morceau préparé pour le culte.
3. Ouvrez le cantique et vérifiez les paroles.
4. Cliquez sur **Projeter**.
5. Vérifiez que les paroles apparaissent sur la TV ou le projecteur.
6. Avancez dans les strophes, les couplets et les refrains au rythme du chant.
7. Si aucun texte n'est sélectionné, vérifiez que la pochette et le titre conviennent pour le pré-lobby.

Si les paroles sont difficiles à lire, modifiez les paramètres de projection : couleur de fond, couleur du texte, taille, graisse, alignement, image de fond et zone de texte.

## Comment projeter la Bible et les utilitaires ?

La Scène peut afficher les mêmes ressources de projection que celles utilisées par l'opérateur. Testez chaque ressource avant une programmation spéciale, comme l'École du sabbat, le culte des jeunes ou une cérémonie.

1. Pour la Bible, ouvrez **Bible**.
2. Choisissez la version, le livre, le chapitre et les versets.
3. Cliquez sur **Projeter** et vérifiez la lecture sur la TV.
4. Pour l'horloge, le minuteur, le compte à rebours ou le tirage au sort, ouvrez **Utilitaires**.
5. Configurez la ressource, y compris la couleur et le format lorsque disponibles.
6. Activez la projection du module correspondant.
7. À la fin, désactivez ou fermez la projection lorsqu'elle n'est plus nécessaire.

## Que faire si la TV ne se met pas à jour ?

Vérifiez d'abord le réseau, le récepteur connecté et la projection active. Ne laissez pas ce test au début du culte.

1. Vérifiez que la TV/le récepteur et la télécommande sont sur le même réseau, en mode P2P local.
2. Vérifiez que le récepteur Scène reste ouvert et connecté.
3. Dans PIANO, désactivez puis réactivez la projection du module en cours d'utilisation.
4. Testez un autre cantique ou verset pour déterminer si le problème vient d'un élément précis.
5. Fermez et rouvrez la connexion d'appairage si elle s'est interrompue.
6. Prévoyez un câble vidéo ou un second écran comme solution de secours lorsque c'est possible.

## Rubriques liées

- [Premier culte avec PIANO](/docs/getting-started)
- [Problèmes courants](/docs/troubleshooting)
- [Raccourcis clavier](/docs/shortcuts)
- [Manuel complet](/docs/manual)
