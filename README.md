# Bols Café Gyula — webdesign-koncepció

Független, statikus webdesign-demo a gyulai Bols Café számára. Nem a vállalkozás hivatalos weboldala, nem áll kapcsolatban vele, és nem használható hivatalos oldalként a café engedélye nélkül.

A projekt célja egy konkrét hiányosság bemutatása: a café aktuális napi/heti menüje jelenleg nem olvasható a saját weboldalán, csak egy Facebook-csoportban. A demo egy gyorsan frissíthető, mobilon jól olvasható napi menü szekciót mutat be, mintával.

**Élő demó:** https://archimre.github.io/bols-cafe-gyula/ — nyilvánosan elérhető, de `noindex` jelöléssel. A link nem titkos; csak a bemutatás céljára ossza meg.

## Futtatás

A legegyszerűbb:

```bash
cd website-mockups/bols-cafe-gyula
python3 -m http.server 8000
```

Ezután nyissa meg a `http://localhost:8000` címet. A `index.html` közvetlen megnyitása is működik, mert nincs build lépés és nincs külső függőség.

## Demó mód

- A láblécben a **Demó mód · napi menü előnézet** gomb nyitja meg a vezérlőt.
- Választható nap (hétfő–vasárnap) és állapot: teljes minta, csak leves, nincs közzétett menü.
- Az előnézet csak a böngészőben változik; nincs backend, adatbázis vagy mentés.
- Közvetlen link: `index.html?demo=1` vagy `index.html#demo`.

## Fájlok

```
bols-cafe-gyula/
├── index.html
├── styles.css
├── script.js
├── README.md
└── assets/
    ├── favicon.svg
    ├── hero-goulash.jpg / .webp
    ├── hero-goulash-600.jpg / .webp
    └── fonts/ (Fraunces + Work Sans, WOFF2 + OFL licence)
```

## Közzététel GitHub Pages-en

1. Hozzon létre egy külön repositoryt, és a **jelen mappa tartalmát** tegye a repository gyökerébe (a `website-mockups` mappa egésze nem jó, mert a GitHub Pages csak a gyökeret vagy a `/docs` mappát szolgálja ki).
2. `git add . && git commit -m "Bols Café Gyula webdesign concept" && git push`.
3. GitHub → Settings → Pages → Source: **Deploy from a branch**, Branch: `main`, Folder: `/ (root)`.
4. A demo `noindex, nofollow` metát tartalmaz, hogy ne versenyezzen a hivatalos oldallal. Ezt csak a café írásos engedélyével és hivatalos átadás után érdemes eltávolítani.

GitHub Actions vagy build nem szükséges.

## 1. fázis — domainvizsgálat (2026. 10. 22.)

| Cím | Eredmény |
| --- | --- |
| `bolscafegyula.hu` DNS | A rekord: `185.129.138.39`; a név feloldódik. |
| `http://bolscafegyula.hu` | HTTP 200, működő WordPress oldal (Aruba proxy, WordPress 5.4.24). |
| `https://bolscafegyula.hu` | TLS hiba: a tanúsítvány `*.forpsi.org` névre szól, 2024. 11. 24-én lejárt, és nem tartalmazza a domaint. `curl -k` mellett 301 átirányítás `http://`-re. |
| `http://www.bolscafegyula.hu` | 301 → `http://bolscafegyula.hu/` (WordPress átirányítás). |
| `https://www.bolscafegyula.hu` | Ugyanaz a tanúsítványhiba. |
| `bolscafe.hu`, `www.bolscafe.hu` | Nem oldódik fel (NXDOMAIN / nincs A rekord). |
| `https://bolscafe.hu`, `http://bolscafe.hu` | Nem elérhető, mert a név nem oldódik fel. |

**Diagnózis:** nem DNS-hiba. A HTTP működik; a HTTPS hibás a rossz/lejárt tanúsítvány miatt, és a szerver HTTP-re irányít. A nyomtatott 2026-os étlapon szereplő `www.bolscafe.hu` domain ezzel szemben egyáltalán nem létezik. A valós domain a `bolscafegyula.hu`.

**A meglévő oldal erősségei:** teljes étlap árakkal, pizzák három méretben, itallap, elérhetőség, Google Térkép-beágyazás, családi vállalkozás bemutatása, Facebook-hivatkozás, mobil viewport.

**Hiányosságok, amelyekre a demo épül:**

1. A **Heti menü** oldal nem tartalmaz menüt; csak a Facebook-csoportba irányít. Ott a tartalom bejelentkezés mögött lehet, nem indexelhető, és nem olvasható kényelmesen telefonon.
2. A HTTPS nem használható, ezért a böngészők figyelmeztetnek; a jelszó nélküli, nyilvános oldal is bizalmat veszít.
3. A 2026-os PDF-en szereplő `www.bolscafe.hu` nem létezik; a nyomtatott anyag rossz címre küldi a vendégeket.
4. A WordPress 5.4.24-es, 2020-as verziója és a 2020-as copyright nem sugall friss üzemeltetést.
5. A nyilvános nyitvatartási adatok eltérnek (a hivatalos oldal 2020-as adatai vs. 2026-os directory-listingek), ami bizalmi problémát okoz.

## Ellenőrzött tények és források

