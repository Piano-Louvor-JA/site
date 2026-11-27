---
title: PIANO LouvorJA installeren op Linux
description: Installeer PIANO LouvorJA op Linux via AppImage, Snapcraft of Flathub, kies de juiste architectuur en houd de applicatie klaar voor de eredienst.
nav_order: 3
platform: linux
reviewed_at: 2026-11-15
toc: true
---

# PIANO LouvorJA installeren op Linux

Op Linux is de meest directe optie de officiële AppImage downloaden. U kunt ook Snapcraft gebruiken; Flathub is in beoordeling en totdat het in de store verschijnt, moet u een ander officieel kanaal gebruiken.

## Welke installatieoptie kies ik?

Kies het kanaal dat al het beste werkt op de computer van de kerk.

- **AppImage:** één bestand, gedownload van de officiële pagina. Het eenvoudigste alternatief wanneer u toegang hebt tot de downloadmap.
- **Snapcraft:** een optie voor distributies die al de Snap-store gebruiken.
- **Flathub:** inzending in beoordeling; gebruik het pas wanneer PIANO in de store beschikbaar is. Kies tot die tijd AppImage of Snapcraft.

Alle moeten worden benaderd via de officiële [download](/download)-pagina, die naar de gepubliceerde releases wijst.

## Hoe kies ik tussen ARM64 en X64?

De downloadpagina kan twee AppImage-versies tonen.

1. Als de computer een gewone Intel- of AMD-processor heeft, kies **X64**.
2. Als die een ARM-processor heeft, kies **ARM64**.
3. Weet u het niet zeker, vraag het dan aan wie de computer heeft ingesteld voordat u downloadt.
4. Vermijd het testen van willekeurige bestanden: een verkeerde architectuur verhindert dat de app opent.

Kerkcomputers met Intel of AMD gebruiken meestal X64.

## Hoe installeer ik met AppImage?

De AppImage is een bestand dat u downloadt, uitvoerrechten geeft en opent.

1. Open [download](/download).
2. Kies **Linux** en download de AppImage die bij de computer past.
3. Open de bestandsbeheerder en ga naar **Downloads**.
4. Klik met de rechtermuisknop op het AppImage-bestand.
5. Kies **Eigenschappen**.
6. Open het tabblad **Rechten**.
7. Vink de optie aan die lijkt op **Toestaan het bestand uit te voeren als programma**.
8. Sluit het eigenschappenvenster.
9. Dubbelklik op de AppImage om PIANO te openen.

De naam van de optie kan per Linux-distributie iets verschillen. Zoek **Rechten** en de autorisatie om het bestand uit te voeren.

## En als ik alleen terminaltoegang heb?

Gebruik liever de bestandsbeheerder. Als het technische team van de kerk de terminal gebruikt, kan die het bestand autoriseren met deze opdracht, in de map waar het is opgeslagen:

```bash
chmod +x bestandsnaam.AppImage
```

Open daarna het bestand via de bestandsbeheerder. De terminal is voor het dagelijkse gebruik van PIANO niet nodig.

## Hoe installeer ik via Snapcraft?

Gebruik de officiële downloadpagina om het voor PIANO gepubliceerde Snapcraft-kanaal te bereiken.

1. Open [download](/download).
2. Kies de optie **Linux** en zoek het Snapcraft-kanaal.
3. Open de store-link.
4. Volg de installatie die uw Linux-distributie of het verantwoordelijke technische team toont.
5. Zoek **PIANO LouvorJA** in het applicatiemenu.
6. Open de applicatie en voer de eerste test uit.

Als de Snap-store niet is geïnstalleerd of niet opent op de computer, gebruik dan de AppImage in plaats van te proberen het systeem op de sabbat aan te passen.

## Kan ik vanaf Flathub installeren?

Nog niet als hoofd route. De Flathub-inzending is in beoordeling; de beschikbaarheid hangt af van de goedkeuring van de store.

1. Open [download](/download).
2. Controleer of er een actieve Flathub-knop voor PIANO is.
3. Zo ja, open de knop en installeer vanuit de store zelf.
4. Zo nee, of als de pagina onbeschikbaarheid meldt, gebruik AppImage of Snapcraft.

Beschouw Flathub niet als beschikbaar voordat u het op de officiële pagina ziet.

## Wat doe ik bij de eerste start?

