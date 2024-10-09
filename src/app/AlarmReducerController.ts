import type { AlarmReducerAction, AlarmReducerActionType, AlarmReducerDispatch, AlarmReducerControllerProps, AlarmReducerState, ViewItem, ViewPing } from "./page"

const ALARM_COUNTER_MAX_SIZE = 3
const CONNECT_TIMEOUT_SYMBOL: ViewPing = "--"

export default class AlarmReducerController {

  public dispatch: AlarmReducerDispatch

  constructor(props: AlarmReducerControllerProps) {
    this.dispatch = props.dispatch
  }

  static STARTED_STATE = {on: false, isArmed: false, timeoutCounters: []}

  static reducer = (prev: AlarmReducerState, action: AlarmReducerAction): AlarmReducerState => {

    const isStartedPageState = !Boolean(action.items)

    const newTimeoutCounters: number[] = !action.items ? [] :
      action.items.map<number>((item: ViewItem, i: number) => {
        return item.ping === CONNECT_TIMEOUT_SYMBOL ? (prev.timeoutCounters[i] || 0) + 1 : 0
      })
  
    const isLongTimeout = prev.timeoutCounters.findIndex(counter => counter >= ALARM_COUNTER_MAX_SIZE) !== -1
    const newOn: boolean = prev.isArmed && !isStartedPageState && isLongTimeout  
  
    const isConnectByAll: boolean = !isStartedPageState && action.items?.findIndex(item => item.ping === CONNECT_TIMEOUT_SYMBOL) === -1
    const newIsArmed: boolean = prev.isArmed || isConnectByAll
  
    const states: {[key in AlarmReducerActionType]: AlarmReducerState} = {
      handleItemsChanged: {
        on: newOn,
        isArmed: newIsArmed,
        timeoutCounters: newTimeoutCounters
      },
      resetAlarm: {
        ...prev,
        on: false,
        isArmed: false
      }
    }

    return states[action.type]
  }

  public actions = {
    reset: () => {this.dispatch && this.dispatch({type: "resetAlarm"})},
    handleItemsChanged: (items: ViewItem[] | null) => {this.dispatch && this.dispatch({type: "handleItemsChanged", items})}
  }
}