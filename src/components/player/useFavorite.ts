import { computed } from 'vue';
import { usePlayerStore } from '@/stores/player';
import { remove, save } from '@/utils/arrayStore';
import type { PlaySong } from '@/services/interface';
import { FAVORITE_KEY } from '@/config/constant';

export default function useFavorite() {
  const store = usePlayerStore();
  const favoriteList = computed(() => store.state.value.favoriteList);
  const maxLen = 100;

  function getFavoriteIcon(song: PlaySong) {
    return isFavorite(song) ? 'icon-favorites-fill' : 'icon-favorites';
  }

  function toggleFavorite(song: PlaySong) {
    let list: PlaySong[];
    if (isFavorite(song)) {
      list = remove(FAVORITE_KEY, compare);
    } else {
      list = save(song, FAVORITE_KEY, compare, maxLen);
    }
    store.updateState({ favoriteList: list });

    function compare(item: PlaySong) {
      return item.id === song.id;
    }
  }

  function isFavorite(song: PlaySong) {
    return (
      favoriteList.value.findIndex((item) => {
        return item.id === song.id;
      }) > -1
    );
  }

  return {
    getFavoriteIcon,
    toggleFavorite
  };
}
