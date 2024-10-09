'use client'
import { useEffect, useReducer, useState } from "react";
import { AudioAlarm } from "./AudioAlarm";
import ViewItemsFetcherTimer from "./ViewItemsFetcherTimer";
import AlarmReducerController from "./AlarmReducerController";

export interface FetchItem {
  network: NetworkName
  ping: number
}

type MainBoxProps = {
  resetAlarm: () => void
  onAlarm: boolean
  items: ViewItem[] | null
}

type PingBoxProps = {
  item: ViewItem
}

type AlarmButtonProps = {
  onClick: () => void
}

export type NetworkName = "dnipro" | "starlink" | "tooway" | "kyivstar" | "local"

type UsingAlarmStateProps = {
  items: ViewItem[] | null,
}

export interface ViewItem {
  network: NetworkViewName
  ping: ViewPing
}

export type ViewItemsUpdate = (items: ViewItem[] | null) => void

export type NetworkViewName = 'Мережа "Дніпро"' | 'Термінал "Starlink"' | 'Термінал "Tooway"' | 'Провайдер "Київстар"' | 'Місцевий провайдер'

export type ViewPing = number | "--"

export interface AlarmReducerControllerProps {
  dispatch: AlarmReducerDispatch
}

export interface AlarmReducerState {
  on: boolean
  isArmed: boolean
  timeoutCounters: number[]
}

export type AlarmReducerDispatch = (action: AlarmReducerAction) => void

export interface AlarmReducerAction {
  type: AlarmReducerActionType
  items?: ViewItem[] | null
}

export type AlarmReducerActionType =  "handleItemsChanged" | "resetAlarm"

type AlarmReducer = (state: AlarmReducerState, action: AlarmReducerAction) => AlarmReducerState

const RESET_BUTTON_LABEL = "Вимкнути звукову тривогу"

export default function Home() {
  
  const items = useDataFetch()
  const [resetAlarm, onAlarm] = useAlarmState({items})

  return <MainBox items={items} resetAlarm={resetAlarm} onAlarm={onAlarm}/>
}

function useDataFetch(): ViewItem[] | null {

  const [items, updateItems] = useState<ViewItem[] | null>(null)

  useEffect(() => {
    const timer = new ViewItemsFetcherTimer(updateItems)
    timer.start()
    return () => timer.stop()
  }, [])

  return items
}

function useAlarmState(props: UsingAlarmStateProps): [() => void, boolean] {

  const {items} = props

  const [alarm, setAudioAlarm] = useState<AudioAlarm | null>(null)
  const [state, dispatch] = useReducer<AlarmReducer>(AlarmReducerController.reducer, AlarmReducerController.STARTED_STATE)
  const [controller] = useState<AlarmReducerController>(new AlarmReducerController({dispatch}))

  useEffect(() => {setAudioAlarm(new AudioAlarm())}, [])
  useEffect(() => {alarm?.switch(state.on)}, [alarm, state.on])
  useEffect(() => {controller.actions.handleItemsChanged(items)}, [controller.actions, items])

  return [controller.actions.reset, state.on]
}

function MainBox(props: MainBoxProps) {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3">
          {props.items?.map<JSX.Element>(item => (
            <PingBox key={item.network} item={item}/>
          ))}
        </dl>
        {props.onAlarm && <AlarmButton onClick={props.resetAlarm}/>}
      </div>
    </div>
  )
}

function PingBox(props: PingBoxProps) {

  return (
    <div className="mx-auto flex max-w-xs flex-col gap-y-4">
      <dt className="text-base leading-7 text-gray-600">{props.item.network}</dt>
      <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">{props.item.ping}</dd>
    </div>
  )
}

function AlarmButton(props: AlarmButtonProps) {
  return (
    <div className="flex my-20 justify-center">
        <button type="submit" onClick={props.onClick}
                className="flex w-full max-w-xs justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          {RESET_BUTTON_LABEL}
        </button>
    </div>
  )
}

