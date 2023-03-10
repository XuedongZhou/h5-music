import { http } from '@/utils/request';
import type {
  BannersData,
  RecommendSongs,
  NewSongs,
  ArtistsData,
  HotSearchData,
  HotSearchSuggestData,
  SearchMatchData,
  PlaylistDetailData,
  ArtistTopSongData,
  SongUrlData,
  SongDetailData,
  SongLyricData,
  TopListData,
  TopListDetailData,
  PlaySong
} from './interface';
import type { GetRecommendSongs, GetSearchMatch, GetSearchSuggest } from './type';

export function queryBanners() {
  return http<BannersData>({
    url: '/banner',
    method: 'get'
  });
}

export function queryRecommendSongs(params: GetRecommendSongs) {
  return http<RecommendSongs>({
    url: '/top/playlist/highquality',
    method: 'get',
    params: params
  });
}

export function queryNewSongs() {
  return http<NewSongs>({
    url: '/personalized/newsong',
    method: 'get'
  });
}

export function queryArtists() {
  return http<ArtistsData>({
    url: '/top/artists',
    method: 'get'
  });
}

export function queryArtistTopSong(params: { id: string }) {
  return http<ArtistTopSongData>({
    url: '/artist/top/song',
    method: 'get',
    params
  });
}

export function querySearchHotDetail() {
  return http<HotSearchData>({
    url: '/search/hot',
    method: 'get'
  });
}

export function querySearchSuggest(params: GetSearchSuggest) {
  return http<HotSearchSuggestData>({
    url: '/search/suggest',
    method: 'get',
    params
  });
}

export function querySearchMatch(params: GetSearchMatch) {
  return http<SearchMatchData>({
    url: '/search',
    method: 'get',
    params
  });
}

export function queryPlaylistDetail(params: { id: string }) {
  return http<PlaylistDetailData>({
    url: '/playlist/detail',
    method: 'get',
    params
  });
}

export function querySongInfo(id: number): Promise<PlaySong> {
  return new Promise((resolve, reject) => {
    Promise.all([querySongDetail({ ids: id }), querySongUrl({ id })])
      .then((resAll) => {
        const detailData = resAll[0].songs[0];
        const urlData = resAll[1].data[0];
        if (urlData && detailData) {
          const data: PlaySong = {
            id: urlData.id,
            url: urlData.url,
            time: urlData.time ? Math.floor(urlData.time / 1000) : 0,
            name: detailData.name,
            picUrl: detailData.al.picUrl
              ? detailData.al.picUrl + '?imageView&thumbnail=250y250&quality=75&tostatic=0'
              : '',
            singer: detailData.ar.map((item) => item.name).join('/')
          };
          resolve(data);
        } else {
          reject(new Error('获取歌曲失败'));
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function querySongUrl(params: { id: number }) {
  return http<SongUrlData>({
    url: '/song/url',
    method: 'get',
    params
  });
}

export function querySongLyric(params: { id: number }) {
  return http<SongLyricData>({
    url: '/lyric',
    method: 'get',
    params
  });
}

export function querySongDetail(params: { ids: number }) {
  return http<SongDetailData>({
    url: '/song/detail',
    method: 'get',
    params
  });
}

export function queryCheckMusic(params: { id: number }) {
  return http<{ success: boolean; message: string }>({
    url: '/check/music',
    method: 'get',
    params
  });
}

export function queryTopList() {
  return http<TopListData>({
    url: '/toplist',
    method: 'get'
  });
}

export function queryTopListByIdx(params: { id: string }) {
  return http<TopListDetailData>({
    url: '/top/list',
    method: 'get',
    params
  });
}
