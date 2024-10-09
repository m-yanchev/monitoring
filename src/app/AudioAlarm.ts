//'use client'
const AUDIO_URL = "/alarm.wav"
const AUDIO_LOADING_TIMEOUT = 3000
//const NOT_BROUSER_ERROR = "If there is not brouser environment you can not use AudioAlarm"
const AUDIO_LOADING_ERROR = "Audio was not loading"

export class AudioAlarm {

    private readonly audio: HTMLAudioElement

    constructor() {
        this.audio = new Audio(AUDIO_URL)
        this.audio.loop = true
    }

    private async start() {
        return new Promise(async (resolve, reject) => {
            if (this.audio.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
                resolve(await this.audio.play())
            }
            this.audio.onloadeddata = async () => {
                resolve(await this.audio.play())
            }
            setTimeout(() => reject(new Error(AUDIO_LOADING_ERROR)), AUDIO_LOADING_TIMEOUT)
        })
    }

    private stop() {
        this.audio.pause()
        this.audio.currentTime = 0
    }

    public switch(on: boolean) {
        on ? this.start() : this.stop()
    }
}