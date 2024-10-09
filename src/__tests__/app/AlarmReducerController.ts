import AlarmReducerController from "@/app/AlarmReducerController"
import type {AlarmReducerAction, AlarmReducerState} from "@/app/page"

describe("app alarmReducer", () => {

    test("items = null, expect state = {on: false, isArmed: false, timeoutCounters: []}", () => {

        const mockState: AlarmReducerState = {on: false, isArmed: false, timeoutCounters: []}
        const mockAction: AlarmReducerAction = {type: "handleItemsChanged", items: null}

        const expState: AlarmReducerState = {on: false, isArmed: false, timeoutCounters: []}

        expect(AlarmReducerController.reducer(mockState, mockAction)).toEqual(expState)
    })

    test("items = null => [{network: '...', ping: -1}], expect state = {on: false, isArmed: false, timeoutCounters: [1]}", () => {

        const mockState: AlarmReducerState = {on: false, isArmed: false, timeoutCounters: []}
        const mockAction: AlarmReducerAction = {type: "handleItemsChanged", items: [{network: 'Мережа "Дніпро"', ping: "--"}]}

        const expState: AlarmReducerState = {on: false, isArmed: false, timeoutCounters: [1]}

        expect(AlarmReducerController.reducer(mockState, mockAction)).toEqual(expState)
    })

    test("items = [{network: '...', ping: -1}], expect state = {on: false, isArmed: false, timeoutCounters: [5]}", () => {

        const mockState: AlarmReducerState = {on: false, isArmed: false, timeoutCounters: [4]}
        const mockAction: AlarmReducerAction = {type: "handleItemsChanged", items: [{network: 'Мережа "Дніпро"', ping: "--"}]}

        const expState: AlarmReducerState = {on: false, isArmed: false, timeoutCounters: [5]}

        expect(AlarmReducerController.reducer(mockState, mockAction)).toEqual(expState)
    })

    test("items = [{network: '...', ping: 35}], expect state = {on: false, isArmed: true, timeoutCounters: [0]}", () => {

        const mockState: AlarmReducerState = {on: false, isArmed: false, timeoutCounters: [5]}
        const mockAction: AlarmReducerAction = {type: "handleItemsChanged", items: [{network: 'Мережа "Дніпро"', ping: 35}]}

        const expState: AlarmReducerState = {on: false, isArmed: true, timeoutCounters: [0]}

        expect(AlarmReducerController.reducer(mockState, mockAction)).toEqual(expState)
    })

    test("items = [{network: '...', ping: --}], expect state = {on: true, isArmed: false, timeoutCounters: [4]}", () => {

        const mockState: AlarmReducerState = {on: false, isArmed: true, timeoutCounters: [3]}
        const mockAction: AlarmReducerAction = {type: "handleItemsChanged", items: [{network: 'Мережа "Дніпро"', ping: "--"}]}

        const expState: AlarmReducerState = {on: true, isArmed: true, timeoutCounters: [4]}

        expect(AlarmReducerController.reducer(mockState, mockAction)).toEqual(expState)
    })

    test("items = [{..., ping: --}, {..., ping: 20}], expect state = {on: false, isArmed: false, timeoutCounters: [...]}", () => {

        const mockState: AlarmReducerState = {on: false, isArmed: false, timeoutCounters: [5, 0]}
        const mockAction: AlarmReducerAction = {
            type: "handleItemsChanged", 
            items: [{network: 'Мережа "Дніпро"', ping: "--"}, {network: 'Термінал "Starlink"', ping: 20}]
        }

        const expState: AlarmReducerState = {on: false, isArmed: false, timeoutCounters: [6, 0]}

        expect(AlarmReducerController.reducer(mockState, mockAction)).toEqual(expState)
    })

    test("items = [{..., ping: 10}, {..., ping: 20}], mock state = {on: false, isArmed: false, ...}, expect state = {on: false, isArmed: true, ...}", () => {

        const mockState: AlarmReducerState = {on: false, isArmed: false, timeoutCounters: [5, 0]}
        const mockAction: AlarmReducerAction = {
            type: "handleItemsChanged", 
            items: [{network: 'Мережа "Дніпро"', ping: 10}, {network: 'Термінал "Starlink"', ping: 20}]
        }

        const expState: AlarmReducerState = {on: false, isArmed: true, timeoutCounters: [0, 0]}

        expect(AlarmReducerController.reducer(mockState, mockAction)).toEqual(expState)
    })

    test("items = [{..., ping: 10}, {..., ping: 20}], mock state = {on: false, isArmed: true, ...}, expect state = {on: true, isArmed: true, ...}", () => {

        const mockState: AlarmReducerState = {on: false, isArmed: true, timeoutCounters: [1, 2]}
        const mockAction: AlarmReducerAction = {
            type: "handleItemsChanged", 
            items: [{network: 'Мережа "Дніпро"', ping: 10}, {network: 'Термінал "Starlink"', ping: 20}]
        }

        const expState: AlarmReducerState = {on: false, isArmed: true, timeoutCounters: [0, 0]}

        expect(AlarmReducerController.reducer(mockState, mockAction)).toEqual(expState)
    })

})