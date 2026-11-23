---
title: PIANO LouvorJA'yı Linux'ta Yükleme
description: PIANO LouvorJA'yı Linux'ta AppImage, Snapcraft veya Flathub ile yükleyin, doğru mimariyi seçin ve ibadete hazırlanın.
nav_order: 3
platform: linux
reviewed_at: 2026-11-15
toc: true
---

# PIANO LouvorJA'yı Linux'ta Yükleme

Linux'ta en doğrudan yol resmi AppImage'i indirmektir. Snapcraft'ı da kullanabilirsiniz; Flathub henüz incelemede olduğundan mağazada görünene kadar başka bir resmi kanalı kullanmalısınız.

## Hangi yükleme seçeneğini seçmeliyim?

Kilisenin bilgisayarında halihazırda en iyi çalışan kanalı seçin.

- **AppImage:** resmi sayfadan indirilen tek dosya. İndirme klasörüne erişiminiz olduğunda en basit alternatiftir.
- **Snapcraft:** Snap mağazasını zaten kullanan dağıtımlar için bir seçenek.
- **Flathub:** gönderim incelemede; yalnızca PIANO mağazada mevcut olduğunda kullanın. O zamana kadar AppImage veya Snapcraft'ı seçin.

Tümüne resmi [indirme](/download) sayfasından erişilebilir; bu sayfa yayımlanmış sürümlere yönlendirir.

## ARM64 ile X64 arasında nasıl seçim yapmalıyım?

İndirme sayfası iki AppImage sürümü gösterebilir.

1. Bilgisayarda normal bir Intel veya AMD işlemci varsa **X64**'ü seçin.
2. ARM işlemci varsa **ARM64**'ü seçin.
3. Emin değilseniz, indirmeden önce bilgisayarı önceden kuran birinden yardım isteyin.
4. Rastgele dosyalar denemeyin: yanlış mimariyi kullanmak dosyanın açılmasını engeller.

Intel veya AMD işlemcili kilise bilgisayarları genellikle X64 kullanır.

## AppImage ile nasıl yüklerim?

AppImage, indirip çalıştırma izni verip açtığınız bir dosyadır.

1. [indirme](/download) sayfasını açın.
2. **Linux**'u seçin ve bilgisayara uygun AppImage'i indirin.
3. Dosya yöneticisini açın ve **İndirilenler** klasörüne gidin.
4. AppImage dosyasına sağ tıklayın.
5. **Özellikler**'i seçin.
6. **İzinler** sekmesini açın.
7. **Dosyayı program olarak çalıştırmaya izin ver** benzeri seçeneği işaretleyin.
8. Özellikler penceresini kapatın.
9. PIANO'yu açmak için AppImage'e çift tıklayın.

Seçeneğin adı Linux dağıtımına göre biraz değişebilir. **İzinler**'i ve dosyayı çalıştırma yetkisini arayın.

## Yalnızca terminale erişimim varsa ne yapmalıyım?

Dosya yöneticisini tercih edin. Kilisenin teknik sorumlusu terminal kullanıyorsa, dosyanın kaydedildiği klasörde şu komutla yetki verebilir:

```bash
chmod +x dosya-adi.AppImage
```

Sonrasında dosyayı dosya yöneticisiyle açın. PIANO'nun günlük kullanımı için terminale gerek yoktur.

## Snapcraft ile nasıl yüklerim?

PIANO için yayımlanmış Snapcraft kanalına ulaşmak için resmi indirme sayfasını kullanın.

1. [indirme](/download) sayfasını açın.
2. **Linux** seçeneğini seçin ve Snapcraft kanalını bulun.
3. Mağaza bağlantısını açın.
4. Linux dağıtımınızın veya teknik sorumlunuzun gösterdiği şekilde yüklemeyi tamamlayın.
5. Uygulamalar menüsünde **PIANO LouvorJA**'yı arayın.
6. Uygulamayı açın ve ilk testi yapın.

Snap mağazası yüklü değilse veya bilgisayarda açılmıyorsa, cumartesi günü sistemde değişiklik yapmaya çalışmak yerine AppImage'i kullanın.

## Flathub ile yükleyebilir miyim?

Henüz ana yol olarak hayır. Flathub gönderimi incelemede; kullanılabilirlik mağazanın onayına bağlıdır.

1. [indirme](/download) sayfasını açın.
2. PIANO için aktif bir Flathub düğmesi olup olmadığını kontrol edin.
3. Varsa, düğmeyi açın ve mağazanın kendisinden yükleyin.
4. Düğme yoksa veya sayfa kullanılamaz olduğunu bildiriyorsa AppImage veya Snapcraft kullanın.

Flathub'ı resmi sayfada görmeden önce mevcut olarak kabul etmeyin.

## İlk açılışta ne yapmalıyım?

PIANO'yu ibadetten önce hazırlayın, özellikle internet olmadan kullanılacak içeriği hazırlayın.

