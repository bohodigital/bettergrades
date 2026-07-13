export type SearchableRecord = {
  title: string;
  description: string;
  domainName: string;
  topicName?: string;
  label: string;
  keywords: string[];
  priority: number;
};

export function normalizeSearchText(value: string): string;
export function isExpressionOnlyQuery(query: string): boolean;
export function rankSearchRecords<T extends SearchableRecord>(records: T[], query: string): T[];
