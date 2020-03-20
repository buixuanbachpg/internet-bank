export interface Employee {
    position: number;
    name: string;
    sex: string;
    email: string;
    phone: string;
    address: string;
}

export interface Msg {
    Text: string;
    Title: number;
}

export interface Report {
    position: number;
    time: string;
    source: string;
    destination: string;
    bank: string;
    money: string;
}