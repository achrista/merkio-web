// Build-Skript für merkio.de – generiert statische, mehrsprachige Seiten
// aus EINER Quelle: /index.html (de), /en/index.html, /fr/index.html.
// Aufruf:  node build.mjs
// Inhalte stehen damit statisch im HTML (gut für Suchmaschinen UND KI-Crawler,
// die kein JavaScript ausführen), inkl. hreflang, canonical und JSON-LD.

import { writeFileSync, mkdirSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const ROOT = dirname(fileURLToPath(import.meta.url))
const SITE = 'https://merkio.de'
const YEAR = new Date().getFullYear()
const APK = 'https://github.com/achrista/merkio-web/releases/latest/download/merkio.apk'
const APP = 'https://app.merkio.de'

const LANGS = ['de', 'en', 'fr']
const pathFor = (l) => (l === 'de' ? '/' : `/${l}/`)
const OG_LOCALE = { de: 'de_DE', en: 'en_US', fr: 'fr_FR' }

/* ────────────────────────────── Inhalte ────────────────────────────── */
const C = {
  de: {
    title: 'merkio – Gemeinsame Einkaufs- & To-do-Listen in Echtzeit teilen',
    desc: 'merkio – teile Einkaufslisten, To-do-Listen und Notizen in Echtzeit mit Familie, WG oder Verein. Kostenlos als Web-App im Browser (auch iPhone) oder als Android-App.',
    heroH1: 'Gemeinsame Listen,<br><span class="accent">in Echtzeit geteilt</span>',
    lead: '<strong class="lead-hook">Nie wieder etwas vergessen.</strong> Mit merkio organisierst du Einkäufe, Aufgaben und gemeinsame Projekte – in der Familie, der WG, im Verein oder einfach für dich selbst. Teile Listen mit anderen, verteile Aufgaben und behalte jederzeit den Überblick. So wird nichts mehr vergessen, nichts doppelt gekauft und das nächste Grillfest läuft entspannt.',
    btnWeb: 'Web-App öffnen',
    btnAndroid: 'Android-App (APK)',
    btnNoteWeb: 'Kostenlos · ohne Installation · auch für iPhone & iPad',
    btnNoteAndroid: 'Kostenlos · Android 7.0 oder neuer (APK)',
    featuresTitle: 'Was merkio kann',
    features: [
      { icon: '⚡', title: 'Echtzeit-Sync', desc: 'Hakt jemand einen Artikel ab, sehen es alle sofort – ohne Aktualisieren.' },
      { icon: '👨‍👩‍👧', title: 'Gruppen', desc: 'Lade Familie oder Mitbewohner per Einladungscode oder Link ein.' },
      { icon: '🍝', title: 'Rezept-Import', desc: 'Rezept einfügen oder nur das gewünschte Gericht angeben – die Zutaten landen automatisch auf der Einkaufsliste.' },
      { icon: '🏪', title: 'Nach Markt sortiert', desc: 'Ordne Artikel Geschäften zu oder gruppiere nach Kategorien – deren Reihenfolge du per Ziehen an deinen Supermarkt anpasst.' },
      { icon: '✅', title: 'To-do-Listen', desc: 'Aufgaben mit Prioritäten (A/B/C), Fälligkeit und Zuständigkeit – fällige werden farblich hervorgehoben.' },
      { icon: '📝', title: 'Notizen', desc: 'Notizlisten mit frei formatierbarem Text – fett, kursiv, unterstrichen, Aufzählungen und Textfarben.' },
      { icon: '📴', title: 'Offline-fähig', desc: 'Kein Empfang im Supermarkt? Die Android-App funktioniert auch offline – Änderungen werden automatisch synchronisiert, sobald du wieder online bist.' },
      { icon: '🌍', title: 'Mehrsprachig', desc: 'Komplett auf Deutsch, Englisch und Französisch – inkl. passender Supermärkte je Land.' },
      { icon: '🔔', title: 'Benachrichtigungen', desc: 'Push-Hinweise, wenn sich auf deinen Listen etwas tut.' },
      { icon: '🎁', title: 'Kostenlos', desc: 'merkio ist komplett kostenlos – ohne Werbung, ohne versteckte Kosten und ohne Abo. Einfach loslegen.' },
    ],
    usageTitle: 'So nutzt du merkio',
    web: {
      title: 'Web-App (im Browser)',
      desc: 'Sofort einsatzbereit auf Handy, Tablet und PC – ganz ohne Installation. Auch für iPhone und iPad.',
      steps: ['Öffne <code>app.merkio.de</code> in deinem Browser.', 'Konto anlegen, dann Gruppe erstellen oder per Code beitreten.', 'Optional über das Browser-Menü „Zum Startbildschirm hinzufügen“ – dann startet merkio wie eine echte App.'],
      installTitle: '📲 Als App auf dem Startbildschirm installieren',
      installIphone: '<strong>iPhone/iPad:</strong> <code>app.merkio.de</code> in <strong>Safari</strong> öffnen → Teilen-Symbol <span aria-hidden="true">⎋</span> (Quadrat mit Pfeil nach oben) antippen → „<strong>Zum Home-Bildschirm</strong>“ wählen → „Hinzufügen“. merkio erscheint dann mit eigenem Symbol wie eine normale App.',
      installAndroidBrowser: '<strong>Android (Browser):</strong> In Chrome das Menü <span aria-hidden="true">⋮</span> öffnen → „<strong>App installieren</strong>“ bzw. „Zum Startbildschirm hinzufügen“.',
      cta: 'Web-App öffnen',
    },
    android: {
      title: 'Android-App',
      desc: 'Native App als Direkt-Download – mit Push-Benachrichtigungen.',
      steps: ['Tippe auf „Android-App (APK)“ – die Datei <code>merkio.apk</code> wird gespeichert.', 'Beim Öffnen die Installation aus unbekannter Quelle erlauben, wenn Android fragt.', 'App öffnen, Konto anlegen, Gruppe erstellen oder beitreten – fertig.'],
      cta: 'APK herunterladen',
    },
    hint: '<strong>Hinweis:</strong> Beide Varianten nutzen dasselbe Konto und dieselben Listen – du kannst frei zwischen Web-App und Android-App wechseln. Die Android-App wird als Direkt-Download außerhalb des Play Stores angeboten und stammt direkt vom Entwickler.',
    faqTitle: 'Häufige Fragen',
    faq: [
      { q: 'Wie kann ich eine Einkaufsliste in Echtzeit mit anderen teilen?', a: 'Erstelle in merkio eine Gruppe und lade Familie, Mitbewohner oder Vereinsmitglieder per Einladungscode oder Link ein. Jede Änderung – etwa ein abgehakter Artikel – erscheint sofort bei allen Mitgliedern, ganz ohne die Seite zu aktualisieren.' },
      { q: 'Ist merkio wirklich kostenlos?', a: 'Ja. merkio ist komplett kostenlos – ohne Werbung, ohne versteckte Kosten und ohne Abo.' },
      { q: 'Muss ich etwas installieren? Läuft merkio auf dem iPhone?', a: 'Nein, du kannst merkio als Web-App direkt im Browser nutzen – auf iPhone, iPad, Android und PC, ohne Installation. Für Android gibt es zusätzlich eine kostenlose native App.' },
      { q: 'Für wen ist merkio geeignet?', a: 'Für Familien, Wohngemeinschaften, Vereine und Teams – oder einfach für dich allein. Überall, wo Listen gemeinsam genutzt und Aufgaben verteilt werden.' },
      { q: 'Kann ich Einkaufslisten und To-do-Listen zusammen verwalten?', a: 'Ja. merkio bietet Einkaufslisten, To-do-Listen mit Prioritäten (A/B/C), Fälligkeit und Zuständigkeit sowie Notizlisten – alles an einem Ort.' },
      { q: 'Wie funktioniert der Rezept-Import?', a: 'Füge einen Rezepttext ein oder nenne einfach das gewünschte Gericht – merkio erkennt die Zutaten und setzt sie automatisch auf die Einkaufsliste, passend skaliert auf die gewünschte Portionszahl.' },
    ],
    footerBy: `© ${YEAR} merkio · Eine App von Arnulf Christa`,
    footerContact: 'Kontakt',
    footerImprint: 'Impressum',
    footerPrivacy: 'Datenschutz',
    footerLicenses: 'Lizenzen',
    langAria: 'Sprache',
    skipToApp: 'Zur Web-App',
  },
  en: {
    title: 'merkio – Share shopping & to-do lists in real time',
    desc: 'merkio – share shopping lists, to-do lists and notes in real time with family, flatmates or your club. Free as a web app in the browser (iPhone too) or as an Android app.',
    heroH1: 'Shared lists,<br><span class="accent">in real time</span>',
    lead: '<strong class="lead-hook">Never forget anything again.</strong> With merkio you organise your shopping, tasks and shared projects – for your family, your flat-share, your club or just for yourself. Share lists with others, divide up tasks and always keep track. That way nothing gets forgotten, nothing is bought twice, and the next barbecue stays relaxed.',
    btnWeb: 'Open web app',
    btnAndroid: 'Android app (APK)',
    btnNoteWeb: 'Free · no install · works on iPhone & iPad too',
    btnNoteAndroid: 'Free · Android 7.0 or newer (APK)',
    featuresTitle: 'What merkio can do',
    features: [
      { icon: '⚡', title: 'Real-time sync', desc: 'When someone checks off an item, everyone sees it instantly – no refresh needed.' },
      { icon: '👨‍👩‍👧', title: 'Groups', desc: 'Invite family or flatmates via invite code or link.' },
      { icon: '🍝', title: 'Recipe import', desc: 'Paste a recipe or just name the dish – the ingredients land on your shopping list automatically.' },
      { icon: '🏪', title: 'Sorted by store', desc: 'Assign items to stores or group by category – and drag the categories into the order of your supermarket.' },
      { icon: '✅', title: 'To-do lists', desc: 'Tasks with priorities (A/B/C), due dates and assignees – due items are colour-highlighted.' },
      { icon: '📝', title: 'Notes', desc: 'Notes lists with freely formatted text – bold, italic, underline, bullet lists and text colours.' },
      { icon: '📴', title: 'Works offline', desc: 'No signal in the store? The Android app works offline too – changes sync automatically once you are back online.' },
      { icon: '🌍', title: 'Multilingual', desc: 'Fully available in German, English and French – including the right supermarkets per country.' },
      { icon: '🔔', title: 'Notifications', desc: 'Push alerts when something changes on your lists.' },
      { icon: '🎁', title: 'Free', desc: 'merkio is completely free – no ads, no hidden costs and no subscription. Just get started.' },
    ],
    usageTitle: 'How to use merkio',
    web: {
      title: 'Web app (in the browser)',
      desc: 'Ready to use right away on phone, tablet and PC – no installation. Works on iPhone and iPad too.',
      steps: ['Open <code>app.merkio.de</code> in your browser.', 'Create an account, then create a group or join with a code.', 'Optionally choose “Add to Home Screen” in the browser menu – merkio then launches like a real app.'],
      installTitle: '📲 Install as an app on your home screen',
      installIphone: '<strong>iPhone/iPad:</strong> Open <code>app.merkio.de</code> in <strong>Safari</strong> → tap the share icon <span aria-hidden="true">⎋</span> (square with an arrow pointing up) → choose “<strong>Add to Home Screen</strong>” → “Add”. merkio then appears with its own icon like a regular app.',
      installAndroidBrowser: '<strong>Android (browser):</strong> In Chrome open the menu <span aria-hidden="true">⋮</span> → “<strong>Install app</strong>” or “Add to Home screen”.',
      cta: 'Open web app',
    },
    android: {
      title: 'Android app',
      desc: 'Native app as a direct download – with push notifications.',
      steps: ['Tap “Android app (APK)” – the file <code>merkio.apk</code> will be saved.', 'When opening it, allow installation from unknown sources if Android asks.', 'Open the app, create an account, create or join a group – done.'],
      cta: 'Download APK',
    },
    hint: '<strong>Note:</strong> both versions use the same account and the same lists – switch freely between the web app and the Android app. The Android app is offered as a direct download outside the Play Store and comes straight from the developer.',
    faqTitle: 'Frequently asked questions',
    faq: [
      { q: 'How can I share a shopping list with others in real time?', a: 'Create a group in merkio and invite family, flatmates or club members via invite code or link. Every change – such as a checked-off item – appears instantly for all members, with no need to refresh.' },
      { q: 'Is merkio really free?', a: 'Yes. merkio is completely free – no ads, no hidden costs and no subscription.' },
      { q: 'Do I need to install anything? Does merkio work on iPhone?', a: 'No, you can use merkio as a web app right in your browser – on iPhone, iPad, Android and PC, with no installation. There is also a free native Android app.' },
      { q: 'Who is merkio for?', a: 'For families, flat-shares, clubs and teams – or just for yourself. Anywhere lists are shared and tasks are divided up.' },
      { q: 'Can I manage shopping lists and to-do lists together?', a: 'Yes. merkio offers shopping lists, to-do lists with priorities (A/B/C), due dates and assignees, and notes lists – all in one place.' },
      { q: 'How does the recipe import work?', a: 'Paste a recipe text or simply name the dish – merkio detects the ingredients and adds them to your shopping list automatically, scaled to the number of servings you want.' },
    ],
    footerBy: `© ${YEAR} merkio · An app by Arnulf Christa`,
    footerContact: 'Contact',
    footerImprint: 'Imprint',
    footerPrivacy: 'Privacy Policy',
    footerLicenses: 'Licenses',
    langAria: 'Language',
    skipToApp: 'Go to web app',
  },
  fr: {
    title: 'merkio – Listes de courses & tâches partagées en temps réel',
    desc: 'merkio – partagez listes de courses, listes de tâches et notes en temps réel avec la famille, la coloc ou l’association. Gratuit en appli web (iPhone aussi) ou en application Android.',
    heroH1: 'Des listes partagées,<br><span class="accent">en temps réel</span>',
    lead: '<strong class="lead-hook">Ne plus jamais rien oublier.</strong> Avec merkio, vous organisez vos courses, vos tâches et vos projets communs – en famille, en colocation, dans une association ou simplement pour vous-même. Partagez vos listes, répartissez les tâches et gardez toujours une vue d’ensemble. Ainsi, plus rien n’est oublié, plus rien n’est acheté en double et le prochain barbecue se déroule en toute tranquillité.',
    btnWeb: 'Ouvrir l’appli web',
    btnAndroid: 'Application Android (APK)',
    btnNoteWeb: 'Gratuit · sans installation · aussi pour iPhone & iPad',
    btnNoteAndroid: 'Gratuit · Android 7.0 ou plus récent (APK)',
    featuresTitle: 'Ce que merkio sait faire',
    features: [
      { icon: '⚡', title: 'Synchro en temps réel', desc: 'Quand quelqu’un coche un article, tout le monde le voit aussitôt – sans rafraîchir.' },
      { icon: '👨‍👩‍👧', title: 'Groupes', desc: 'Invitez la famille ou les colocataires par code d’invitation ou lien.' },
      { icon: '🍝', title: 'Import de recettes', desc: 'Collez une recette ou indiquez simplement le plat – les ingrédients arrivent automatiquement sur la liste de courses.' },
      { icon: '🏪', title: 'Trié par magasin', desc: 'Associez les articles aux magasins ou groupez par catégorie – et glissez les catégories dans l’ordre de votre supermarché.' },
      { icon: '✅', title: 'Listes de tâches', desc: 'Tâches avec priorités (A/B/C), échéance et responsable – les échéances sont mises en couleur.' },
      { icon: '📝', title: 'Notes', desc: 'Listes de notes avec texte librement formaté – gras, italique, souligné, listes à puces et couleurs de texte.' },
      { icon: '📴', title: 'Fonctionne hors ligne', desc: 'Pas de réseau au supermarché ? L’appli Android fonctionne aussi hors ligne – les modifications se synchronisent automatiquement dès le retour en ligne.' },
      { icon: '🌍', title: 'Multilingue', desc: 'Entièrement en allemand, anglais et français – avec les supermarchés adaptés à chaque pays.' },
      { icon: '🔔', title: 'Notifications', desc: 'Alertes push lorsqu’il se passe quelque chose sur vos listes.' },
      { icon: '🎁', title: 'Gratuit', desc: 'merkio est entièrement gratuit – sans publicité, sans coûts cachés et sans abonnement. Lancez-vous, tout simplement.' },
    ],
    usageTitle: 'Comment utiliser merkio',
    web: {
      title: 'Appli web (dans le navigateur)',
      desc: 'Prête à l’emploi immédiatement sur mobile, tablette et PC – sans installation. Fonctionne aussi sur iPhone et iPad.',
      steps: ['Ouvrez <code>app.merkio.de</code> dans votre navigateur.', 'Créez un compte, puis créez un groupe ou rejoignez-en un avec un code.', 'En option, choisissez « Ajouter à l’écran d’accueil » dans le menu du navigateur – merkio se lance alors comme une vraie application.'],
      installTitle: '📲 Installer comme application sur l’écran d’accueil',
      installIphone: '<strong>iPhone/iPad :</strong> Ouvrez <code>app.merkio.de</code> dans <strong>Safari</strong> → touchez l’icône de partage <span aria-hidden="true">⎋</span> (carré avec flèche vers le haut) → choisissez « <strong>Sur l’écran d’accueil</strong> » → « Ajouter ». merkio apparaît alors avec sa propre icône, comme une vraie application.',
      installAndroidBrowser: '<strong>Android (navigateur) :</strong> Dans Chrome, ouvrez le menu <span aria-hidden="true">⋮</span> → « <strong>Installer l’application</strong> » ou « Ajouter à l’écran d’accueil ».',
      cta: 'Ouvrir l’appli web',
    },
    android: {
      title: 'Application Android',
      desc: 'Application native en téléchargement direct – avec notifications push.',
      steps: ['Touchez « Application Android (APK) » – le fichier <code>merkio.apk</code> sera enregistré.', 'À l’ouverture, autorisez l’installation de sources inconnues si Android le demande.', 'Ouvrez l’application, créez un compte, créez ou rejoignez un groupe – terminé.'],
      cta: 'Télécharger l’APK',
    },
    hint: '<strong>Remarque :</strong> les deux versions utilisent le même compte et les mêmes listes – passez librement de l’appli web à l’application Android. L’application Android est proposée en téléchargement direct, hors Play Store, et provient directement du développeur.',
    faqTitle: 'Questions fréquentes',
    faq: [
      { q: 'Comment partager une liste de courses en temps réel avec d’autres ?', a: 'Créez un groupe dans merkio et invitez votre famille, vos colocataires ou les membres de votre association par code d’invitation ou par lien. Chaque modification – par exemple un article coché – apparaît instantanément pour tous les membres, sans rafraîchir la page.' },
      { q: 'merkio est-il vraiment gratuit ?', a: 'Oui. merkio est entièrement gratuit – sans publicité, sans coûts cachés et sans abonnement.' },
      { q: 'Dois-je installer quelque chose ? merkio fonctionne-t-il sur iPhone ?', a: 'Non, vous pouvez utiliser merkio comme appli web directement dans le navigateur – sur iPhone, iPad, Android et PC, sans installation. Une application Android native gratuite est également disponible.' },
      { q: 'À qui s’adresse merkio ?', a: 'Aux familles, aux colocations, aux associations et aux équipes – ou simplement à vous seul. Partout où des listes sont partagées et des tâches réparties.' },
      { q: 'Puis-je gérer ensemble les listes de courses et les listes de tâches ?', a: 'Oui. merkio propose des listes de courses, des listes de tâches avec priorités (A/B/C), échéance et responsable, ainsi que des listes de notes – le tout au même endroit.' },
      { q: 'Comment fonctionne l’import de recettes ?', a: 'Collez le texte d’une recette ou indiquez simplement le plat – merkio reconnaît les ingrédients et les ajoute automatiquement à la liste de courses, à l’échelle du nombre de portions souhaité.' },
    ],
    footerBy: `© ${YEAR} merkio · Une application d’Arnulf Christa`,
    footerContact: 'Contact',
    footerImprint: 'Mentions légales',
    footerPrivacy: 'Confidentialité',
    footerLicenses: 'Licences',
    langAria: 'Langue',
    skipToApp: 'Vers l’appli web',
  },
}

/* ────────────────────────────── Helpers ────────────────────────────── */
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const WEB_ICON = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/><path d="M3 12h18M12 3c2.6 2.7 2.6 15.3 0 18M12 3c-2.6 2.7-2.6 15.3 0 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
const DL_ICON = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'

function hreflangBlock() {
  const map = { de: 'de', en: 'en', fr: 'fr' }
  let out = LANGS.map((l) => `  <link rel="alternate" hreflang="${map[l]}" href="${SITE}${pathFor(l)}" />`).join('\n')
  out += `\n  <link rel="alternate" hreflang="x-default" href="${SITE}/" />`
  return out
}

function jsonLd(c, l) {
  const software = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'merkio',
    operatingSystem: 'Android, Web',
    applicationCategory: 'ProductivityApplication',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
    url: SITE + pathFor(l),
    inLanguage: l,
    description: c.desc,
    image: SITE + '/og-image.png',
    softwareVersion: '1.0.13',
    featureList: c.features.map((f) => f.title),
    author: { '@type': 'Organization', name: 'Christa Consult', url: SITE },
  }
  const org = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Christa Consult',
    url: SITE,
    logo: SITE + '/logomerkio1.png',
  }
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: c.faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
  return [software, org, faq]
    .map((o) => `  <script type="application/ld+json">${JSON.stringify(o)}</script>`)
    .join('\n')
}

