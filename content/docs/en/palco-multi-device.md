---
title: Stage and multiple devices
description: Use a phone or computer to control the service while the TV or projector displays lyrics, Bible verses and PIANO LouvorJA features.
nav_order: 10
platform: web
reviewed_at: 2026-11-15
toc: true
---

# Stage and multiple devices

In Stage mode, one person controls the service from a computer or phone and another screen displays the content for the congregation. The TV, projector or Stage receiver shows the projection; the control device keeps showing the commands.

## What is the Stage?

The Stage is the screen that receives the worship projection over the network. It is recommended for a TV separate from the projector, or for churches that want to show lyrics, Bible, clock and countdown without leaving the controls visible.

PIANO works with two roles:

| Role                       | What it does                                                                  |
| -------------------------- | ----------------------------------------------------------------------------- |
| Operator or remote control | Searches hymns, opens items, advances slides and turns projections on or off. |
| Stage, TV or projector     | Displays the content intended for the congregation.                           |

The projection screen should not be used as the operation screen. Only the content and the visual style chosen for the church appear on it.

## What appears on the TV and what stays on the control?

The TV or projector receives the projection of the active module. The computer or phone keeps the buttons and lists needed to lead the service.

| Content        | TV, projector or Stage                                                    | Control computer or phone                                   |
| -------------- | ------------------------------------------------------------------------- | ----------------------------------------------------------- |
| Hymn           | Lyrics, slides, cover and next-phrase preview according to the projection | Search, hymn selection, player, volume and slide advance    |
| Bible          | Selected verse with its own style                                         | Version, book, chapter and verse choice and controls        |
| Liturgy        | Projected content of the active item                                      | Order of the service, categories, completed items and notes |
| Clock and time | Clock, timer or countdown                                                 | Color and format settings, start, pause, marks and reset    |
| Draw           | Result, sound and animation                                               | List of names, numbers or items and the draw command        |

Liturgy notes are for the team and should not appear on the church screen.

## How do I prepare the network before pairing?

To use local pairing, put the control device and the Stage receiver on the same network. Before the service, run a complete test with the TV already on.

1. Turn on the TV or projector and the device that will display the Stage.
2. Turn on the computer that will run PIANO or prepare the control phone.
3. Connect all of them to the same Wi‑Fi or wired church network.
4. Avoid guest networks that prevent devices from seeing each other.
5. Confirm that both devices stay connected during the test.
6. Keep the charger near the phone that will be used as the control.

The manual describes two pairing methods: **P2P on the same network** and **via server**, in separate pairing tabs. The detailed use of the screens and the connection codes need to be confirmed in the installed version.

**How it works underneath (for the technical team):** the Stage receiver is the one that connects to the operator computer, never the other way around. PIANO opens its own WebSocket connection on the local network (P2P) or via an intermediate server; it does not use Chromecast or AirPlay. Each additional TV occupies its own connection "slot", allowing multiple screens at the same time without interfering with each other.

## How do I pair the phone or another control?

Open the remote control area and use the pairing method appropriate for the church's setup. After connecting, the paired device can control the projection without replacing the Stage screen.

1. On the main computer, open the **Remote Control** or pairing area.
2. Choose the available pairing tab: **P2P on the same network** or **via server**.
3. On the phone or another computer, open the corresponding connection option.
4. Follow the identification displayed by PIANO until both devices indicate they are connected.
5. Run a test: search for a hymn, open it and advance one slide.
6. Keep the main computer open as an alternative if the phone loses battery or network.

Once paired, the remote control can search hymns, open a song with its album, advance verses, clear the selection, close the projection, start, pause or reset the timer and countdown, save marks, set the clock and turn the projection of each module on or off.

## How do I connect the Stage to the TV?

The Stage receiver connects to the network and displays the projection. It is useful when the TV is separate from the operator computer or when there is more than one screen in the worship space.

1. Open the Stage or receiver on the device connected to the TV.
2. Connect that device to the network used by the team.
3. In PIANO, open the Stage pairing or projection options.
4. Select or connect the available receiver.
5. Open a hymn and click **Project**.
6. Advance one slide and confirm the update on the TV.
7. Also test a Bible verse, the clock and the countdown.

The Stage receiver exists for LG TV (webOS), Samsung TV (Tizen), Android TV/Google TV and browsers. Each additional receiver appears as a separate screen: to use more than one TV at the same time, connect each receiver to the operator computer and choose which screen each item is projected to — one TV can show the lyrics while another shows the clock or the countdown.

## How do I project a hymn on the Stage?

Once the Stage is connected, projecting a hymn follows the same flow used with a second monitor.

1. On the control, open **Media Center**.
2. Search for a hymn from the Adventist Hymnal, a sacred songbook or another song prepared for the service.
3. Open the hymn and check the lyrics.
4. Click **Project**.
5. Check that the lyrics appear on the TV or projector.
6. Advance verses, lines and choruses as the congregation sings.
7. When no lyric is selected, check that the cover and title are suitable for the pre-service screen.

If the lyrics are hard to read, change the projection settings: background color, text color, size, weight, alignment, background image and text box.

## How do I project the Bible and utilities?

The Stage can show the same projection features used by the operator. Test each feature before a special program, such as Sabbath School, youth service or a ceremony.

1. For the Bible, open **Bible**.
2. Choose the version, book, chapter and verses.
3. Click **Project** and check the readability on the TV.
4. For clock, timer, countdown or draw, open **Utilities**.
5. Configure the feature, including color and format when available.
6. Turn on the projection of the corresponding module.
7. At the end, turn off or close the projection when it is no longer needed.

## What should I do if the TV does not update?

First confirm the network, the connected receiver and the active projection. Do not leave this test until the start of the service.

1. Check that the TV/receiver and the control are on the same network, when using local P2P.
2. Check that the Stage receiver is still open and connected.
3. In PIANO, turn the projection of the module in use off and on again.
4. Test another hymn or verse to find out whether the problem is specific to one item.
5. Close and reopen the pairing connection if it has dropped.
6. Have a video cable or a second screen as an alternative plan when possible.

## Related

- [Your first worship service with PIANO](/docs/getting-started)
- [Common problems](/docs/troubleshooting)
- [Keyboard shortcuts](/docs/shortcuts)
- [Complete manual](/docs/manual)
