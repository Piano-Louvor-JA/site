---
title: Stage i wiele urządzeń
description: Używaj telefonu lub komputera do sterowania nabożeństwem, podczas gdy telewizor lub projektor wyświetla słowa pieśni, wersety biblijne i funkcje PIANO LouvorJA.
nav_order: 10
platform: web
reviewed_at: 2026-11-15
toc: true
---

# Stage i wiele urządzeń

W trybie Stage jedna osoba prowadzi nabożeństwo z komputera lub telefonu, a drugi ekran wyświetla treść dla zboru. Telewizor, projektor lub odbiornik Stage pokazuje projekcję; urządzenie sterujące nadal wyświetla polecenia.

## Czym jest Stage?

Stage to ekran, który odbiera projekcję nabożeństwa przez sieć. Jest zalecany dla telewizora oddzielonego od projektora lub dla zborów, które chcą wyświetlać słowa pieśni, Biblię, zegar i odliczanie bez widocznych elementów sterowania.

PIANO działa w dwóch rolach:

| Rola                           | Działanie                                                                         |
| ------------------------------ | --------------------------------------------------------------------------------- |
| Operator lub pilot             | Wyszukuje hymny, otwiera elementy, zmienia slajdy i włącza lub wyłącza projekcje. |
| Stage, telewizor lub projektor | Wyświetla treść przeznaczoną dla zboru.                                           |

Ekran projekcji nie powinien być używany jako ekran obsługi. Widoczna jest na nim tylko treść i styl wizualny wybrany dla zboru.

## Co pojawia się na telewizorze, a co pozostaje na urządzeniu sterującym?

Telewizor lub projektor odbiera projekcję aktywnego modułu. Komputer lub telefon zachowuje przyciski i listy potrzebne do prowadzenia nabożeństwa.

| Treść        | Telewizor, projektor lub Stage                                       | Komputer lub telefon sterujący                                     |
| ------------ | -------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Hymn         | Tekst, slajdy, okładka i podgląd następnej frazy zgodnie z projekcją | Wyszukiwanie, wybór hymnu, odtwarzacz, głośność i zmiana slajdów   |
| Bible        | Wybrany werset z własnym stylem                                      | Wybór przekładu, księgi, rozdziału i wersetu oraz sterowanie       |
| Liturgy      | Wyświetlana treść aktywnego elementu                                 | Kolejność nabożeństwa, kategorie, wykonane elementy i notatki      |
| Zegar i czas | Zegar, minutnik lub odliczanie                                       | Ustawienia koloru i formatu, rozpoczęcie, pauza, znaczniki i reset |
| Losowanie    | Wynik, dźwięk i animacja                                             | Lista imion, liczb lub elementów oraz polecenie losowania          |

Notatki liturgii są przeznaczone dla zespołu i nie powinny pojawiać się na ekranie zboru.

## Jak przygotować sieć przed parowaniem?

Aby użyć lokalnego parowania, podłącz urządzenie sterujące i odbiornik Stage do tej samej sieci. Przed nabożeństwem przeprowadź pełny test przy już włączonym telewizorze.

1. Włącz telewizor lub projektor oraz urządzenie, które będzie wyświetlać Stage.
2. Włącz komputer, na którym będzie działać PIANO, lub przygotuj telefon do sterowania.
3. Podłącz wszystkie urządzenia do tej samej sieci Wi‑Fi lub przewodowej sieci zboru.
4. Unikaj sieci gościnnych, które uniemożliwiają urządzeniom wzajemne wykrywanie.
5. Potwierdź, że podczas testu oba urządzenia pozostają połączone.
6. Trzymaj ładowarkę blisko telefonu używanego do sterowania.

Podręcznik opisuje dwie metody parowania: **P2P on the same network** i **via server**, w oddzielnych kartach parowania. Szczegółowe użycie ekranów i kodów połączenia należy potwierdzić w zainstalowanej wersji.

**Jak to działa od strony technicznej (dla zespołu technicznego):** odbiornik Stage to urządzenie, które łączy się z komputerem operatora, nigdy odwrotnie. PIANO otwiera własne połączenie WebSocket w sieci lokalnej (P2P) albo przez serwer pośredniczący; nie korzysta z Chromecast ani AirPlay. Każdy dodatkowy telewizor zajmuje własne „miejsce” połączenia, umożliwiając jednoczesne działanie wielu ekranów bez wzajemnego zakłócania.

## Jak sparować telefon lub inne urządzenie sterujące?

Otwórz obszar pilota i użyj metody parowania odpowiedniej dla konfiguracji zboru. Po połączeniu sparowane urządzenie może sterować projekcją bez zastępowania ekranu Stage.

