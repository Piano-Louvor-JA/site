---
title: Instalar PIANO LouvorJA en Linux
description: Instala PIANO LouvorJA en Linux mediante AppImage, Snapcraft o Flathub, elige la arquitectura correcta y deja la aplicación lista para el culto.
nav_order: 3
platform: linux
reviewed_at: 2026-11-15
toc: true
---

# Instalar PIANO LouvorJA en Linux

En Linux, la opción más directa es descargar el AppImage oficial. También puedes usar Snapcraft; Flathub está en revisión y, mientras no aparezca en la tienda, debes usar otro canal oficial.

## ¿Qué opción de instalación debo elegir?

Elige el canal que ya funcione mejor en la computadora de la iglesia.

- **AppImage:** archivo único, descargado desde la página oficial. Es la alternativa más sencilla cuando tienes acceso a la carpeta de descargas.
- **Snapcraft:** opción para distribuciones que ya usan la tienda Snap.
- **Flathub:** envío en revisión; úsalo solo cuando PIANO esté disponible en la tienda. Hasta entonces, elige AppImage o Snapcraft.

Todos deben accederse desde la página oficial de [descarga](/download), que apunta a las versiones publicadas.

## ¿Cómo elegir entre ARM64 y X64?

La página de descarga puede mostrar dos versiones de AppImage.

1. Si la computadora usa un procesador Intel o AMD común, elige **X64**.
2. Si usa un procesador ARM, elige **ARM64**.
3. Si no lo sabes, pide ayuda a quien configuró la computadora antes de descargar.
4. Evita probar archivos al azar: usar la arquitectura incorrecta impide que se abra.

Las computadoras de iglesia con Intel o AMD normalmente usan X64.

## ¿Cómo instalar usando AppImage?

El AppImage es un archivo que descargas, autorizas a ejecutar y abres.

1. Abre [descarga](/download).
2. Elige **Linux** y descarga el AppImage adecuado para la computadora.
3. Abre el gestor de archivos y entra en **Descargas**.
4. Haz clic derecho en el archivo AppImage.
5. Elige **Propiedades**.
6. Abre la pestaña **Permisos**.
7. Marca la opción similar a **Permitir ejecutar el archivo como programa**.
8. Cierra la ventana de propiedades.
9. Haz doble clic en el AppImage para abrir PIANO.

El nombre de la opción puede cambiar un poco según la distribución Linux. Busca **Permisos** y la autorización para ejecutar el archivo.

## ¿Y si solo tengo acceso a la terminal?

Prefiere el gestor de archivos. Si el responsable técnico de la iglesia usa la terminal, puede autorizar el archivo con este comando, en la carpeta donde fue guardado:

```bash
chmod +x nombre-del-archivo.AppImage
```

Después, abre el archivo desde el gestor de archivos. No es necesario usar la terminal en el día a día de PIANO.

## ¿Cómo instalar mediante Snapcraft?

Usa la página oficial de descarga para llegar al canal Snapcraft publicado para PIANO.

1. Abre [descarga](/download).
2. Elige la opción **Linux** y localiza el canal Snapcraft.
3. Abre el enlace de la tienda.
4. Sigue la instalación que muestre tu distribución Linux o el responsable técnico.
5. Busca **PIANO LouvorJA** en el menú de aplicaciones.
6. Abre la aplicación y haz la prueba inicial.

Si la tienda Snap no está instalada o no abre en la computadora, usa el AppImage en lugar de intentar modificar el sistema durante el sábado.

## ¿Puedo instalar mediante Flathub?

Todavía no como camino principal. El envío a Flathub está en revisión; la disponibilidad depende de la aprobación de la tienda.

1. Abre [descarga](/download).
2. Verifica si hay un botón activo de Flathub para PIANO.
3. Si lo hay, abre el botón e instala desde la propia tienda.
4. Si no hay botón o la página indica que no está disponible, usa AppImage o Snapcraft.

No consideres Flathub disponible antes de verlo en la página oficial.

## ¿Qué hacer en la primera apertura?

Prepara PIANO antes del culto, especialmente el contenido que se usará sin internet.

