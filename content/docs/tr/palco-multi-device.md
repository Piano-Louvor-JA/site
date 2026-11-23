---
title: Sahne ve çoklu cihazlar
description: TV veya projektör PIANO LouvorJA'nın şarkı sözlerini, ayetlerini ve kaynaklarını gösterirken ibadeti telefon veya bilgisayarla kontrol edin.
nav_order: 10
platform: web
reviewed_at: 2026-11-15
toc: true
---

# Sahne ve çoklu cihazlar

Sahne modunda bir kişi ibadeti bilgisayar veya telefondan kontrol ederken başka bir ekran içeriği kiliseye gösterir. TV, projektör veya Sahne alıcısı yansıtmayı gösterir; kontrol cihazı ise komutları göstermeye devam eder.

## Sahne nedir?

Sahne, ibadetin yansıtılmasını ağ üzerinden alan ekrandır. Projektörden ayrı bir TV için ya da kilisenin harfleri, İncil'i, saati ve geri sayımı, kontrolleri görünür bırakmadan göstermek istemesi durumunda uygundur.

PIANO iki işlevle çalışır:

| İşlev                      | Yapılan iş                                                                           |
| -------------------------- | ------------------------------------------------------------------------------------ |
| Operatör veya uzak kumanda | İlahileri arar, öğeleri açar, slaytları ilerletir ve yansıtmaları açar veya kapatır. |
| Sahne, TV veya projektör   | Cemaate yönelik içeriği görüntüler.                                                  |

Yansıtma ekranı, işlem ekranı olarak kullanılmamalıdır. Bu ekranda yalnızca kilise için seçilen içerik ve görsel stil görünür.

## TV'de ne görünür, kontrolde ne kalır?

TV veya projektör, etkin modülün yansıtmasını alır. Bilgisayar veya telefon, ibadeti yönetmek için gereken düğmeleri ve listeleri saklı tutar.

| İçerik       | TV, projektör veya Sahne                                                      | Kontrol bilgisayarı veya telefonu                               |
| ------------ | ----------------------------------------------------------------------------- | --------------------------------------------------------------- |
| İlahi        | Şarkı sözü, slaytlar, kapak ve yansıtmaya göre bir sonraki dizenin önizlemesi | Arama, ilahi seçimi, oynatıcı, ses ve slayt ilerletme           |
| İncil        | Kendi stiliyle seçilmiş ayet                                                  | Sürüm, kitap, bölüm, ayet seçimi ve kontroller                  |
| Liturji      | Etkin öğenin yansıtılan içeriği                                               | İbadet sırası, kategoriler, tamamlanan öğeler ve notlar         |
| Saat ve süre | Saat, zamanlayıcı veya geri sayım                                             | Renk, biçim, başlatma, duraklatma, işaretler ve sıfırlama ayarı |
| Kura/çekiliş | Sonuç, ses ve animasyon                                                       | İsim, numara veya öğe listesi ve kura komutu                    |

Liturji notları ekibe yöneliktir ve kilise ekranında görünmemelidir.

## Eşleştirmeden önce ağı nasıl hazırlarım?

Yerel eşleştirmeyi kullanmak için kontrol cihazını ve Sahne alıcısını aynı ağa yerleştirin. İbadetten önce TV açıksa eksiksiz bir test yapın.

1. TV veya projektörü ve Sahne'yi gösterecek cihazı açın.
2. PIANO'yu çalıştıracak bilgisayarı açın veya kontrol telefonunu hazırlayın.
3. Hepsini kilisenin aynı Wi‑Fi ağına veya kablolu ağına bağlayın.
4. Cihazların birbirini görmesini engelleyen ziyaretçi ağlarından kaçının.
5. Test sırasında iki cihazın da bağlı kaldığını doğrulayın.
6. Kontrol olarak kullanılacak telefonun yanına şarj cihazını koyun.

Kılavuz iki eşleştirme yolu belirtir: **aynı ağda P2P** ve **sunucu üzerinden**; bunlar ayrı eşleştirme sekmelerinde yer alır. Ekranların ayrıntılı kullanımı ve bağlantı kodları, yüklü sürümden doğrulanmalıdır.

**Arka planda nasıl çalışır (teknik ekip için):** Sahne alıcısı, operatör bilgisayarına bağlanan taraftır, asla tersi değil. PIANO, yerel ağda (P2P) kendi WebSocket bağlantısını açar veya aracı sunucu üzerinden çalışır; Chromecast ya da AirPlay kullanmaz. Her ek TV kendi bağlantı "yuvasını" kaplar; bu sayede birden fazla ekran aynı anda, birbirine karışmadan çalışabilir.

## Telefonu veya başka bir kontrolü nasıl eşleştiririm?

Uzak kumanda alanını açın ve kilisenizin altyapısına uygun eşleştirme yolunu kullanın. Bağlantı sonrasında eşleşen cihaz, Sahne ekranının yerini almadan yansıtmayı kontrol edebilir.

