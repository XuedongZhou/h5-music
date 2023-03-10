export type GetRecommendSongs = {
  limit: number;
};

export type GetSearchSuggest = {
  keywords: string;
  type: 'mobile';
};

export type GetSearchMatch = {
  keywords: string;
  limit?: number;
};
