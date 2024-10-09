export default class MTime {

    static cur(): Date {
        return new Date()
    }

    static earlier(sec: number): Date {
        const curTime = MTime.cur()
        curTime.setSeconds(curTime.getSeconds() - sec)
        return curTime
    }
}