Bereid PIANO vóór de eredienst voor, met name de inhoud die zonder internet zal worden gebruikt.

1. Open PIANO LouvorJA.
2. Wacht op de eerste catalogusvoorbereiding.
3. Zoek en download in het **Mediacentrum** de liederen uit het Adventistische Liedboek en de liedboeken van het programma.
4. Maak in de **Liturgie** de volgorde van de eredienst met categorieën, liederen, Bijbel en lokale bestanden.
5. Pas in **Instellingen** de projectiestijl aan.
6. Test een lied, een bijbelvers en de klok op het kerkscherm.

Downloads, liturgieën en instellingen worden op het apparaat bewaard. De applicatie sluiten wist niet wat al is voorbereid.

## Hoe herstel ik een AppImage die niet opent?

Controleer eerst de basis, zonder iets te verwijderen.

1. Bevestig dat u het juiste bestand voor de architectuur van de computer hebt gedownload.
2. Controleer opnieuw **Eigenschappen** en **Rechten**.
3. Verplaats het bestand naar een lokale map, zoals **Documenten**, als het op een usb-stick of netwerkshare staat.
4. Download opnieuw, alleen van de officiële pagina, als de download was onderbroken.
5. Als het probleem aanhoudt, gebruik het Snapcraft-kanaal indien beschikbaar, of de web-app, zodat u tijdens de eredienst niet zonder oplossing zit.

## Hoe laat ik een makkelijke snelkoppeling voor het team achter?

Bewaar na het testen van de AppImage die in een map die het team herkent.

1. Maak of kies een map met de naam **PIANO LouvorJA** in **Documenten**.
2. Verplaats de geteste AppImage naar die map.
3. Open die opnieuw om te bevestigen dat het nog werkt.
4. Als de bestandsbeheerder **Aan favorieten toevoegen** of **Snelkoppeling maken** aanbiedt, gebruik die optie.
5. Vertel het team waar het bestand staat.
6. Verwijder het bestand in gebruik niet alleen omdat het opende; het is de applicatie.
7. Vermijd meerdere oude kopieën met vergelijkbare namen.

## Hoe bereid ik een volledige liturgie voor?

1. Open **Liturgie** en kies ervoor een programma te maken.
2. Voeg categorieën toe om elk moment van de eredienst te scheiden.
3. Voeg liederen, lokale media, links of notities toe.
4. Vul categorietijden in wanneer het team de planning moet volgen.
5. Sleep de items naar de definitieve volgorde.
6. Sla op en herzie samen met de verantwoordelijke van het programma.
7. Volg tijdens de eredienst de volgorde en markeer voltooide items.

## Hoe projecteer ik betrouwbaar?

1. Open een lied in het **Mediacentrum**.
2. Klik **Projecteer**.
3. Controleer het tweede scherm of de tv.
4. Schakel de tekst door om de synchronisatie te verifiëren.
5. Open een vers in de **Bijbel** en voer dezelfde test uit.
6. Pas contrast en lettergrootte aan in **Instellingen**.
7. Gebruik **ESC** om de projectie te beëindigen wanneer de test klaar is.

## Hoe vermijd ik verrassingen in de kerk?

1. Doe downloads en tests vooraf.
2. Houd oplader, videokabel en adapter binnen handbereik.
3. Bevestig dat de projector of tv op de juiste ingang staat.
4. Werk de Linux-distributie niet vlak vóór de eredienst bij.
5. Houd de web-app beschikbaar als alternatief als er internet is.
6. Leg aan een tweede persoon uit hoe PIANO te openen.
7. Bewaar een back-up van de instellingen wanneer het team van computer wisselt.

## Laatste checklist vóór de eredienst

1. Bevestig dat PIANO opent op het gekozen apparaat.
2. Bevestig dat liederen en materiaal beschikbaar zijn.
3. Bevestig dat de liturgie in de juiste volgorde staat.
4. Bevestig dat het kerkscherm een testprojectie ontvangt.
5. Bevestig tekstgrootte en contrast tegen de achtergrond van de zaal.
6. Bevestig netwerk, stroom en de benodigde kabels.
7. Wijs één persoon aan die de werking verzorgt.

## Zie ook

- [Installeren op Windows](/docs/install/windows)
- [In de browser gebruiken en als app installeren](/docs/install/web-pwa)
- [PIANO op Android TV en Google TV gebruiken](/docs/install/tv-android)
