export type Menu = {
  id: number | string;        // ← รองรับ local-xxx
  title: string;
  image: string;
  imageType?: string;
};

// The API response shape for complexSearch
export type MenuResponse = {
  results: Menu[];
  offset?: number;
  number?: number;
  totalResults: number;
};