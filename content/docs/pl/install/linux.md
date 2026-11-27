---
title: Zainstaluj PIANO LouvorJA w systemie Linux
description: Zainstaluj PIANO LouvorJA w systemie Linux przez AppImage, Snapcraft lub Flathub, wybierz właściwą architekturę i przygotuj aplikację do nabożeństwa.
nav_order: 3
platform: linux
reviewed_at: 2026-11-15
toc: true
---

# Zainstaluj PIANO LouvorJA w systemie Linux

W systemie Linux najprostszym rozwiązaniem jest pobranie oficjalnego AppImage. Można również użyć Snapcraft; Flathub jest w trakcie weryfikacji, dlatego dopóki aplikacja nie pojawi się w sklepie, należy użyć innego oficjalnego kanału.

## Którą opcję instalacji wybrać?

Wybierz kanał, który najlepiej działa już na komputerze w zborze.

- **AppImage:** pojedynczy plik pobierany z oficjalnej strony. To najprostsza opcja, gdy masz dostęp do folderu pobranych plików.
- **Snapcraft:** opcja dla dystrybucji, które już korzystają ze sklepu Snap.
- **Flathub:** zgłoszenie jest w trakcie weryfikacji; używaj go tylko wtedy, gdy PIANO będzie dostępne w sklepie. Do tego czasu wybierz AppImage lub Snapcraft.

Ze wszystkich tych opcji należy korzystać przez oficjalną stronę [pobierania](/download), która prowadzi do opublikowanych wydań.

## Jak wybrać między ARM64 a X64?

Strona pobierania może wyświetlać dwie wersje AppImage.

1. Jeśli komputer ma popularny procesor Intel lub AMD, wybierz **X64**.
2. Jeśli używa procesora ARM, wybierz **ARM64**.
3. Jeśli nie masz pewności, przed pobraniem zapytaj osobę, która skonfigurowała komputer.
4. Nie testuj przypadkowych plików: niewłaściwa architektura uniemożliwi otwarcie aplikacji.

Komputery zborowe z procesorami Intel lub AMD zwykle używają X64.

## Jak zainstalować przez AppImage?

AppImage to plik, który należy pobrać, zezwolić na jego uruchamianie i otworzyć.

1. Otwórz stronę [pobierania](/download).
2. Wybierz **Linux** i pobierz AppImage odpowiedni dla komputera.
3. Otwórz menedżer plików i przejdź do folderu **Pobrane**.
4. Kliknij prawym przyciskiem plik AppImage.
5. Wybierz **Właściwości**.
6. Otwórz kartę **Uprawnienia**.
7. Zaznacz opcję podobną do **Zezwól na uruchamianie pliku jako programu**.
8. Zamknij okno właściwości.
9. Kliknij dwukrotnie AppImage, aby otworzyć PIANO.

Nazwa opcji może się nieznacznie różnić zależnie od dystrybucji Linuxa. Szukaj **Uprawnień** oraz zezwolenia na uruchomienie pliku.

## Co zrobić, gdy mam dostęp tylko do terminala?

Preferuj menedżer plików. Jeśli osoba techniczna w zborze używa terminala, może zezwolić na uruchomienie pliku tym poleceniem w folderze, w którym został zapisany:

```bash
chmod +x file-name.AppImage
```

Następnie otwórz plik przez menedżer plików. W codziennym używaniu PIANO terminal nie jest potrzebny.

## Jak zainstalować z Snapcraft?

Użyj oficjalnej strony pobierania, aby przejść do kanału Snapcraft opublikowanego dla PIANO.

1. Otwórz stronę [pobierania](/download).
2. Wybierz **Linux** i znajdź kanał Snapcraft.
3. Otwórz link do sklepu.
4. Postępuj zgodnie z instrukcją instalacji wyświetloną przez dystrybucję Linuxa lub osobę techniczną odpowiedzialną za komputer.
5. Znajdź **PIANO LouvorJA** w menu aplikacji.
6. Otwórz aplikację i wykonaj pierwszy test.

Jeśli sklep Snap nie jest zainstalowany lub nie otwiera się na komputerze, użyj AppImage zamiast próbować zmieniać system w sobotę.

## Czy mogę zainstalować z Flathub?

Jeszcze nie jako główną drogę. Zgłoszenie do Flathub jest w trakcie weryfikacji; dostępność zależy od zatwierdzenia przez sklep.

1. Otwórz stronę [pobierania](/download).
2. Sprawdź, czy jest aktywny przycisk Flathub dla PIANO.
3. Jeśli jest, otwórz go i zainstaluj aplikację bezpośrednio ze sklepu.
4. Jeśli nie ma przycisku lub strona informuje o niedostępności, użyj AppImage lub Snapcraft.

Nie traktuj Flathub jako dostępnego, dopóki nie zobaczysz go na oficjalnej stronie.

## Co zrobić przy pierwszym uruchomieniu?