- **Név:** Bols Café – Gyula; a 2026-os étlapon: „BOLS Étterem, Pizzéria és Koktélbár”. Forrás: bolscafegyula.hu, 2026-os étlap.
- **Cím:** 5700 Gyula, Kossuth utca 1/B. Forrás: bolscafegyula.hu/elerhetoseg, Visit Gyula, szallas.hu. Megjegyzés: a 2026-os PDF egyik grafikai oldalán „1/6” szerepel, a szöveges oldalakon és a többi forrásban „1/B”; a demó az 1/B-t használja.
- **Telefon:** +36 30 978 7407 (elsődleges, több forrásban), +36 66 642 634 (hivatalos oldal, szallas.hu).
- **Nyitvatartás:** hétfő–csütörtök 09:00–20:00, péntek 09:00–21:00, szombat 10:00–22:00, vasárnap 10:00–20:00. Forrás: bolscafegyula.hu/elerhetoseg, **2020-as közzététel**. Az oldal ezért láthatóan jelöli, hogy az adat 2020-as, és telefonon ellenőrizendő.
- **Napi menü:** a 2026-os étlap szerint „MENÜ A HÉT MINDEN NAPJÁN – SZOMBAT VASÁRNAP IS!”. A tényleges napi fogások a demóban nem elérhetők, ezért mintaként jelennek meg.
- **Étlapárak:** a 2026-os PDF-ből: csontleves 1 300 Ft; bográcsgulyás és babgulyás 2 950 Ft; rántott csirkemell 3 500 Ft; roston csirkemell 3 800 Ft; rántott sertéskaraj 3 500 Ft; roston sertéstarja 3 800 Ft; marhapörkölt galuskával 5 200 Ft; carbonara 3 500 Ft; Bols saláta 3 600 Ft; pizzák 2 600–9 400 Ft mérettől függően; hamburgerek 2 800 Ft; extra feltét 500 Ft; csomagolás 200 Ft.
- **Facebook-csoport:** `https://facebook.com/groups/160336224011913/` — a hivatalos oldalról linkelve.
- **Források:** bolscafegyula.hu (2020-as oldal + 2026-os PDF a Visit Gyula oldalról), visitgyula.com/hu/latnivalok-adatlap/bols-cafe, szallas.hu/programok/bols-cafe-gyula-p9262 (kiegészítő directory, nem elsődleges forrás).

## Mintaadatok, amelyek nem valósak

- A napi menü összeállítása (melyik nap melyik leves/főétel).
- A napi menü ára (2 690–3 290 Ft) és a „csak leves” ár.
- A napi menü frissítésének mechanizmusa és a demó előnézet.
- A „2026-os” oldal dizájnja, a szövegek és a vizuális identitás; a logó helyett saját tipográfiai jelzés van.

A fogásnevek és az à la carte árak a 2026-os étlapból származnak, de a napi menüben való szerepeltetésük minta. A nyitvatartás 2020-as, ezért nem „mai” adatként jelenik meg.

## Hozzáférés és minőség

- Nincs framework, build, backend, adatbázis, API-kulcs vagy kötelező külső szolgáltatás.
- A betűtípusok és a hero kép helyben vannak; a Google Térkép és a Facebook csak hivatkozásként jelenik meg, nem beágyazott követőként.
- A napi menü JavaScripttel működik; a statikus HTML tartalmaz egy tartalék mintamenüt, így JavaScript nélkül is látható valami.
- Billentyűzet: skip link, látható fókuszgyűrű, mobil menü `aria-expanded`-del, natív `<dialog>` és Escape-kezelés.
- `prefers-reduced-motion` esetén az animációk gyakorlatilag kikapcsolnak.
- A HTML `lang="hu"`, a dátumok magyar `Intl` formátumban jelennek meg.
- Lighthouse (mobilos, snapshot): Accessibility 100, Best Practices 100. A robots.txt/llms.txt figyelmeztetés csak a helyi `file://` megnyitásból és a szándékos `noindex`-ből adódik, nem éles hiba.
- Ellenőrzött töréspontok: 390 px (elsődleges mobil), 768 px (tablet), 1440 px (desktop); 320 px-en nincs vízszintes túlcsordulás.

## Képek és betűtípusok

- Hero fotó: **Hu Totya**, „Hungarian goulash soup”, CC BY-SA 3.0, Wikimedia Commons. A kivágott változat ugyanezen licenc alatt használható. A fotó illusztráció, nem a Bols Café tényleges étele/helye.
- Fraunces és Work Sans: SIL Open Font License, Google Fonts. A WOFF2 fájlok helyben vannak a Google Fonts CDN-ről letöltve, a licencszövegek az `assets/fonts/` mappában. A CSS-be ágyazott, részhalmazra vágott példányok miatt a betűtípusok `file://` megnyitáskor is betöltődnek, CORS-hiba nélkül.

## Következő lépés egy valódi megbízás felé

1. Keresse meg a tulajdonost telefonon vagy személyesen, és mutassa meg a demót egy külön linken (GitHub Pages + `noindex`). A link nyilvános, ezért csak a bemutatáshoz szükséges körben ossza meg.
2. Kérjen írásos engedélyt a név, az étlap és a fotók használatára; tisztázza, ki frissíti a napi menüt.
3. Ha van érdeklődés, az első fizetett fázis: HTTPS és tanúsítvány javítása, a nyomtatott `www.bolscafe.hu` cím helyreállítása/átirányítása, majd a napi menü feltöltési folyamatának kialakítása (akár egy egyszerű, jelszóval védett szerkesztő vagy egy szerkesztő által frissített statikus JSON).
4. Az oldal hivatalossá tétele csak a café jóváhagyásával: a „koncepció” jelölések és a `noindex` eltávolítása, valódi fotók és logó használata engedéllyel, adatvédelmi és impresszum információk ellenőrzése.
5. Fenntartási modell: egyszeri építési díj + havi karbantartás (menüfrissítés, hibajavítás, domain/HTTPS felügyelet), szerződéssel és egyértelmű felelősségi körrel.

A demó nem hivatalos, és nem szabad úgy publikálni, mintha a café saját oldala lenne.
