export class CoolDown {
  timeStart: number;
  interval: number;
  queue: number[][];
  excuteSetState: Function;
  timeOut: NodeJS.Timeout;
  timerIsOn: boolean;
  constructor(interval: number) {
    this.timeStart = Date.now();
    this.interval = interval;
    this.queue = [];
    this.excuteSetState = () => {};
    this.timeOut = setTimeout(() => {}, 0);
    clearTimeout(this.timeOut);
    this.timerIsOn = false;
  }
  setNow() {
    this.timeStart = Date.now();
  }
  ready(): boolean {
    return Date.now() - this.timeStart > this.interval ? true : false;
  }
}