1. Na głównym komputerze otwórz **Remote Control** lub obszar parowania.
2. Wybierz dostępną kartę parowania: **P2P on the same network** lub **via server**.
3. Na telefonie lub innym komputerze otwórz odpowiednią opcję połączenia.
4. Postępuj zgodnie z identyfikacją wyświetlaną przez PIANO, aż oba urządzenia wskażą, że są połączone.
5. Przeprowadź test: wyszukaj hymn, otwórz go i przejdź o jeden slajd dalej.
6. Pozostaw główny komputer otwarty jako alternatywę, jeśli telefon utraci baterię lub połączenie sieciowe.

Po sparowaniu pilot może wyszukiwać hymny, otwierać pieśń z albumem, przechodzić między zwrotkami, usuwać wybór, zamykać projekcję, uruchamiać, wstrzymywać lub resetować minutnik i odliczanie, zapisywać znaczniki, ustawiać zegar oraz włączać i wyłączać projekcję każdego modułu.

## Jak podłączyć Stage do telewizora?

Odbiornik Stage łączy się z siecią i wyświetla projekcję. Jest przydatny, gdy telewizor jest oddzielony od komputera operatora lub gdy w sali nabożeństw jest więcej niż jeden ekran.

1. Otwórz Stage lub odbiornik na urządzeniu podłączonym do telewizora.
2. Podłącz to urządzenie do sieci używanej przez zespół.
3. W PIANO otwórz opcje parowania lub projekcji Stage.
4. Wybierz lub podłącz dostępny odbiornik.
5. Otwórz hymn i kliknij **Project**.
6. Przejdź o jeden slajd dalej i potwierdź aktualizację na telewizorze.
7. Przetestuj także werset biblijny, zegar i odliczanie.

Odbiornik Stage jest dostępny dla telewizorów LG (webOS), Samsung (Tizen), Android TV/Google TV i przeglądarek. Każdy dodatkowy odbiornik pojawia się jako oddzielny ekran: aby korzystać z więcej niż jednego telewizora jednocześnie, podłącz każdy odbiornik do komputera operatora i wybierz ekran, na który wyświetlany jest każdy element — jeden telewizor może pokazywać tekst pieśni, a drugi zegar lub odliczanie.

## Jak wyświetlić hymn na Stage?

Gdy Stage jest podłączony, wyświetlanie hymnu przebiega tak samo jak przy użyciu drugiego monitora.

1. Na urządzeniu sterującym otwórz **Media Center**.
2. Wyszukaj hymn z Adventist Hymnal, świętego śpiewnika lub inną pieśń przygotowaną na nabożeństwo.
3. Otwórz hymn i sprawdź tekst.
4. Kliknij **Project**.
5. Sprawdź, czy słowa pieśni pojawiają się na telewizorze lub projektorze.
6. Przechodź między zwrotkami, wersami i refrenami, gdy zbór śpiewa.
7. Gdy nie wybrano tekstu pieśni, sprawdź, czy okładka i tytuł są odpowiednie dla ekranu przed nabożeństwem.

Jeśli tekst jest trudny do odczytania, zmień ustawienia projekcji: kolor tła, kolor tekstu, rozmiar, grubość, wyrównanie, obraz tła i pole tekstowe.

## Jak wyświetlić Biblię i narzędzia?

Stage może wyświetlać te same funkcje projekcji używane przez operatora. Przetestuj każdą funkcję przed specjalnym programem, takim jak Szkoła Sobotnia, nabożeństwo młodzieżowe lub uroczystość.

1. Dla Biblii otwórz **Bible**.
2. Wybierz przekład, księgę, rozdział i wersety.
3. Kliknij **Project** i sprawdź czytelność na telewizorze.
4. Dla zegara, minutnika, odliczania lub losowania otwórz **Utilities**.
5. Skonfiguruj funkcję, w tym kolor i format, gdy są dostępne.
6. Włącz projekcję odpowiedniego modułu.
7. Po zakończeniu wyłącz lub zamknij projekcję, gdy nie jest już potrzebna.

## Co należy zrobić, jeśli telewizor się nie aktualizuje?

Najpierw potwierdź sieć, podłączony odbiornik i aktywną projekcję. Nie zostawiaj tego testu na początek nabożeństwa.

1. Przy użyciu lokalnego P2P sprawdź, czy telewizor/odbiornik i urządzenie sterujące są w tej samej sieci.
2. Sprawdź, czy odbiornik Stage nadal jest otwarty i połączony.
3. W PIANO wyłącz i ponownie włącz projekcję używanego modułu.
4. Przetestuj inny hymn lub werset, aby sprawdzić, czy problem dotyczy tylko jednego elementu.
5. Zamknij i ponownie otwórz połączenie parowania, jeśli zostało przerwane.
6. Gdy to możliwe, przygotuj przewód wideo lub drugi ekran jako plan alternatywny.

## Powiązane

- [Twoje pierwsze nabożeństwo z PIANO](/docs/getting-started)
- [Typowe problemy](/docs/troubleshooting)
- [Skróty klawiaturowe](/docs/shortcuts)
- [Pełny podręcznik](/docs/manual)
