export function capitalizeWords(words: string[]): string[] {
  return words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
  );
}
