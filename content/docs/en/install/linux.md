---
title: Install PIANO LouvorJA on Linux
description: Install PIANO LouvorJA on Linux via AppImage, Snapcraft or Flathub, choose the right architecture and have the application ready for the service.
nav_order: 3
platform: linux
reviewed_at: 2026-11-15
toc: true
---

# Install PIANO LouvorJA on Linux

On Linux, the most direct option is to download the official AppImage. You can also use Snapcraft; Flathub is under review and, until it appears in the store, you should use another official channel.

## Which installation option should I choose?

Choose the channel that already works best on the church computer.

- **AppImage:** a single file, downloaded from the official page. It is the simplest alternative when you have access to the downloads folder.
- **Snapcraft:** an option for distributions that already use the Snap store.
- **Flathub:** submission under review; only use it when PIANO is available in the store. Until then, choose AppImage or Snapcraft.

All of them should be accessed from the official [download](/download) page, which points to the published releases.

## How do I choose between ARM64 and X64?

The download page may show two AppImage versions.

1. If the computer uses a common Intel or AMD processor, choose **X64**.
2. If it uses an ARM processor, choose **ARM64**.
3. If you are not sure, ask whoever set up the computer before downloading.
4. Avoid testing random files: using the wrong architecture prevents the app from opening.

Church computers with Intel or AMD usually use X64.

## How do I install using AppImage?

The AppImage is a file you download, authorize to run and open.

1. Open [download](/download).
2. Choose **Linux** and download the AppImage appropriate for the computer.
3. Open the file manager and go to **Downloads**.
4. Right-click the AppImage file.
5. Choose **Properties**.
6. Open the **Permissions** tab.
7. Check the option similar to **Allow executing file as program**.
8. Close the properties window.
9. Double-click the AppImage to open PIANO.

The option name may vary slightly depending on the Linux distribution. Look for **Permissions** and the authorization to execute the file.

## What if I only have terminal access?

Prefer the file manager. If the church's technical person uses the terminal, they can authorize the file with this command, in the folder where it was saved:

```bash
chmod +x file-name.AppImage
```

Then open the file through the file manager. Using the terminal in the day-to-day operation of PIANO is not necessary.

## How do I install from Snapcraft?

Use the official download page to reach the Snapcraft channel published for PIANO.

1. Open [download](/download).
2. Choose the **Linux** option and locate the Snapcraft channel.
3. Open the store link.
4. Follow the installation shown by your Linux distribution or by the technical person in charge.
5. Look for **PIANO LouvorJA** in the applications menu.
6. Open the application and run the initial test.

If the Snap store is not installed or does not open on the computer, use the AppImage instead of trying to change the system on Sabbath.

## Can I install from Flathub?

Not yet as the main path. The Flathub submission is under review; availability depends on the store's approval.

1. Open [download](/download).
2. Check whether there is an active Flathub button for PIANO.
3. If there is, open the button and install from the store itself.
4. If there is no button or the page reports unavailability, use AppImage or Snapcraft.

Do not treat Flathub as available before seeing it on the official page.

## What should I do on first launch?

Prepare PIANO before the service, especially the content that will be used without internet.

1. Open PIANO LouvorJA.
2. Wait for the initial catalog preparation.
3. In the **Media Center**, search for and download the hymns from the Adventist Hymnal and the songbooks of the program.
4. In **Liturgy**, create the order of the service with categories, songs, Bible and local files.
5. In **Settings**, adjust the projection style.
6. Test a hymn, a Bible verse and the clock on the church screen.

Downloads, liturgies and settings are saved on the device. Closing the application does not erase what has already been prepared.

## How do I fix an AppImage that does not open?

Check the basics first, without deleting anything.

1. Confirm that you downloaded the correct file for the computer's architecture.
2. Check **Properties** and **Permissions** again.
3. Move the file to a local folder, such as **Documents**, if it is on a pendrive or network share.
4. Download again only from the official page if the download was interrupted.
5. If the problem persists, use the Snapcraft channel, if available, or the web app so you are not left without support during the service.

## How do I leave an easy shortcut for the team?

After testing the AppImage, keep it in a folder the team recognizes.

1. Create or choose a folder named **PIANO LouvorJA** in **Documents**.
2. Move the tested AppImage into that folder.
3. Open it again to confirm it still works.
4. If the file manager offers **Add to favorites** or **Create shortcut**, use that option.
5. Tell the team where the file is stored.
6. Do not delete the file in use just because it opened; it is the application.
7. Avoid having several old copies with similar names.

## How do I prepare a complete liturgy?

1. Open **Liturgy** and choose to create a program.
2. Add categories to separate each moment of the service.
3. Add songs, local media, links or notes.
4. Enter category times when the team needs to track the schedule.
5. Drag the items until they are in the final order.
6. Save and review together with the person in charge of the program.
7. During the service, follow the sequence and mark completed items.

## How do I project reliably?

1. Open a hymn in the **Media Center**.
2. Click **Project**.
3. Check the second screen or TV.
4. Advance the text to verify synchronization.
5. Open a verse in the **Bible** and run the same test.
6. Adjust contrast and font size in **Settings**.
7. Use **ESC** to end the projection when the test is done.

## How do I avoid surprises at church?

1. Do downloads and tests in advance.
2. Keep the charger, video cable and adapter accessible.
3. Confirm that the projector or TV is on the correct input.
4. Do not update the Linux distribution right before the service.
5. Keep the web app available as an alternative if there is internet.
6. Explain to a second person how to open PIANO.
7. Keep a backup of the settings when the team switches computers.

## Final checklist before the service

1. Confirm that PIANO opens on the chosen device.
2. Confirm that hymns and materials are available.
3. Confirm that the liturgy is in the correct order.
4. Confirm that the church screen receives a test projection.
5. Confirm text size and contrast against the hall's background.
6. Confirm network, power and the necessary cables.
7. Leave one person in charge of the operation.

## Related

- [Install on Windows](/docs/install/windows)
- [Use in the browser and install as an app](/docs/install/web-pwa)
- [Use PIANO on Android TV and Google TV](/docs/install/tv-android)
