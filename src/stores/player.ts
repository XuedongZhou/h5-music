import { reactive } from 'vue';
import { defineStore } from 'pinia';
import { querySongInfo } from '@/services/api';
import type { PlaySong } from '@/services/interface';
import { shuffle } from '@/utils/utils';
import { load } from '@/utils/arrayStore';
import { FAVORITE_KEY } from '@/config/constant';

export enum PlayMode {
  Sequence = 0,
  Loop = 1,
  Random = 2
}

export type PlayerState = {
  value: {
    sequenceList: PlaySong[];
    playlist: PlaySong[];
    playing: boolean;
    playMode: PlayMode;
    currentIndex: number;
    fullScreen: boolean;
    favoriteList: PlaySong[];
    playHistory: [];
  };
};

function findIndex(list: PlaySong[], song: PlaySong) {
  return list.findIndex((item) => {
    return item.id === song.id;
  });
}

export const usePlayerStore = defineStore('player', () => {
  const state = reactive<PlayerState>({
    value: {
      sequenceList: [],
      playlist: [],
      playing: false,
      playMode: PlayMode.Sequence,
      currentIndex: 0,
      fullScreen: false,
      favoriteList: load(FAVORITE_KEY),
      playHistory: []
    }
  });

  const addSong = async (id: number) => {
    try {
      const song = await querySongInfo(id);
      const playIndex = findIndex(state.value.playlist, song);

      if (playIndex > -1) {
        state.value.currentIndex = playIndex;
      } else {
        state.value.playlist.push(song);
        state.value.currentIndex = state.value.playlist.length - 1;
      }

      const sequenceIndex = findIndex(state.value.sequenceList, song);
      if (sequenceIndex === -1) {
        state.value.sequenceList.push(song);
      }

      state.value.playing = true;
      state.value.fullScreen = true;
    } catch (error) {
      console.error(error);
    }
  };

  const addSongLyric = (id: number, lyric: string) => {
    state.value.sequenceList.map((item) => {
      if (item.id === id) {
        item.lyric = lyric;
      }
      return item;
    });
  };

  const removeSong = (song: PlaySong) => {
    const sequenceList = state.value.sequenceList.slice();
    const playlist = state.value.playlist.slice();

    const sequenceIndex = findIndex(sequenceList, song);
    const playIndex = findIndex(playlist, song);
    if (sequenceIndex < 0 || playIndex < 0) {
      return;
    }

    sequenceList.splice(sequenceIndex, 1);
    playlist.splice(playIndex, 1);

    let currentIndex = state.value.currentIndex;
    if (playIndex < currentIndex || currentIndex === playlist.length) {
      currentIndex--;
    }

    updateState({ currentIndex, playlist, sequenceList });

    if (state.value.playlist.length === 0) {
      state.value.playing = false;
    }
  };

  const clearSongList = () => {
    state.value.currentIndex = 0;
    state.value.sequenceList = [];
    state.value.playlist = [];
    state.value.playing = false;
  };

  const updateState = (value: Partial<PlayerState['value']>) => {
    state.value = { ...state.value, ...value };
  };

  const getCurrentSong = () => {
    return state.value.playlist[state.value.currentIndex] || {};
  };

  const changeMode = (mode: PlayMode) => {
    const currentId = getCurrentSong().id;
    if (mode === PlayMode.Random) {
      state.value.playlist = shuffle(state.value.sequenceList);
    } else {
      state.value.playlist = state.value.sequenceList;
    }

    const index = state.value.playlist.findIndex((song) => {
      return song.id === currentId;
    });

    state.value.currentIndex = index;
    state.value.playMode = mode;
  };

  return {
    state,
    getCurrentSong,
    updateState,
    addSong,
    addSongLyric,
    removeSong,
    clearSongList,
    changeMode
  };
});
