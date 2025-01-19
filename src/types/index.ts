import {SelectOption} from 'naive-ui'
export enum ActionTypes {
    EDIT = 'EDIT',
    DELETE = 'DELETE',
    ADD = 'ADD',
}

export enum parcelStatusEnum{
    DELIVERED = 'Delivered',
    IN_TRANSIT = 'In Transit',
    PENDING = 'Pending',
}

export interface RowData {
    key: number
    date: Date
    type: 'DTDC' | 'Blue Dart' | 'Xpressbees' | 'DHL' | 'UPS' | 'Delhivery'
    status: 'Delivered' | 'In Transit' | 'Pending'
}

export const parcelCompanies:SelectOption[] = [
    { label: 'DTDC', value: 'DTDC' },
    { label: 'Blue Dart', value: 'Blue Dart' },
    { label: 'Xpressbees', value: 'Xpressbees' },
    { label: 'DHL', value: 'DHL' },
    { label: 'UPS', value: 'UPS' },
    { label: 'Delhivery', value: 'Delhivery' },
]

export const parcelStatus:SelectOption[] = [
    { label: 'Delivered', value: parcelStatusEnum.DELIVERED },
    { label: 'In Transit', value: parcelStatusEnum.IN_TRANSIT },
    { label: 'Pending', value: parcelStatusEnum.PENDING },
]

export interface ParcelData {
    orderId: string
    date: number | [number, number] | null
    porterPartner: string
    parcelStatus: parcelStatusEnum
    firebaseId?: string
    key?: number | string
}