/* Builds index.html, cv/*.html and outreach/indie-email.html from _data/cv.json.
   Run:  npm run build
   Pure functions below; Node file I/O is at the bottom. */

function esc(s) { return String(s); }

function entryHtml(b, tight) {
  if (!b) return '';
  var head = '<div class="entry-head"><div><span class="entry-role">' + b.role + '</span>' +
    (b.org ? ' <span class="entry-org">· ' + b.org + '</span>' : '') + '</div>' +
    (b.meta ? '<div class="entry-meta">' + b.meta + '</div>' : '') + '</div>';
  var link = b.link ? '<div class="entry-sub"><a href="' + b.link + '">' + b.link.replace(/^https?:\/\//, '') + '</a></div>' : '';
  var sub = b.sub ? '<div class="entry-sub">' + b.sub + '</div>' : '';
  var bullets = (b.bullets && b.bullets.length)
    ? '<ul>' + b.bullets.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul>' : '';
  if (tight) return '<div class="entry entry-line">' + head + '</div>';
  return '<div class="entry">' + head + link + sub + bullets + '</div>';
}

function sectionHtml(sec, data) {
  var inner = '';
  if (sec.type === 'entries' || sec.type === 'entries-tight') {
    var tight = sec.type === 'entries-tight';
    inner = sec.blocks.map(function (id) { return entryHtml(data.blocks[id], tight); }).join('');
  } else if (sec.type === 'kv') {
    inner = '<div class="kv">' + sec.rows.map(function (r) {
      return '<dt>' + r[0] + '</dt><dd>' + r[1] + '</dd>';
    }).join('') + '</div>';
  } else if (sec.type === 'tags') {
    inner = '<div class="tag-row">' + sec.tags.map(function (t) {
      return '<span class="tag">' + t + '</span>';
    }).join('') + '</div>';
  } else if (sec.type === 'list') {
    inner = '<ul>' + sec.items.map(function (i) { return '<li>' + i + '</li>'; }).join('') + '</ul>';
  }
  if (sec.note) inner += '<p class="small muted" style="margin:6px 0 0">' + sec.note + '</p>';
  return '<section class="section"><h2>' + sec.title + '</h2>' + inner + '</section>';
}

function contactHtml(p) {
  return [
    p.phone,
    '<a href="mailto:' + p.email + '">' + p.email + '</a>',
    '<a href="' + p.github + '">' + p.github.replace(/^https?:\/\//, '') + '</a>',
    '<a href="' + p.linkedin + '">LinkedIn</a>',
    p.location + ' · relocating'
  ].join('<span class="sep">·</span>');
}

function cvPage(v, data) {
  var p = data.person;
  var name = v.name || p.name;
  var plainTitle = v.tagline.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&');
  var summary = v.summaryHtml
    ? '<p class="doc-summary">' + v.summaryHtml + '</p>'
    : (v.summary ? '<p class="doc-summary">' + v.summary + '</p>' : '');
  var note = v.careerNote && data.careerNote
    ? '<p class="career-note">' + data.careerNote + '</p>' : '';

  return '<!DOCTYPE html>\n<html lang="en">\n<head>\n' +
    '<meta charset="utf-8">\n' +
    '<meta name="viewport" content="width=device-width, initial-scale=1">\n' +
    '<title>' + name + ' — ' + plainTitle + '</title>\n' +
    '<link rel="stylesheet" href="../assets/css/modernist.css">\n' +
    '<link rel="stylesheet" href="../assets/css/main.css">\n' +
    '</head>\n<body>\n' +
    '<div class="toolbar no-print">\n  <a href="../index.html">← All versions</a>\n' +
    '  <button class="btn btn-primary" onclick="window.print()">Print / Save as PDF</button>\n</div>\n' +
    '<div class="sheet-wrap">\n<article class="sheet' + (v.fit === 'tight' ? ' sheet-tight' : '') + '">\n' +
    '  <header class="doc-head">\n    <h1 class="doc-name">' + name + '</h1>\n' +
    '    <p class="doc-tagline">' + v.tagline + '</p>\n' +
    '    <div class="doc-contact">' + contactHtml(p) + '</div>\n  </header>\n' +
    '  ' + summary + '\n' +
    '  ' + v.sections.map(function (s) { return sectionHtml(s, data); }).join('\n  ') + '\n' +
    '  ' + note + '\n' +
    '</article>\n</div>\n</body>\n</html>\n';
}

function indexPage(data) {
  var p = data.person, s = data.site;

  function card(v, indent) {
    var pad = indent || '        ';
    return pad + '<div class="dl">\n' +
      pad + '  <div class="dl-k">' + v.kicker + '</div>\n' +
      pad + '  <div class="dl-t"><a href="cv/' + v.slug + '.html">' + v.cardTitle + '</a></div>\n' +
      pad + '  <div class="dl-d">' + v.cardBlurb + '</div>\n' +
      (v.cardNote ? pad + '  <div class="dl-note">' + v.cardNote + '</div>\n' : '') +
      pad + '  <div class="dl-links"><a href="cv/' + v.slug + '.html">Read the ' +
      (v.group === 'full' ? 'full CV' : 'CV') + ' →</a></div>\n' +
      pad + '</div>';
  }

  var featured = data.versions.filter(function (v) { return v.group === 'full'; });
  var skillsets = data.versions.filter(function (v) { return v.group === 'skillset'; });

  var projects = data.projects.map(function (pr) {
    var shots = pr.images.map(function (src) {
      return '<div class="shot grayscale"><img src="' + src + '" alt="' + pr.name + ' screenshot"></div>';
    }).join('\n          ');
    return '      <article class="project' + (pr.images.length ? '' : ' no-shots') + '">\n' +
      '        <div class="p-body">\n' +
      '          <h3>' + pr.name + '</h3>\n' +
      '          <div class="p-meta">' + pr.meta + '</div>\n' +
      '          <p class="prose small">' + pr.body + '</p>\n' +
      '          <div class="stat-row">' + pr.tags.map(function (t) {
        return '<span class="tag">' + t + '</span>';
      }).join('') + '</div>\n' +
      '          <p class="small" style="margin-top:12px"><a href="' + pr.link + '">' + pr.linkLabel + '</a></p>\n' +
      '        </div>\n' +
      (pr.images.length ? '        <div class="shot-stack">\n          ' + shots + '\n        </div>\n' : '') +
      '      </article>';
  }).join('\n');

  var skills = s.skills.map(function (r) {
    return '      <div><dt>' + r[0] + '</dt><dd>' + r[1] + '</dd></div>';
  }).join('\n');

  var edu = s.education.map(function (r) {
    return '    <div class="eduline"><span class="e-main">' + r[0] + '</span><span class="e-meta">' + r[1] + '</span></div>';
  }).join('\n');

  /* Section bodies, keyed by id. Order comes from site.sectionOrder in cv.json,
     so the page order can be changed without touching this function. */
  var sec = {};

  sec.about = '  <section class="block" id="about">\n    <h2>About</h2>\n' +
    '    <p class="lede">' + s.aboutLede + '</p>\n' +
    '    <p class="prose" style="margin-top:16px">' + s.aboutBody + '</p>\n  </section>';

  sec.cv = '  <section class="block" id="cv">\n    <h2>Curriculum vitae</h2>\n' +
    '    <div class="dl-grid dl-grid-feature">\n' + featured.map(function (v) { return card(v); }).join('\n') + '\n    </div>\n' +
    '    <h3 class="block-sub">Specific skillsets</h3>\n' +
    '    <div class="dl-grid">\n' + skillsets.map(function (v) { return card(v); }).join('\n') + '\n    </div>\n' +
    '    <p class="collab">Open to collaboration on puzzle-game dev — <a href="mailto:' + p.email + '">reach out to collaborate</a>.</p>\n' +
    '  </section>';

  sec.projects = '  <section class="block" id="projects">\n    <h2>Selected projects</h2>\n' +
    '    <div class="projects">\n' + projects + '\n    </div>\n  </section>';

  sec.teaching = '  <section class="block" id="teaching">\n    <h2>On teaching</h2>\n' +
    '    <p class="prose">' + s.teaching + '</p>\n  </section>';

  sec.skills = '  <section class="block" id="skills">\n    <h2>Skills</h2>\n' +
    '    <dl class="skills-grid">\n' + skills + '\n    </dl>\n  </section>';

  var eduLinks = (s.educationLinks || []).map(function (l) {
    return '<a href="' + l[1] + '">' + l[0] + '</a>';
  }).join(' · ');

  sec.education = '  <section class="block" id="education">\n    <h2>Education &amp; publication</h2>\n' + edu + '\n' +
    (eduLinks ? '    <p class="small" style="margin-top:12px">' + eduLinks + '</p>\n' : '') +
    '  </section>';

  /* "Name, Credential" renders the credential in the accent color. */
  var comma = p.name.lastIndexOf(', ');
  var displayName = comma === -1 ? p.name
    : p.name.slice(0, comma + 2) + '<span style="color:var(--cv-accent-deep)">' + p.name.slice(comma + 2) + '</span>';

  var order = s.sectionOrder || ['about', 'cv', 'projects', 'teaching', 'skills', 'education'];
  var body = order.map(function (k) { return sec[k]; }).filter(Boolean).join('\n\n');

  return '<!DOCTYPE html>\n<html lang="en">\n<head>\n' +
    '<meta charset="utf-8">\n' +
    '<meta name="viewport" content="width=device-width, initial-scale=1">\n' +
    '<title>' + p.name + (s.titleSuffix ? ' — ' + s.titleSuffix : '') + '</title>\n' +
    '<meta name="description" content="' + s.metaDescription + '">\n' +
    '<meta property="og:title" content="' + p.name + (s.titleSuffix ? ' — ' + s.titleSuffix : '') + '">\n' +
    '<meta property="og:description" content="' + (s.ogDescription || s.metaDescription) + '">\n' +
    '<meta property="og:type" content="profile">\n' +
    '<link rel="stylesheet" href="assets/css/modernist.css">\n' +
    '<link rel="stylesheet" href="assets/css/main.css">\n' +
    '</head>\n<body>\n\n' +
    '<header class="site-header">\n' +
    '  <div class="header-grid' + (p.portrait ? '' : ' no-portrait') + '">\n' +
    '    <div>\n' +
    '      <h1 class="site-name">' + displayName + '</h1>\n' +
    '      <p class="site-tagline">' + s.tagline + '</p>\n' +
    '      <div class="site-contact">\n' +
    '        <a href="mailto:' + p.email + '">' + p.email + '</a>\n' +
    '        <a href="' + p.github + '">' + p.github.replace(/^https?:\/\//, '') + '</a>\n' +
    '        <a href="' + p.linkedin + '">LinkedIn</a>\n' +
    '        <span>' + p.location + ' · ' + p.relocation + '</span>\n' +
    '      </div>\n' +
    '      <p class="header-jump"><a href="#cv">Curriculum vitae ↓</a></p>\n' +
    '    </div>\n' +
    (p.portrait ? '    <div class="portrait grayscale"><img src="' + p.portrait + '" alt="' + p.name + '"></div>\n' : '') +
    '  </div>\n' +
    '</header>\n' +
    '<div class="rule-strong"></div>\n\n' +
    '<main class="site-main">\n\n' + body + '\n\n</main>\n\n' +
    '<footer class="site-footer">\n' +
    '  <span>' + p.name + ' · ' + p.location + '</span>\n' +
    '  <span><a href="' + p.github + '">GitHub</a> · <a href="' + p.linkedin + '">LinkedIn</a> · <a href="mailto:' + p.email + '">Email</a></span>\n' +
    '</footer>\n\n</body>\n</html>\n';
}

function emailPage(data) {
  var e = data.outreachEmail;
  var paras = e.body.map(function (b) { return '<p>' + b + '</p>'; }).join('\n      ');
  return '<!DOCTYPE html>\n<html lang="en">\n<head>\n' +
    '<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n' +
    '<title>Cold-outreach email template</title>\n' +
    '<link rel="stylesheet" href="../assets/css/modernist.css">\n' +
    '<link rel="stylesheet" href="../assets/css/main.css">\n' +
    '</head>\n<body>\n' +
    '<div class="toolbar no-print">\n  <a href="../index.html">← All versions</a>\n' +
    '  <button class="btn btn-primary" onclick="copyEmail()">Copy text</button>\n</div>\n' +
    '<div class="sheet-wrap">\n<article class="sheet">\n' +
    '  <header class="doc-head">\n    <h1 class="doc-name">Cold-outreach email</h1>\n' +
    '    <p class="doc-tagline">For small puzzle-game studios — pair with the indie CV</p>\n  </header>\n' +
    '  <p class="doc-summary">Replace everything in <code>{{ }}</code>. The second paragraph is the one that matters: ' +
    'one specific, honest sentence about <em>their</em> game. Keep it short — this is an email, not a cover letter.</p>\n' +
    '  <section class="section"><h2>Subject</h2>\n' +
    '    <p class="email-subject">' + e.subject + '</p>\n  </section>\n' +
    '  <section class="section"><h2>Body</h2>\n' +
    '    <div class="email-body" id="emailBody">\n      ' + paras + '\n    </div>\n  </section>\n' +
    '</article>\n</div>\n' +
    '<script>\nfunction copyEmail(){\n' +
    '  var t = document.getElementById("emailBody").innerText;\n' +
    '  navigator.clipboard.writeText(t);\n}\n</script>\n' +
    '</body>\n</html>\n';
}

/* ---------- private hub: every version in one place ---------- */
function hubPage(data) {
  var p = data.person;

  function row(v) {
    return '      <div class="hub-row">\n' +
      '        <div class="hub-main">\n' +
      '          <div class="dl-k">' + v.kicker + '</div>\n' +
      '          <div class="hub-t">' + v.cardTitle + '</div>\n' +
      '          <div class="dl-d">' + v.cardBlurb + '</div>\n' +
      (v.cardNote ? '          <div class="dl-note">' + v.cardNote + '</div>\n' : '') +
      '        </div>\n' +
      '        <div class="hub-actions">\n' +
      '          <a class="btn btn-secondary" href="cv/' + v.slug + '.html">Read</a>\n' +
      '          <a class="btn btn-primary" href="assets/pdfs/' + v.pdf + '.pdf">PDF</a>\n' +
      '        </div>\n' +
      '      </div>';
  }

  var groups = [
    ['Full CV', data.versions.filter(function (v) { return v.group === 'full'; })],
    ['Specific skillsets', data.versions.filter(function (v) { return v.group === 'skillset'; })],
    ['Not shown on the public site', data.versions.filter(function (v) { return v.group === 'private'; })]
  ];

  var body = groups.filter(function (g) { return g[1].length; }).map(function (g) {
    return '    <section class="section">\n      <h2>' + g[0] + '</h2>\n' +
      g[1].map(row).join('\n') + '\n    </section>';
  }).join('\n');

  return '<!DOCTYPE html>\n<html lang="en">\n<head>\n' +
    '<meta charset="utf-8">\n' +
    '<meta name="viewport" content="width=device-width, initial-scale=1">\n' +
    '<meta name="robots" content="noindex, nofollow">\n' +
    '<title>CV library — ' + p.name + '</title>\n' +
    '<link rel="stylesheet" href="assets/css/modernist.css">\n' +
    '<link rel="stylesheet" href="assets/css/main.css">\n' +
    '</head>\n<body>\n' +
    '<div class="sheet-wrap">\n<article class="sheet">\n' +
    '  <header class="doc-head">\n    <h1 class="doc-name">CV library</h1>\n' +
    '    <p class="doc-tagline">Every version, ready to send</p>\n' +
    '    <div class="doc-contact">Private working page · not linked from the public site' +
    '<span class="sep">·</span><a href="index.html">public site</a></div>\n  </header>\n' +
    '  <p class="doc-summary">Every version, with a print-ready PDF. <span class="muted">PDF links work once ' +
    '<code>npm run build &amp;&amp; npm run pdfs</code> (or the GitHub Action) has rendered them; before that, open a ' +
    'version and use “Print / Save as PDF”.</span></p>\n' +
    body + '\n' +
    '    <section class="section">\n      <h2>Outreach</h2>\n' +
    '      <div class="hub-row">\n' +
    '        <div class="hub-main">\n' +
    '          <div class="dl-k">Template</div>\n' +
    '          <div class="hub-t">Cold-outreach email</div>\n' +
    '          <div class="dl-d">For small puzzle-game studios. Pair with the game-development CV.</div>\n' +
    '        </div>\n' +
    '        <div class="hub-actions">\n' +
    '          <a class="btn btn-secondary" href="outreach/indie-email.html">Open</a>\n' +
    '        </div>\n' +
    '      </div>\n    </section>\n' +
    '</article>\n</div>\n</body>\n</html>\n';
}

/* ---------- CSV loading ----------
   Content lives in _data/*.csv, one flat table per file. Two conventions:
     " | "   separates repeated values (bullets, tags, block ids)
     " :: "  separates a key from its value inside a repeated value
   Neither sequence appears in the content itself. */

function parseCSV(text) {
  text = text.replace(/\r\n/g, '\n').replace(/\n+$/, '');
  var rows = [], row = [], cell = '', quoted = false, i = 0;
  while (i < text.length) {
    var c = text[i];
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') { cell += '"'; i += 2; continue; }
        quoted = false; i++; continue;
      }
      cell += c; i++; continue;
    }
    if (c === '"') { quoted = true; i++; continue; }
    if (c === ',') { row.push(cell); cell = ''; i++; continue; }
    if (c === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; i++; continue; }
    cell += c; i++;
  }
  row.push(cell); rows.push(row);
  var header = rows.shift();
  return rows.filter(function (r) { return r.some(function (x) { return x !== ''; }); })
    .map(function (r) {
      var o = {};
      header.forEach(function (h, n) { o[h.trim()] = (r[n] === undefined ? '' : r[n]); });
      return o;
    });
}

function splitList(s) {
  return s ? s.split(' | ').map(function (x) { return x.trim(); }).filter(Boolean) : [];
}
function splitPairs(s) {
  return splitList(s).map(function (x) {
    var i = x.indexOf(' :: ');
    return i === -1 ? [x, ''] : [x.slice(0, i).trim(), x.slice(i + 4).trim()];
  });
}
function lookup(rows, keyCol, valCol) {
  var o = {};
  rows.forEach(function (r) { o[r[keyCol]] = r[valCol]; });
  return o;
}

/* Turns the parsed tables into the structure the page builders expect. */
function assemble(t) {
  var site = lookup(t.site, 'key', 'value');

  var blocks = {};
  t.blocks.forEach(function (r) {
    var b = {};
    ['role', 'org', 'meta', 'link', 'sub'].forEach(function (k) { if (r[k]) b[k] = r[k]; });
    if (r.bullets) b.bullets = splitList(r.bullets);
    blocks[r.id] = b;
  });

  var versions = t.versions.map(function (r) {
    var v = {
      slug: r.slug, pdf: r.pdf, group: r.group, kicker: r.kicker,
      cardTitle: r.card_title, cardBlurb: r.card_blurb, tagline: r.tagline,
      careerNote: r.career_note === 'yes', fit: r.fit || '', sections: []
    };
    if (r.card_note) v.cardNote = r.card_note;
    if (r.name) v.name = r.name;
    if (r.summary) v.summary = r.summary;
    if (r.summary_html) v.summaryHtml = r.summary_html;
    return v;
  });
  var bySlug = {};
  versions.forEach(function (v) { bySlug[v.slug] = v; });

  t.sections.forEach(function (r) {
    var v = bySlug[r.version];
    if (!v) return;
    var s = { title: r.title, type: r.type };
    if (r.type === 'entries' || r.type === 'entries-tight') s.blocks = splitList(r.content);
    else if (r.type === 'kv') s.rows = splitPairs(r.content);
    else if (r.type === 'tags') s.tags = splitList(r.content);
    else if (r.type === 'list') s.items = splitList(r.content);
    if (r.note) s.note = r.note;
    v.sections.push(s);
  });

  var mail = lookup(t.outreach, 'field', 'value');
  var body = Object.keys(mail).filter(function (k) { return k.indexOf('body_') === 0; })
    .sort(function (a, b) { return parseInt(a.slice(5), 10) - parseInt(b.slice(5), 10); })
    .map(function (k) { return mail[k]; });

  return {
    person: lookup(t.person, 'field', 'value'),
    links: lookup(t.links, 'id', 'url'),
    careerNote: site.career_note,
    blocks: blocks,
    versions: versions,
    projects: t.projects.map(function (r) {
      return {
        name: r.name, meta: r.meta, body: r.body, tags: splitList(r.tags),
        link: r.link, linkLabel: r.link_label, images: splitList(r.images)
      };
    }),
    site: {
      aboutLede: site.about_lede, aboutBody: site.about_body, teaching: site.teaching,
      sectionOrder: splitList(site.section_order),
      skills: splitPairs(site.skills), education: splitPairs(site.education),
      educationLinks: splitPairs(site.education_links),
      tagline: site.tagline, titleSuffix: site.title_suffix,
      metaDescription: site.meta_description, ogDescription: site.og_description
    },
    outreachEmail: { subject: mail.subject, body: body }
  };
}

/* ---------- Node I/O ---------- */
if (typeof require !== 'undefined' && typeof module !== 'undefined' && require.main === module) {
  var fs = require('fs');
  var path = require('path');
  var TABLES = ['person', 'links', 'site', 'blocks', 'versions', 'sections', 'projects', 'outreach'];
  var tables = {};
  TABLES.forEach(function (n) {
    tables[n] = parseCSV(fs.readFileSync(path.join(__dirname, '..', '_data', n + '.csv'), 'utf8'));
  });
  var data = assemble(tables);
  var root = path.join(__dirname, '..');
  fs.mkdirSync(path.join(root, 'cv'), { recursive: true });
  fs.mkdirSync(path.join(root, 'outreach'), { recursive: true });
  fs.writeFileSync(path.join(root, 'index.html'), indexPage(data));
  fs.writeFileSync(path.join(root, 'resumes.html'), hubPage(data));
  data.versions.forEach(function (v) {
    fs.writeFileSync(path.join(root, 'cv', v.slug + '.html'), cvPage(v, data));
  });
  fs.writeFileSync(path.join(root, 'outreach', 'indie-email.html'), emailPage(data));
  console.log('Built index.html, ' + data.versions.length + ' CV pages, and the email template.');
}
