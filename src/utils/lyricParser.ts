const timeExp = /\[(\d{2,}):(\d{2})(?:\.(\d{1,3}))?]/g;

const STATE_PAUSE = 0;
const STATE_PLAYING = 1;

function noop() {}

export type LyricHandlerValue = { txt: string; lineNum: number };

export default class Lyric {
  lrc: string;
  lines: { time: number; txt: string }[];
  handler: (value: { txt: string; lineNum: number }) => void;
  state: number;
  curLine: number;
  curNum: any;
  startStamp = 0;
  timer = 0;
  pauseStamp = 0;

  constructor(lrc: string = '', handler: (value: LyricHandlerValue) => void = noop) {
    this.lrc = lrc;
    this.lines = [];
    this.handler = handler;
    this.state = STATE_PAUSE;
    this.curLine = 0;

    this._init();
  }

  _init() {
    this._initLines();
  }

  _initLines() {
    const lines = this.lrc.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const result = timeExp.exec(line) as unknown as [string, number, number, number];
      if (result) {
        const txt = line.replace(timeExp, '').trim();
        if (txt) {
          this.lines.push({
            time: result[1] * 60 * 1000 + result[2] * 1000 + (result[3] || 0) * 10,
            txt
          });
        }
      }
    }

    this.lines.sort((a, b) => {
      return a.time - b.time;
    });
  }

  _findCurNum(time: number) {
    for (let i = 0; i < this.lines.length; i++) {
      if (time <= this.lines[i].time) {
        return i;
      }
    }
    return this.lines.length - 1;
  }

  _callHandler(i: number) {
    if (i < 0) {
      return;
    }
    this.handler({
      txt: this.lines[i].txt,
      lineNum: i
    });
  }

  _playRest() {
    const line = this.lines[this.curNum];
    const delay = line.time - (+new Date() - this.startStamp);

    this.timer = setTimeout(() => {
      this._callHandler(this.curNum++);
      if (this.curNum < this.lines.length && this.state === STATE_PLAYING) {
        this._playRest();
      }
    }, delay);
  }

  play(startTime: number = 0, skipLast: boolean = false) {
    if (!this.lines.length) {
      return;
    }
    this.state = STATE_PLAYING;

    this.curNum = this._findCurNum(startTime);
    this.startStamp = +new Date() - startTime;

    if (!skipLast) {
      this._callHandler(this.curNum - 1);
    }

    if (this.curNum < this.lines.length) {
      clearTimeout(this.timer);
      this._playRest();
    }
  }

  togglePlay() {
    const now = +new Date();
    if (this.state === STATE_PLAYING) {
      this.stop();
      this.pauseStamp = now;
    } else {
      this.state = STATE_PLAYING;
      this.play((this.pauseStamp || now) - (this.startStamp || now), true);
      this.pauseStamp = 0;
    }
  }

  stop() {
    this.state = STATE_PAUSE;
    clearTimeout(this.timer);
  }

  seek(offset: number) {
    this.play(offset);
  }
}