Przygotuj PIANO przed nabożeństwem, zwłaszcza treści, które będą używane bez internetu.

1. Otwórz PIANO LouvorJA.
2. Poczekaj na początkowe przygotowanie katalogu.
3. W **Media Center** wyszukaj i pobierz hymny z Adventist Hymnal oraz śpiewniki programu.
4. W **Liturgy** utwórz porządek nabożeństwa z kategoriami, pieśniami, Biblią i plikami lokalnymi.
5. W **Settings** dostosuj styl projekcji.
6. Przetestuj hymn, werset biblijny i zegar na ekranie zborowym.

Pobrania, liturgie i ustawienia są zapisywane na urządzeniu. Zamknięcie aplikacji nie usuwa tego, co zostało już przygotowane.

## Jak naprawić AppImage, który się nie otwiera?

Najpierw sprawdź podstawy, nie usuwając niczego.

1. Potwierdź, że pobrałeś właściwy plik dla architektury komputera.
2. Ponownie sprawdź **Właściwości** i **Uprawnienia**.
3. Przenieś plik do folderu lokalnego, na przykład **Dokumenty**, jeśli znajduje się na pendrive lub udziale sieciowym.
4. Pobierz go ponownie wyłącznie z oficjalnej strony, jeśli pobieranie zostało przerwane.
5. Jeśli problem się utrzymuje, użyj kanału Snapcraft, jeśli jest dostępny, albo aplikacji internetowej, aby nie pozostać bez wsparcia podczas nabożeństwa.

## Jak zostawić zespołowi łatwy skrót?

Po przetestowaniu AppImage zachowaj go w folderze rozpoznawalnym dla zespołu.

1. Utwórz lub wybierz folder **PIANO LouvorJA** w **Dokumentach**.
2. Przenieś przetestowany AppImage do tego folderu.
3. Otwórz go ponownie, aby potwierdzić, że nadal działa.
4. Jeśli menedżer plików oferuje **Dodaj do ulubionych** lub **Utwórz skrót**, użyj tej opcji.
5. Powiedz zespołowi, gdzie zapisano plik.
6. Nie usuwaj używanego pliku tylko dlatego, że się otworzył; to właśnie aplikacja.
7. Unikaj przechowywania kilku starych kopii o podobnych nazwach.

## Jak przygotować pełną liturgię?

1. Otwórz **Liturgy** i wybierz utworzenie programu.
2. Dodaj kategorie, aby rozdzielić poszczególne części nabożeństwa.
3. Dodaj pieśni, media lokalne, linki lub notatki.
4. Wprowadź czasy kategorii, gdy zespół musi śledzić harmonogram.
5. Przeciągaj elementy, aż znajdą się w końcowej kolejności.
6. Zapisz i przejrzyj wraz z osobą odpowiedzialną za program.
7. Podczas nabożeństwa postępuj zgodnie z kolejnością i oznaczaj wykonane elementy.

## Jak niezawodnie prowadzić projekcję?

1. Otwórz hymn w **Media Center**.
2. Kliknij **Project**.
3. Sprawdź drugi ekran lub telewizor.
4. Przewiń tekst, aby sprawdzić synchronizację.
5. Otwórz werset w **Bible** i wykonaj ten sam test.
6. Dostosuj kontrast i rozmiar czcionki w **Settings**.
7. Użyj **ESC**, aby zakończyć projekcję po teście.

## Jak uniknąć niespodzianek w zborze?

1. Wykonaj pobrania i testy z wyprzedzeniem.
2. Trzymaj ładowarkę, kabel wideo i adapter w łatwo dostępnym miejscu.
3. Potwierdź, że projektor lub telewizor jest ustawiony na właściwe wejście.
4. Nie aktualizuj dystrybucji Linuxa tuż przed nabożeństwem.
5. Zachowaj aplikację internetową jako alternatywę, jeśli jest internet.
6. Wyjaśnij drugiej osobie, jak otworzyć PIANO.
7. Zachowaj kopię zapasową ustawień, gdy zespół zmienia komputer.

## Końcowa lista kontrolna przed nabożeństwem

1. Potwierdź, że PIANO otwiera się na wybranym urządzeniu.
2. Potwierdź, że hymny i materiały są dostępne.
3. Potwierdź, że liturgia jest we właściwej kolejności.
4. Potwierdź, że ekran zborowy otrzymuje testową projekcję.
5. Potwierdź rozmiar tekstu i kontrast względem tła sali.
6. Potwierdź sieć, zasilanie i potrzebne kable.
7. Wyznacz jedną osobę odpowiedzialną za obsługę.

## Powiązane

- [Instalacja w systemie Windows](/docs/install/windows)
- [Korzystanie w przeglądarce i instalacja jako aplikacji](/docs/install/web-pwa)
- [Korzystanie z PIANO na Android TV i Google TV](/docs/install/tv-android)
