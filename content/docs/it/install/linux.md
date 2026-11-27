---
title: Installa PIANO LouvorJA su Linux
description: Installa PIANO LouvorJA su Linux via AppImage, Snapcraft o Flathub, scegli l'architettura giusta e tieni l'applicazione pronta per il culto.
nav_order: 3
platform: linux
reviewed_at: 2026-11-15
toc: true
---

# Installa PIANO LouvorJA su Linux

Su Linux, l'opzione più diretta è scaricare l'AppImage ufficiale. Puoi anche usare Snapcraft; Flathub è in revisione e, finché non appare nello store, devi usare un altro canale ufficiale.

## Quale opzione di installazione scelgo?

Scegli il canale che funziona già meglio sul computer della chiesa.

- **AppImage:** un unico file, scaricato dalla pagina ufficiale. È l'alternativa più semplice quando hai accesso alla cartella dei download.
- **Snapcraft:** un'opzione per le distribuzioni che usano già lo store Snap.
- **Flathub:** invio in revisione; usalo solo quando PIANO è disponibile nello store. Fino ad allora, scegli AppImage o Snapcraft.

Tutti vanno raggiunti dalla pagina ufficiale di [download](/download), che punta ai rilasci pubblicati.

## Come scelgo tra ARM64 e X64?

La pagina di download può mostrare due versioni AppImage.

1. Se il computer usa un comune processore Intel o AMD, scegli **X64**.
2. Se usa un processore ARM, scegli **ARM64**.
3. Se non sei sicuro, chiedi a chi ha configurato il computer prima di scaricare.
4. Evita di provare file a caso: l'architettura sbagliata impedisce l'apertura dell'app.

I computer da chiesa con Intel o AMD usano di solito X64.

## Come installo con AppImage?

L'AppImage è un file che scarichi, autorizzi all'esecuzione e apri.

1. Apri [download](/download).
2. Scegli **Linux** e scarica l'AppImage adatta al computer.
3. Apri il gestore file e vai su **Download**.
4. Fai clic destro sul file AppImage.
5. Scegli **Proprietà**.
6. Apri la scheda **Permessi**.
7. Spunta l'opzione simile a **Consenti l'esecuzione del file come programma**.
8. Chiudi la finestra delle proprietà.
9. Fai doppio clic sull'AppImage per aprire PIANO.

Il nome dell'opzione può variare leggermente per distribuzione Linux. Cerca **Permessi** e l'autorizzazione a eseguire il file.

## E se ho solo accesso da terminale?

Preferisci il gestore file. Se la persona tecnica della chiesa usa il terminale, può autorizzare il file con questo comando, nella cartella dove è salvato:

```bash
chmod +x nome-file.AppImage
```

Poi apri il file tramite il gestore file. Usare il terminale nell'operazione quotidiana di PIANO non è necessario.

## Come installo da Snapcraft?

Usa la pagina ufficiale di download per raggiungere il canale Snapcraft pubblicato per PIANO.

1. Apri [download](/download).
2. Scegli l'opzione **Linux** e individua il canale Snapcraft.
3. Apri il link dello store.
4. Segui l'installazione mostrata dalla tua distribuzione Linux o dalla persona tecnica responsabile.
5. Cerca **PIANO LouvorJA** nel menu delle applicazioni.
6. Apri l'applicazione ed esegui la prova iniziale.

Se lo store Snap non è installato o non si apre sul computer, usa l'AppImage invece di tentare di modificare il sistema di sabato.

## Posso installare da Flathub?

Non ancora come percorso principale. L'invio a Flathub è in revisione; la disponibilità dipende dall'approvazione dello store.

1. Apri [download](/download).
2. Verifica se c'è un pulsante Flathub attivo per PIANO.
3. Se c'è, apri il pulsante e installa dallo store stesso.
4. Se non c'è pulsante o la pagina segnala indisponibilità, usa AppImage o Snapcraft.

Non considerare Flathub disponibile prima di vederlo sulla pagina ufficiale.

## Cosa faccio al primo avvio?

