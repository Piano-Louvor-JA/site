---
title: Installer PIANO LouvorJA sur Linux
description: Installez PIANO LouvorJA sur Linux via AppImage, Snapcraft ou Flathub, choisissez la bonne architecture et préparez l'application pour le culte.
nav_order: 3
platform: linux
reviewed_at: 2026-11-15
toc: true
---

# Installer PIANO LouvorJA sur Linux

Sur Linux, l'option la plus directe est de télécharger l'AppImage officielle. Vous pouvez aussi utiliser Snapcraft ; Flathub est en cours de révision et, tant qu'il n'apparaît pas dans la boutique, vous devez utiliser un autre canal officiel.

## Quelle option d'installation choisir ?

Choisissez le canal qui fonctionne déjà le mieux sur l'ordinateur de l'église.

- **AppImage :** fichier unique, téléchargé depuis la page officielle. C'est l'alternative la plus simple lorsque vous avez accès au dossier des téléchargements.
- **Snapcraft :** option pour les distributions qui utilisent déjà la boutique Snap.
- **Flathub :** envoi en révision ; ne l'utilisez que lorsque PIANO sera disponible dans la boutique. D'ici là, choisissez AppImage ou Snapcraft.

Tous doivent être accédés depuis la page officielle de [téléchargement](/download), qui pointe vers les versions publiées.

## Comment choisir entre ARM64 et X64 ?

La page de téléchargement peut afficher deux versions d'AppImage.

1. Si l'ordinateur utilise un processeur Intel ou AMD courant, choisissez **X64**.
2. S'il utilise un processeur ARM, choisissez **ARM64**.
3. En cas de doute, demandez de l'aide à la personne qui a configuré l'ordinateur avant de télécharger.
4. Évitez de tester des fichiers au hasard : utiliser la mauvaise architecture empêche l'ouverture.

Les ordinateurs d'église avec Intel ou AMD utilisent normalement X64.

## Comment installer avec AppImage ?

L'AppImage est un fichier que vous téléchargez, autorisez à s'exécuter, puis ouvrez.

1. Ouvrez [téléchargement](/download).
2. Choisissez **Linux** et téléchargez l'AppImage adaptée à l'ordinateur.
3. Ouvrez le gestionnaire de fichiers et allez dans **Téléchargements**.
4. Faites un clic droit sur le fichier AppImage.
5. Choisissez **Propriétés**.
6. Ouvrez l'onglet **Permissions**.
7. Cochez l'option ressemblant à **Autoriser l'exécution du fichier comme un programme**.
8. Fermez la fenêtre des propriétés.
9. Double-cliquez sur l'AppImage pour ouvrir PIANO.

Le nom de l'option peut varier légèrement selon la distribution Linux. Cherchez **Permissions** et l'autorisation d'exécuter le fichier.

## Et si je n'ai accès qu'au terminal ?

Privilégiez le gestionnaire de fichiers. Si le responsable technique de l'église utilise le terminal, il peut autoriser le fichier avec cette commande, dans le dossier où il a été enregistré :

```bash
chmod +x nom-du-fichier.AppImage
```

Ensuite, ouvrez le fichier via le gestionnaire de fichiers. Il n'est pas nécessaire d'utiliser le terminal au quotidien avec PIANO.

## Comment installer via Snapcraft ?

Utilisez la page officielle de téléchargement pour accéder au canal Snapcraft publié pour PIANO.

1. Ouvrez [téléchargement](/download).
2. Choisissez l'option **Linux** et localisez le canal Snapcraft.
3. Ouvrez le lien de la boutique.
4. Suivez l'installation indiquée par votre distribution Linux ou par le responsable technique.
5. Cherchez **PIANO LouvorJA** dans le menu des applications.
6. Ouvrez l'application et effectuez le test initial.

Si la boutique Snap n'est pas installée ou ne s'ouvre pas sur l'ordinateur, utilisez l'AppImage au lieu de modifier le système pendant le sabbat.

## Puis-je installer via Flathub ?

Pas encore comme voie principale. La soumission à Flathub est en révision ; la disponibilité dépend de l'approbation de la boutique.

1. Ouvrez [téléchargement](/download).
2. Vérifiez s'il existe un bouton actif Flathub pour PIANO.
3. S'il existe, ouvrez le bouton et installez depuis la boutique elle-même.
4. S'il n'y a pas de bouton ou si la page indique une indisponibilité, utilisez AppImage ou Snapcraft.

Ne considérez pas Flathub comme disponible avant de le voir sur la page officielle.

## Que faire à la première ouverture ?

