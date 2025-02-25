export function capitalizeWords(words: string[]): string[] {
  return words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
  );
}

export const cleanPunctuation = (text: string): string => {
    return text
      .replace(/([,.])\1+/g, '$1') 
      .replace(/,([^\s])/g, ', $1')
      .replace(/\.([^\s])/g, '. $1')
      .trim();
  };