function langbar(current) {
  return LANGS.map((l) => {
    const label = l.toUpperCase()
    const cls = l === current ? ' class="active"' : ''
    return `<a href="${pathFor(l)}"${cls} hreflang="${l}">${label}</a>`
  }).join('\n          ')
}

function featuresHtml(c) {
  return c.features.map((f) => `          <div class="feature">
            <div class="ico">${f.icon}</div>
            <h3>${f.title}</h3>
            <p>${f.desc}</p>
          </div>`).join('\n')
}

function stepsHtml(steps) {
  return steps.map((s) => `              <li>${s}</li>`).join('\n')
}

function faqHtml(c) {
  return c.faq.map((f) => `          <div class="faq-item">
            <h3>${f.q}</h3>
            <p>${f.a}</p>
          </div>`).join('\n')
}

/* ────────────────────────────── Template ────────────────────────────── */
function render(l) {
  const c = C[l]
  const canonical = SITE + pathFor(l)
  return `<!DOCTYPE html>
<html lang="${l}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(c.title)}</title>
  <meta name="description" content="${esc(c.desc)}" />
  <meta name="theme-color" content="#0050AA" />
  <link rel="canonical" href="${canonical}" />
  <link rel="icon" type="image/png" href="/logomerkio1.png" />
${hreflangBlock()}

  <!-- Open Graph / Social -->
  <meta property="og:site_name" content="merkio" />
  <meta property="og:title" content="${esc(c.title)}" />
  <meta property="og:description" content="${esc(c.desc)}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:image" content="${SITE}/og-image.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="merkio – gemeinsame Listen in Echtzeit teilen" />
  <meta property="og:locale" content="${OG_LOCALE[l]}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(c.title)}" />
  <meta name="twitter:description" content="${esc(c.desc)}" />
  <meta name="twitter:image" content="${SITE}/og-image.png" />

${jsonLd(c, l)}

  <style>
    :root {
      --blue: #0050AA;
      --blue-dark: #003c80;
      --yellow: #FFF000;
      --ink: #1a1c20;
      --muted: #5b6470;
      --bg: #f5f7fa;
      --card: #ffffff;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: var(--ink);
      background: var(--bg);
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
    }
    .wrap { max-width: 880px; margin: 0 auto; padding: 0 20px; }

    header { padding: 28px 0; }
    .headrow { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
    .logo img { height: 192px; width: auto; display: block; }
    .langbar { display: flex; gap: 6px; }
    .langbar a {
      border: 1px solid #d3dae3; background: #fff; color: var(--muted);
      font: inherit; font-size: 14px; font-weight: 600; text-decoration: none;
      padding: 6px 12px; border-radius: 999px; cursor: pointer;
      transition: all .15s ease;
    }
    .langbar a:hover { border-color: var(--blue); color: var(--blue); }
    .langbar a.active { background: var(--blue); color: #fff; border-color: var(--blue); }

    .hero {
      text-align: center;
      padding: 40px 0 64px;
      background: linear-gradient(180deg, #ffffff 0%, var(--bg) 100%);
    }
    .hero h1 {
      font-size: clamp(30px, 6vw, 46px);
      font-weight: 800; line-height: 1.15; margin: 28px 0 16px;
    }
    .hero h1 .accent { color: var(--blue); }
    .hero p.lead {
      font-size: clamp(17px, 2.5vw, 20px); color: var(--muted);
      max-width: 620px; margin: 0 auto 36px;
    }
    .hero p.lead .lead-hook {
      display: block; color: var(--ink); font-weight: 800;
      font-size: 1.15em; margin-bottom: 10px;
    }

    .btn-row { display: flex; gap: 18px; justify-content: center; align-items: flex-start; flex-wrap: wrap; }
    .btn-col { display: flex; flex-direction: column; align-items: center; gap: 10px; }
    .btn {
      display: inline-flex; align-items: center; gap: 10px;
      background: var(--blue); color: #fff; text-decoration: none;
      font-weight: 700; font-size: 18px;
      padding: 16px 30px; border-radius: 14px;
      box-shadow: 0 8px 24px rgba(0,80,170,0.28);
      transition: transform .15s ease, box-shadow .15s ease, background .15s ease;
    }
    .btn:hover { background: var(--blue-dark); transform: translateY(-2px); box-shadow: 0 12px 30px rgba(0,80,170,0.35); }
    .btn svg { width: 22px; height: 22px; }
    .btn.secondary {
      background: #fff; color: var(--blue);
      border: 2px solid var(--blue);
      box-shadow: 0 4px 16px rgba(20,28,40,0.08);
    }
    .btn.secondary:hover { background: #eaf2fc; }
    .btn.sm { font-size: 15px; padding: 12px 22px; }
    .btn-note { display: block; margin-top: 0; font-size: 14px; color: var(--muted); text-align: center; max-width: 260px; }

    section.block { padding: 56px 0; }
    section.block h2 {
      font-size: clamp(22px, 4vw, 30px); font-weight: 800;
      text-align: center; margin-bottom: 40px;
    }

    .features { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 20px; }
    .feature {
      background: var(--card); border-radius: 16px; padding: 26px;
      box-shadow: 0 2px 12px rgba(20,28,40,0.06);
    }
    .feature .ico {
      width: 46px; height: 46px; border-radius: 12px; background: #eaf2fc;
      display: flex; align-items: center; justify-content: center; margin-bottom: 16px;
      font-size: 24px;
    }
    .feature h3 { font-size: 18px; margin-bottom: 6px; }
    .feature p { color: var(--muted); font-size: 15px; }

    .options {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(290px, 1fr));
      gap: 24px; max-width: 760px; margin: 0 auto;
    }
    .option {
      background: var(--card); border-radius: 18px; padding: 28px;
      box-shadow: 0 2px 12px rgba(20,28,40,0.06);
      display: flex; flex-direction: column;
    }
    .option .ico {
      width: 52px; height: 52px; border-radius: 14px; background: #eaf2fc;
      display: flex; align-items: center; justify-content: center; font-size: 28px; margin-bottom: 16px;
    }
    .option h3 { font-size: 20px; margin-bottom: 6px; }
    .option > p { color: var(--muted); font-size: 15px; margin-bottom: 18px; }
    .ministeps { list-style: none; counter-reset: ms; margin: 0 0 22px; padding: 0; flex: 1; }
    .ministeps li {
      position: relative; padding-left: 32px; margin-bottom: 12px;
      font-size: 14.5px; color: var(--ink);
    }
    .ministeps li::before {
      counter-increment: ms; content: counter(ms);
      position: absolute; left: 0; top: 1px;
      width: 22px; height: 22px; border-radius: 50%;
      background: var(--blue); color: #fff; font-size: 12px; font-weight: 800;
      display: flex; align-items: center; justify-content: center;
    }
    .ministeps code, .step code { background: #eef1f5; padding: 1px 6px; border-radius: 5px; font-size: 13px; }
    .option .btn { align-self: flex-start; }

    .hint {
      max-width: 720px; margin: 28px auto 0; padding: 16px 18px;
      background: #fffbe6; border: 1px solid #ffe27a; border-radius: 12px;
      font-size: 14px; color: #6b5800;
    }

    .install-box {
      margin: 4px 0 16px; padding: 12px 14px;
      background: #eef5ff; border: 1px solid #c9defa; border-radius: 10px;
      font-size: 13.5px; color: var(--ink); text-align: left;
    }
    .install-box h4 { font-size: 14px; margin-bottom: 6px; }
    .install-box p { margin: 4px 0; color: var(--muted); }
    .install-box p strong { color: var(--ink); }
    .install-box code { background: #dfeafc; padding: 1px 6px; border-radius: 5px; font-size: 12.5px; }

    /* FAQ */
    .faq { max-width: 760px; margin: 0 auto; display: grid; gap: 14px; }
    .faq-item {
      background: var(--card); border-radius: 14px; padding: 20px 22px;
      box-shadow: 0 2px 12px rgba(20,28,40,0.06);
    }
    .faq-item h3 { font-size: 17px; margin-bottom: 6px; color: var(--ink); }
    .faq-item p { color: var(--muted); font-size: 15px; }

    footer {
      text-align: center; padding: 40px 0; color: var(--muted); font-size: 14px;
      border-top: 1px solid #e4e8ee;
    }
    footer a { color: var(--blue); text-decoration: none; }
    footer a:hover { text-decoration: underline; }
  </style>
</head>
<body>

  <header>
    <div class="wrap">
      <div class="headrow">
        <a class="logo" href="${pathFor(l)}">
          <img src="/logomerkio1.png" alt="merkio" />
        </a>
        <nav class="langbar" aria-label="${esc(c.langAria)}">
          ${langbar(l)}
        </nav>
      </div>
    </div>
  </header>

  <main>
    <section class="hero">
      <div class="wrap">
        <h1>${c.heroH1}</h1>
        <p class="lead">${c.lead}</p>
        <div class="btn-row">
          <div class="btn-col">
            <a class="btn" href="${APP}">
              ${WEB_ICON}
              <span>${c.btnWeb}</span>
            </a>
            <span class="btn-note">${c.btnNoteWeb}</span>
          </div>
          <div class="btn-col">
            <a class="btn secondary" href="${APK}">
              ${DL_ICON}
              <span>${c.btnAndroid}</span>
            </a>
            <span class="btn-note">${c.btnNoteAndroid}</span>
          </div>
        </div>
      </div>
    </section>

    <section class="block">
      <div class="wrap">
        <h2>${c.featuresTitle}</h2>
        <div class="features">
${featuresHtml(c)}
        </div>
      </div>
    </section>

    <section class="block" id="install" style="background:#fff;">
      <div class="wrap">
        <h2>${c.usageTitle}</h2>
        <div class="options">
          <div class="option">
            <div class="ico">🌐</div>
            <h3>${c.web.title}</h3>
            <p>${c.web.desc}</p>
            <ol class="ministeps">
${stepsHtml(c.web.steps)}
            </ol>
            <div class="install-box">
              <h4>${c.web.installTitle}</h4>
              <p>${c.web.installIphone}</p>
              <p>${c.web.installAndroidBrowser}</p>
            </div>
            <a class="btn sm" href="${APP}">${c.web.cta}</a>
          </div>
          <div class="option">
            <div class="ico">🤖</div>
            <h3>${c.android.title}</h3>
            <p>${c.android.desc}</p>
            <ol class="ministeps">
${stepsHtml(c.android.steps)}
            </ol>
            <a class="btn sm secondary" href="${APK}">${c.android.cta}</a>
          </div>
        </div>
        <div class="hint">${c.hint}</div>
      </div>
    </section>

    <section class="block" id="faq">
      <div class="wrap">
        <h2>${c.faqTitle}</h2>
        <div class="faq">
${faqHtml(c)}
        </div>
      </div>
    </section>
  </main>

  <footer>
    <div class="wrap">
      <p>${c.footerBy}</p>
      <p style="margin-top:6px;">
        <a href="mailto:mail@christa-web.de">${c.footerContact}</a>
        &nbsp;·&nbsp; <a href="/impressum.html">${c.footerImprint}</a>
        &nbsp;·&nbsp; <a href="/datenschutz.html">${c.footerPrivacy}</a>
        &nbsp;·&nbsp; <a href="/lizenzen.html">${c.footerLicenses}</a>
      </p>
    </div>
  </footer>

</body>
</html>
`
}

/* ────────────────────────────── Schreiben ────────────────────────────── */
for (const l of LANGS) {
  const html = render(l)
  if (l === 'de') {
    writeFileSync(join(ROOT, 'index.html'), html)
  } else {
    mkdirSync(join(ROOT, l), { recursive: true })
    writeFileSync(join(ROOT, l, 'index.html'), html)
  }
  console.log(`generated ${pathFor(l)}index.html`)
}
console.log('done.')