1. Abre PIANO LouvorJA.
2. Espera la preparación inicial del catálogo.
3. En la **Central de Medios**, busca y descarga los himnos del Himnario Adventista y las colecciones de la programación.
4. En **Liturgia**, crea la secuencia del culto con categorías, músicas, Biblia y archivos locales.
5. En **Configuraciones**, ajusta el estilo de la proyección.
6. Prueba un himno, un versículo y el reloj en la pantalla de la iglesia.

Las descargas, liturgias y configuraciones quedan guardadas en el aparato. Cerrar la aplicación no borra lo que ya fue preparado.

## ¿Cómo resolver si el AppImage no abre?

Verifica primero lo básico, sin borrar nada.

1. Confirma que descargaste el archivo correcto para la arquitectura de la computadora.
2. Revisa nuevamente **Propiedades** y **Permisos**.
3. Mueve el archivo a una carpeta local, como **Documentos**, si está en un pendrive o en la red.
4. Descarga otra vez solo desde la página oficial si la descarga fue interrumpida.
5. Si persiste, usa el canal Snapcraft, si está disponible, o la app web para no quedarte sin apoyo en el culto.

## ¿Cómo dejar un acceso directo fácil para el equipo?

Después de probar el AppImage, mantenlo en una carpeta que el equipo reconozca.

1. Crea o elige una carpeta llamada **PIANO LouvorJA** en **Documentos**.
2. Mueve el AppImage probado a esa carpeta.
3. Ábrelo nuevamente para confirmar que sigue funcionando.
4. Si el gestor de archivos ofrece **Añadir a favoritos** o **Crear acceso directo**, usa esa opción.
5. Informa al equipo dónde está guardado el archivo.
6. No borres el archivo usado solo porque ya abrió; ese archivo es la aplicación.
7. Evita tener varias copias antiguas con nombres parecidos.

## ¿Cómo preparar una liturgia completa?

1. Abre **Liturgia** y elige crear una programación.
2. Añade categorías para separar cada momento del culto.
3. Añade músicas, medios locales, enlaces o anotaciones.
4. Indica los horarios de las categorías cuando el equipo necesite seguir el tiempo.
5. Arrastra los elementos hasta quedar en el orden final.
6. Guarda y haz una revisión junto con el responsable del programa.
7. Durante el culto, sigue la secuencia y marca los elementos concluidos.

## ¿Cómo proyectar con seguridad?

1. Abre un himno en la **Central de Medios**.
2. Haz clic en **Proyectar**.
3. Verifica la segunda pantalla o TV.
4. Avanza el texto para comprobar la sincronización.
5. Abre un versículo en la **Biblia** y haz la misma prueba.
6. Ajusta el contraste y el tamaño de la fuente en **Configuraciones**.
7. Usa **ESC** para terminar la proyección cuando concluya la prueba.

## ¿Cómo evitar imprevistos en la iglesia?

1. Haz las descargas y pruebas con anticipación.
2. Mantén el cargador, el cable de video y el adaptador accesibles.
3. Confirma que el proyector o TV esté en la entrada correcta.
4. No actualices la distribución Linux inmediatamente antes del culto.
5. Deja la app web disponible como alternativa si hay internet.
6. Explícale a una segunda persona cómo abrir PIANO.
7. Guarda una copia de seguridad de las configuraciones cuando el equipo cambie de computadora.

## Lista de verificación final antes del culto

1. Confirma que PIANO abre en el aparato elegido.
2. Confirma que los himnos y materiales están disponibles.
3. Confirma que la liturgia está en el orden correcto.
4. Confirma que la pantalla de la iglesia recibe una proyección de prueba.
5. Confirma el tamaño de letra y el contraste al fondo del salón.
6. Confirma la red, la energía y los cables necesarios.
7. Deja una persona responsable de la operación.

## Relacionados

- [Instalar en Windows](/docs/install/windows)
- [Usar en el navegador e instalar como app](/docs/install/web-pwa)
- [Usar PIANO en Android TV y Google TV](/docs/install/tv-android)
