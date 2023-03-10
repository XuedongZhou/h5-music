export interface Result {
  code: number;
  [key: string]: any;
}

export interface Banner {
  url: string;
  targetId: string;
  imageUrl: string;
}

export interface BannersData extends Result {
  banners: Banner[];
}

export interface PlayList {
  id: number;
  coverImgUrl: string;
  name: string;
  playCount: number;
}

export interface RecommendSongs extends Result {
  more: true;
  playlists: PlayList[];
}

export interface Song {
  sqMusic: Object;
  album: {
    name: string;
  };
  artists: { name: string; id: number }[];
  alias: string[];
  name: string;
  id: number;
}

export interface SimpleSong {
  sq: Object;
  al: {
    id: number;
    name: string;
    picUrl: string;
  };
  ar: { name: string; id: number }[];
  alia: string[];
  name: string;
  id: number;
  awardName: string;
}

export interface NewSongs extends Result {
  result: { song: Song }[];
}

export interface Artist {
  id: number;
  alias: string[];
  img1v1Url: string;
  picUrl: string;
  name: string;
}

export interface ArtistsData extends Result {
  artists: Artist[];
  more: boolean;
}

export interface ArtistTopSongData extends Result {
  songs: SimpleSong[];
  more: boolean;
}

export interface HotSearch {
  first: string;
}

export interface HotSearchData extends Result {
  result: { hots: HotSearch[] };
}

export interface SearchSuggest {
  keyword: string;
}

export interface HotSearchSuggestData extends Result {
  result: { allMatch: SearchSuggest[] };
}

export interface SearchMatchData extends Result {
  result: {
    songs: Song[];
  };
}

export interface Creator {
  avatarUrl: string;
  nickname: string;
}

export interface PlaylistDetail {
  name: string;
  playCount: number;
  coverImgUrl: string;
  tracks: SimpleSong[];
  creator: Creator;
  highQuality: boolean;
}

export interface PlaylistDetailData extends Result {
  playlist: PlaylistDetail;
}

export interface SongUrl {
  id: number;
  url: string;
  time: number;
}

export interface SongUrlData extends Result {
  data: SongUrl[];
}

export interface SongLyricData extends Result {
  lrc: {
    lyric: string;
  };
  tlyric: {
    lyric: string;
  };
}

export interface SongDetailData extends Result {
  songs: SimpleSong[];
}

export interface TopList {
  name: string;
  id: number;
  description: string;
  coverImgUrl: string;
  updateFrequency: string;
  ToplistType: string;
}

export interface TopListData extends Result {
  list: TopList[];
}

export interface TopListDetail {
  name: string;
  coverImgUrl: string;
  tracks: SimpleSong[];
  creator: Creator;
  description: string;
}

export interface TopListDetailData extends Result {
  playlist: TopListDetail;
}

export interface PlaySong {
  name: string;
  id: number;
  time: number;
  url: string;
  singer: string;
  picUrl: string;
  lyric?: string;
}