Prepara PIANO prima del culto, soprattutto i contenuti che saranno usati senza Internet.

1. Apri PIANO LouvorJA.
2. Attendi la preparazione iniziale del catalogo.
3. Nel **Centro Media**, cerca e scarica gli inni dell'Innario Avventista e gli innari del programma.
4. Nella **Liturgia**, crea l'ordine del culto con categorie, canti, Bibbia e file locali.
5. In **Impostazioni**, regola lo stile della proiezione.
6. Prova un inno, un versetto biblico e l'orologio sullo schermo della chiesa.

Download, liturgie e impostazioni sono salvati sul dispositivo. Chiudere l'applicazione non cancella ciò che è già stato preparato.

## Come riparo un'AppImage che non si apre?

Controlla prima le basi, senza eliminare nulla.

1. Conferma di aver scaricato il file corretto per l'architettura del computer.
2. Ricontrolla **Proprietà** e **Permessi**.
3. Sposta il file in una cartella locale, come **Documenti**, se si trova su una chiavetta USB o una condivisione di rete.
4. Scarica di nuovo solo dalla pagina ufficiale se lo scaricamento era stato interrotto.
5. Se il problema persiste, usa il canale Snapcraft, se disponibile, o l'app web per non restare senza supporto durante il culto.

## Come lascio una scorciatoia facile per la squadra?

Dopo aver provato l'AppImage, conservala in una cartella che la squadra riconosce.

1. Crea o scegli una cartella chiamata **PIANO LouvorJA** in **Documenti**.
2. Sposta l'AppImage provata in quella cartella.
3. Riaprila per confermare che funziona ancora.
4. Se il gestore file offre **Aggiungi ai preferiti** o **Crea scorciatoia**, usa quell'opzione.
5. Dì alla squadra dove è conservato il file.
6. Non eliminare il file in uso solo perché si è aperto; è l'applicazione.
7. Evita più copie vecchie con nomi simili.

## Come preparo una liturgia completa?

1. Apri **Liturgia** e scegli di creare un programma.
2. Aggiungi categorie per separare ogni momento del culto.
3. Aggiungi canti, media locali, link o note.
4. Inserisci gli orari delle categorie quando la squadra deve seguire la programmazione.
5. Trascina gli elementi fino all'ordine finale.
6. Salva e rivedi insieme alla persona responsabile del programma.
7. Durante il culto, segui la sequenza e segna gli elementi completati.

## Come proietto in modo affidabile?

1. Apri un inno nel **Centro Media**.
2. Clicca **Proietta**.
3. Controlla il secondo schermo o la TV.
4. Avanza il testo per verificare la sincronizzazione.
5. Apri un versetto nella **Bibbia** ed esegui la stessa prova.
6. Regola contrasto e dimensione del carattere in **Impostazioni**.
7. Usa **ESC** per terminare la proiezione a prova finita.

## Come evito sorprese in chiesa?

1. Fai download e prove in anticipo.
2. Tieni caricatore, cavo video e adattatore accessibili.
3. Conferma che proiettore o TV siano sull'ingresso corretto.
4. Non aggiornare la distribuzione Linux subito prima del culto.
5. Tieni l'app web disponibile come alternativa se c'è Internet.
6. Spiega a una seconda persona come aprire PIANO.
7. Conserva un backup delle impostazioni quando la squadra cambia computer.

## Checklist finale prima del culto

1. Conferma che PIANO si apra sul dispositivo scelto.
2. Conferma che inni e materiali siano disponibili.
3. Conferma che la liturgia sia nell'ordine corretto.
4. Conferma che lo schermo della chiesa riceva una proiezione di prova.
5. Conferma dimensione del testo e contrasto contro lo sfondo della sala.
6. Conferma rete, alimentazione e i cavi necessari.
7. Lascia una persona incaricata dell'operazione.

## Collegati

- [Installa su Windows](/docs/install/windows)
- [Usa nel browser e installa come app](/docs/install/web-pwa)
- [Usa PIANO su Android TV e Google TV](/docs/install/tv-android)
