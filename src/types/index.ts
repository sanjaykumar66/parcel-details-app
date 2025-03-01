import {SelectOption} from 'naive-ui'
import { Value } from 'naive-ui/es/select/src/interface'
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
    storeCode: string
    invoiceNumber: string
    invoiceDate: Value | string | null | undefined | any
    despatchDate: Value | string | null | undefined | any
    cases: number | null
    labels?: string[]
    transporter:string
    status:parcelStatusEnum
    key?:string
    trackingId?:string | null
}   

export enum topBarTabs {
    PARCEL = 'Parcel',
    STORE = 'Store',
}

export interface StoreData {
    address: string
    allowBill: boolean
    alternatecode: number
    area: number
    areaName: string
    code: number
    creditDays: string
    creditLimit: string
    custCategory: number
    email: string
    gstNo: string
    location: string
    mobile: number | string
    name: string
    phone1: number | string
    phone2: number | string
    place: string
    salesMan: string
    state: string
    street: string
    webPassword: string
    key:string
}

export interface SalesMan {
    key?: string
    name: string
    mobile?: number | string
    email?: string
    code?: number
}