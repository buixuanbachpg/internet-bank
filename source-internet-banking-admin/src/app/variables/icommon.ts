export interface Employee {
    address: string;
    email: string;
    full_name: string;
    permission: string;
    phone: string;
    sex: string;
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

export interface DetailPerson {

}

export interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
    permission: string;
}

export let RoutePath: RouteInfo[] = [
    { path: '/manager', title: 'Employee Manager', icon: 'ni-badge text-primary', class: '', permission: '1' },
    { path: '/report', title: 'Trade Report', icon: 'ni-single-copy-04 text-primary', class: '', permission: '1' },
    { path: '/customer', title: 'Register Customer', icon: 'ni-single-02 text-primary', class: '', permission: '0' },
    { path: '/trade', title: 'Trade', icon: 'ni-credit-card text-primary', class: '', permission: '0' },
    { path: '/reviewtrade', title: 'Trade Review', icon: 'ni-money-coins text-primary', class: '', permission: '0' }
];