Préparez PIANO avant le culte, en particulier le contenu qui sera utilisé sans internet.

1. Ouvrez PIANO LouvorJA.
2. Attendez la préparation initiale du catalogue.
3. Dans la **Centrale de Médias**, recherchez et téléchargez les cantiques du Recueil de cantiques adventistes et les recueils du programme.
4. Dans **Liturgie**, créez la séquence du culte avec des catégories, des chants, la Bible et des fichiers locaux.
5. Dans **Paramètres**, ajustez le style de projection.
6. Testez un cantique, un verset et l'horloge sur l'écran de l'église.

Les téléchargements, liturgies et paramètres sont enregistrés sur l'appareil. Fermer l'application n'efface pas ce qui a été préparé.

## Comment résoudre le problème si l'AppImage ne s'ouvre pas ?

Vérifiez d'abord les bases, sans rien effacer.

1. Confirmez que vous avez téléchargé le fichier correct pour l'architecture de l'ordinateur.
2. Revérifiez **Propriétés** et **Permissions**.
3. Déplacez le fichier vers un dossier local, comme **Documents**, s'il se trouve sur une clé USB ou le réseau.
4. Téléchargez à nouveau uniquement depuis la page officielle si le téléchargement a été interrompu.
5. Si le problème persiste, utilisez le canal Snapcraft, s'il est disponible, ou l'application web pour ne pas être sans solution pendant le culte.

## Comment créer un raccourci facile pour l'équipe ?

Après avoir testé l'AppImage, conservez-la dans un dossier reconnu par l'équipe.

1. Créez ou choisissez un dossier nommé **PIANO LouvorJA** dans **Documents**.
2. Déplacez l'AppImage testée vers ce dossier.
3. Ouvrez-la à nouveau pour confirmer qu'elle fonctionne toujours.
4. Si le gestionnaire de fichiers propose **Ajouter aux favoris** ou **Créer un raccourci**, utilisez cette option.
5. Indiquez à l'équipe où le fichier est rangé.
6. N'effacez pas le fichier utilisé simplement parce qu'il s'est ouvert ; c'est l'application elle-même.
7. Évitez d'avoir plusieurs anciennes copies avec des noms similaires.

## Comment préparer une liturgie complète ?

1. Ouvrez **Liturgie** et choisissez de créer un programme.
2. Ajoutez des catégories pour séparer chaque moment du culte.
3. Ajoutez des chants, des médias locaux, des liens ou des notes.
4. Indiquez les horaires des catégories lorsque l'équipe doit suivre le temps.
5. Faites glisser les éléments jusqu'à obtenir l'ordre final.
6. Enregistrez et faites une révision avec le responsable du programme.
7. Pendant le culte, suivez la séquence et cochez les éléments terminés.

## Comment projeter en toute sécurité ?

1. Ouvrez un cantique dans la **Centrale de Médias**.
2. Cliquez sur **Projeter**.
3. Vérifiez le deuxième écran ou la TV.
4. Faites défiler le texte pour vérifier la synchronisation.
5. Ouvrez un verset dans la **Bible** et faites le même test.
6. Ajustez le contraste et la taille de la police dans **Paramètres**.
7. Utilisez **ESC** pour terminer la projection à la fin du test.

## Comment éviter les imprévus à l'église ?

1. Faites les téléchargements et les tests à l'avance.
2. Gardez le chargeur, le câble vidéo et l'adaptateur à portée de main.
3. Confirmez que le projecteur ou la TV est sur la bonne entrée.
4. Ne mettez pas à jour la distribution Linux juste avant le culte.
5. Laissez l'application web disponible comme alternative en cas d'internet.
6. Expliquez à une deuxième personne comment ouvrir PIANO.
7. Conservez une sauvegarde des paramètres lorsque l'équipe change d'ordinateur.

## Checklist finale avant le culte

1. Confirmez que PIANO s'ouvre sur l'appareil choisi.
2. Confirmez que les cantiques et les documents sont disponibles.
3. Confirmez que la liturgie est dans le bon ordre.
4. Confirmez que l'écran de l'église reçoit une projection de test.
5. Confirmez la taille de la police et le contraste depuis le fond de la salle.
6. Confirmez le réseau, l'alimentation et les câbles nécessaires.
7. Désignez une personne responsable de l'opération.

## Rubriques connexes

- [Installer sur Windows](/docs/install/windows)
- [Utiliser dans le navigateur et installer comme application](/docs/install/web-pwa)
- [Utiliser PIANO sur Android TV et Google TV](/docs/install/tv-android)
