declare module Chat.Intranet.Interfaces {
    interface Message {
        From: string,
        To: string,
        Text: string,
        Date: Date
    }

    interface User {
        Name: string,
        CellPhone: string,
        ConnectionId: string
    }

    type typeAlert = 'success' | 'danger' | 'warning' | 'info'
    interface Alert {
        Type: typeAlert;
        Text: string;
    }
}