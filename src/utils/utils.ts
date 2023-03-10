export const numberFormat = (count: number | null | undefined) => {
  if (count === undefined || count === null) {
    return 0;
  }
  const param: { value: string | number; unit: string } = {
    value: count,
    unit: ''
  };
  const k = 10000;
  const sizes = ['', '万', '亿', '万亿'];
  let i;
  if (count < k) {
    param.value = count;
    param.unit = '';
  } else {
    i = Math.floor(Math.log(count) / Math.log(k));
    param.value = (count / Math.pow(k, i)).toFixed(1);
    param.unit = sizes[i];
  }
  return param.value + param.unit;
};

export const getArtists = (artists?: { name: string }[]) => {
  return artists?.map((item) => item.name).join(' / ');
};

export interface Lyric {
  time: number;
  lyric: string;
  uid: number;
}

export interface ReturnLyric {
  lyric: Lyric[];
  tlyric?: Lyric[];
}

function getRandomInt(max: number) {
  return Math.floor(Math.random() * (max + 1));
}

function swap<T>(arr: Array<T>, i: number, j: number) {
  const t = arr[i];
  arr[i] = arr[j];
  arr[j] = t;
}

export function shuffle<T>(source: Array<T>) {
  const arr = source.slice();
  for (let i = 0; i < arr.length; i++) {
    const j = getRandomInt(i);
    swap(arr, i, j);
  }
  return arr;
}

export function formatTime(interval: number) {
  interval = interval | 0;
  const minute = (((interval / 60) | 0) + '').padStart(2, '0');
  const second = ((interval % 60) + '').padStart(2, '0');
  return `${minute}:${second}`;
}
