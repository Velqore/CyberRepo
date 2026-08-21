async function check() {
  const urls = [
    'https://github.com/sepinf-inc/IPED',
    'https://github.com/korczis/foremost',
    'https://github.com/sleuthkit/scalpel',
    'https://github.com/simsong/bulk_extractor',
  ];
  for (const u of urls) {
    try {
      const res = await fetch(u, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      console.log(u, '=>', res.status);
    } catch (e: any) {
      console.log(u, '=> ERROR:', e.message);
    }
  }
}
check();
