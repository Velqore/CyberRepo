export function formatStars(stars: number): string {
  if (stars >= 1000) {
    return `${(stars / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  }
  return stars.toLocaleString();
}

export function getLanguageColor(language: string | null): string {
  const colors: Record<string, string> = {
    Python: '#3572A5',
    C: '#555555',
    'C++': '#f34b7d',
    Java: '#b07219',
    Go: '#00ADD8',
    Rust: '#dea584',
    Ruby: '#701516',
    JavaScript: '#f1e05a',
    TypeScript: '#3178c6',
    Shell: '#89e051',
    HTML: '#e34c26',
    Markdown: '#083fa1',
    'C#': '#178600',
    PHP: '#4F5D95',
    Kotlin: '#A97BFF',
    Swift: '#F05138',
    Scala: '#c22d40',
    Lua: '#000080',
    Perl: '#0298c3',
    R: '#198CE7',
    Dart: '#00B4AB',
    Elixir: '#6e4a7e',
    Haskell: '#5e5086',
    Clojure: '#db5855',
  };
  return colors[language ?? ''] ?? '#8b949e';
}
