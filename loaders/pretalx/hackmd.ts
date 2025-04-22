export interface HackmdUrlMapping {
  [key: string]: {
    Name?: string
    URL: string
  }
}

export const getHackmdUrlMapping = (year: number) => `https://github.com/COSCUP/${year}/raw/master/scripts/pre-build/hackmd_url_mappings.json`