1. Ana bilgisayarda **Uzak Kumanda** veya eşleştirme alanını açın.
2. Kullanılabilir eşleştirme sekmesini seçin: **aynı ağda P2P** veya **sunucu üzerinden**.
3. Telefonda veya diğer bilgisayarda karşılık gelen bağlantı seçeneğini açın.
4. İki cihaz da bağlandığını gösterene kadar PIANO'nun gösterdiği kimlik adımlarını izleyin.
5. Bir test yapın: bir ilahi arayın, açın ve bir slayt ilerletin.
6. Telefonun bataryası veya ağı biterse yedek olarak ana bilgisayarı açık tutun.

Eşleştirmeden sonra uzak kumanda, ilahi arayabilir, albümlü müziği açabilir, ayetleri ilerletebilir, seçimi temizleyebilir, yansıtmayı kapatabilir, zamanlayıcıyı ve geri sayımı başlatabilir, duraklatabilir veya sıfırlayabilir, işaretleri kaydedebilir, saati ayarlayabilir ve her modülün yansıtmasını açıp kapatabilir.

## Sahne'yi TV'ye nasıl bağlarım?

Sahne alıcısı ağa bağlanır ve yansıtmayı görüntüler. TV, operatör bilgisayarından ayrı olduğunda veya ibadet alanında birden fazla ekran olduğunda kullanışlıdır.

1. TV'ye bağlı cihazda Sahne'yi veya alıcıyı açın.
2. Bu cihazı ekibin kullandığı ağa bağlayın.
3. PIANO'da eşleştirme veya Sahne yansıtma seçeneklerini açın.
4. Kullanılabilir alıcıyı seçin veya ona bağlanın.
5. Bir ilahi açın ve **Yansıt**'a tıklayın.
6. Bir slayt ilerletin ve TV'de güncellendiğini doğrulayın.
7. Bir İncil ayetini, saati ve geri sayımı da test edin.

Sahne alıcısı; LG TV (webOS), Samsung TV (Tizen), Android TV/Google TV ve tarayıcılar için mevcuttur. Her ek alıcı ayrı bir ekran olarak görünür: aynı anda birden fazla TV kullanmak için her alıcıyı operatör bilgisayarına bağlayın ve her öğenin hangi ekrana yansıtılacağını seçin — bir TV şarkı sözünü gösterirken diğeri saati veya geri sayımı gösterebilir.

## Bir ilahiyi Sahne'de nasıl yansıtırım?

Sahne bağlandıktan sonra bir ilahiyi yansıtmak, ikinci monitörde kullanılan akışın aynısını izler.

1. Kontrolde **Medya Merkezi**'ni açın.
2. Adventist İlahi Kitabı'ndan bir ilahi, kutsal bir derleme veya ibadet için hazırlanmış başka bir müzik arayın.
3. İlahiyi açın ve şarkı sözünü kontrol edin.
4. **Yansıt**'a tıklayın.
5. Şarkı sözünün TV veya projektörde göründüğünü kontrol edin.
6. İlahiye göre kıtaları, dizeleri ve nakaratları ilerletin.
7. Şarkı sözü seçili değilken, ön lobide kapak ve başlığın uygun olduğundan emin olun.

Şarkı sözü okunması zor ise yansıtma ayarlarını değiştirin: arka plan rengi, metin rengi, boyut, kalınlık, hizalama, arka plan görseli ve metin kutusu.

## İncil'i ve yardımcı araçları nasıl yansıtırım?

Sahne, operatörün kullandığı yansıtma kaynaklarının aynısını gösterebilir. Şabat Okulu, gençlik ibadeti veya tören gibi özel bir programdan önce her kaynağı test edin.

1. İncil için **İncil**'i açın.
2. Sürüm, kitap, bölüm ve ayetleri seçin.
3. **Yansıt**'a tıklayın ve TV'de okumayı kontrol edin.
4. Saat, zamanlayıcı, geri sayım veya kura için **Yardımcı Araçlar**'ı açın.
5. Kaynağı, mevcutsa renk ve biçim dahil, yapılandırın.
6. İlgili modülün yansıtmasını açın.
7. Sonunda, gerek kalmadığında yansıtmayı kapatın veya bitirin.

## TV güncellenmiyorsa ne yapmalıyım?

Önce ağı, bağlı alıcıyı ve etkin yansıtmayı doğrulayın. Bu testi ibadetin başlangıcına bırakmayın.

1. Yerel P2P kullanıyorsanız TV/alıcı ve kontrolün aynı ağda olduğunu kontrol edin.
2. Sahne alıcısının hâlâ açık ve bağlı olduğunu kontrol edin.
3. PIANO'da kullanılan modülün yansıtmasını kapatıp yeniden açın.
4. Sorunun belirli bir öğeden mi kaynaklandığını anlamak için başka bir ilahi veya ayet deneyin.
5. Bağlantı koptuysa eşleştirme bağlantısını kapatıp yeniden açın.
6. Mümkün olduğunda yedek plan olarak bir video kablosu veya ikinci bir ekran bulundurun.

## İlgili sayfalar

- [PIANO ile ilk ibadet](/docs/getting-started)
- [Sık karşılaşılan sorunlar](/docs/troubleshooting)
- [Klavye kısayolları](/docs/shortcuts)
- [Tam kılavuz](/docs/manual)
