import type { FetchItem, NetworkName, NetworkViewName, ViewItem, ViewItemsUpdate, ViewPing } from "./page"

const VIEW_ITEMS_ARRAY_ORDER: NetworkName[] = ["starlink", "dnipro", "kyivstar"]
const NETWORK_NAME_MAP: {[Property in NetworkName]: NetworkViewName} = {
    "dnipro": 'Мережа "Дніпро"',
    "starlink": 'Термінал "Starlink"',
    "tooway": 'Термінал "Tooway"',
    "kyivstar": 'Провайдер "Київстар"',
    "local": 'Місцевий провайдер'
  }  
const CONNECT_TIMEOUT_SYMBOL: ViewPing = "--"
const SERVER_URL = "http://localhost:3000/api/networkcanalsstates"
const MS_NUMBER_BETWEEN_MEASUREMENTS_REQUEST = 3000

export default class ViewItemsFetcherTimer {

    private timer: NodeJS.Timeout | null
    private readonly updateItems: ViewItemsUpdate

    constructor(updateItems: ViewItemsUpdate) {
        this.timer = null
        this.updateItems = updateItems
    }

    private adopte(items: FetchItem[]): ViewItem[] {
        return VIEW_ITEMS_ARRAY_ORDER.map<ViewItem>(network => {
          const item = items.find(item => item.network === network)
          return {
            network: NETWORK_NAME_MAP[network],
            ping: (!item || item.ping ===-1) ? CONNECT_TIMEOUT_SYMBOL : item.ping  
        }})
      }

    private async fetch(): Promise<FetchItem[]> {
        const response = await fetch(SERVER_URL)
        return await response.json()
    }
    
    public start() {
        this.timer = setInterval(async () => {
            const items = await this.fetch()
            this.updateItems(this.adopte(items))
          }, MS_NUMBER_BETWEEN_MEASUREMENTS_REQUEST)
    }

    public stop() {
        this.timer && clearInterval(this.timer)
    }
}