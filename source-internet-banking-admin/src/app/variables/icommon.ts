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

export interface Person {
    account_number: string;
    address: string;
    email: string;
    full_name: string;
    phone: string;
    sex: string;
    username: string;
}

export interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
    permission: string;
}

export let RoutePath: RouteInfo[] = [
    { path: '/manager', title: 'Quản lý nhân viên', icon: 'ni-badge text-primary', class: '', permission: '1' },
    { path: '/report', title: 'Báo cáo giao dịch liên ngân hàng', icon: 'ni-single-copy-04 text-primary', class: '', permission: '1' },
    { path: '/user-profile', title: 'Thông tin cá nhân', icon: 'ni-single-02 text-primary', class: '', permission: '0' },
    { path: '/customer', title: 'Đăng ký khách hàng', icon: 'ni-paper-diploma text-primary', class: '', permission: '0' },
    { path: '/trade', title: 'Nạp tiền', icon: 'ni-credit-card text-primary', class: '', permission: '0' },
    { path: '/reviewtrade', title: 'Lịch sử giao dịch', icon: 'ni-money-coins text-primary', class: '', permission: '0' }
];