1. PIANO LouvorJA'yı açın.
2. Kataloğun ilk hazırlığının tamamlanmasını bekleyin.
3. **Medya Merkezi**'nde Adventist İlahi Kitabı ilahilerini ve programın derlemelerini arayıp indirin.
4. **Litürji** bölümünde kategoriler, ilahiler, İncil ve yerel dosyalarla ibadet sırasını oluşturun.
5. **Ayarlar**'dan projeksiyon stilini ayarlayın.
6. Kilisenin ekranında bir ilhi, bir ayet ve saati test edin.

İndirmeler, litürjiler ve ayarlar cihazda saklanır. Uygulamayı kapatmak hazırlananları silmez.

## AppImage açılmazsa nasıl çözerim?

Önce hiçbir şeyi silmeden temel kontrolleri yapın.

1. Bilgisayarın mimarisi için doğru dosyayı indirdiğinizi doğrulayın.
2. **Özellikler** ve **İzinler**'i tekrar kontrol edin.
3. Dosya USB bellekte veya ağdaysa, **Belgeler** gibi yerel bir klasöre taşıyın.
4. İndirme yarıda kesildiyse yalnızca resmi sayfadan yeniden indirin.
5. Sorun devam ederse, varsa Snapcraft kanalını veya ibadette destesiz kalmamak için web uygulamasını kullanın.

## Ekip için kolay bir kısayol nasıl oluşturulur?

AppImage'i test ettikten sonra, ekibin tanıyacağı bir klasörde tutun.

1. **Belgeler** içinde **PIANO LouvorJA** adında bir klasör oluşturun veya seçin.
2. Test edilmiş AppImage'i bu klasöre taşıyın.
3. Çalışmaya devam ettiğini doğrulamak için yeniden açın.
4. Dosya yöneticisi **Favorilere ekle** veya **Kısayol oluştur** seçeneği sunuyorsa bunu kullanın.
5. Ekibe dosyanın nerede saklandığını bildirin.
6. Dosya açıldı diye kullanılan dosyayı silmeyin; o dosya uygulamanın kendisidir.
7. Benzer isimli birden fazla eski kopya bulundurmaktan kaçının.

## Eksiksiz bir litürji nasıl hazırlanır?

1. **Litürji**'yi açın ve bir program oluşturmayı seçin.
2. İbadetin her anını ayırmak için kategoriler ekleyin.
3. İlailer, yerel medya, bağlantılar veya notlar ekleyin.
4. Ekip süreyi takip etmesi gerekiyorsa kategorilerin saatlerini belirtin.
5. Öğeler son sıraya gelene kadar sürükleyip taşıyın.
6. Kaydedin ve program sorumlusuyla birlikte bir gözden geçirme yapın.
7. İbadet sırasında sırayı takip edin ve tamamlanan öğeleri işaretleyin.

## Nasıl güvenli şekilde projekte edilir?

1. **Medya Merkezi**'nde bir ilahi açın.
2. **Projekte Et**'e tıklayın.
3. İkinci ekranı veya TV'yi kontrol edin.
4. Senkronizasyonu doğrulamak için metni ilerletin.
5. **İncil**'de bir ayet açın ve aynı testi yapın.
6. **Ayarlar**'dan kontrastı ve yazı tipi boyutunu ayarlayın.
7. Testi bitirdiğinizde projeksiyonu sonlandırmak için **ESC**'yi kullanın.

## Kilisede aksaklıklar nasıl önlenir?

1. İndirmeleri ve testleri önceden yapın.
2. Şarj cihazını, video kablosunu ve adaptörü erişilebilir tutun.
3. Projektörün veya TV'nin doğru girişte olduğunu doğrulayın.
4. İbadetten hemen önce Linux dağıtımını güncellemeyin.
5. İnternet varsa web uygulamasını alternatif olarak hazır bulundurun.
6. PIANO'yu nasıl açacağını ikinci bir kişiye anlatın.
7. Ekip bilgisayar değiştirdiğinde ayarların yedeğini alın.

## İbadetten önce son kontrol listesi

1. PIANO'nun seçilen cihazda açıldığını doğrulayın.
2. İlailerin ve materyallerin mevcut olduğunu doğrulayın.
3. Litürjinin doğru sırada olduğunu doğrulayın.
4. Kilisenin ekranının test projeksiyonu aldığını doğrulayın.
5. Salona göre yazı boyutunu ve kontrastı doğrulayın.
6. Gerekli ağ, elektrik ve kabloları doğrulayın.
7. Operasyondan sorumlu bir kişi belirleyin.

## İlgili sayfalar

- [Windows'a yükleme](/docs/install/windows)
- [Tarayıcıda kullanma ve uygulama olarak yükleme](/docs/install/web-pwa)
- [PIANO'yu Android TV ve Google TV'de kullanma](/docs/install/tv-android)
