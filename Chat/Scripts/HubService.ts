module Chat.Intranet.Services {
    import Data = Chat.Intranet.Interfaces;

    export class HubService {
        public static $inject = ["$", "$rootScope"];

        public proxy: any;
        public connection: any;
        constructor(public $, public $rootScope: ng.IRootScopeService) {
        }

        Connect(){
            this.connection = this.$.hubConnection();

            this.proxy = this.connection.createHubProxy('HubMessage');
            this.proxy.on('messageAdded', (from, text) => {
                var message = { From: from, To: this.connection.id, Text: text, Date: new Date() } as Data.Message;
                this.$rootScope.$broadcast('messageAdded', message);
            });

            this.proxy.on('requestedToShow', (cellPhone, requestedConnectionId, requestedName, requestedCellPhone) => {
                var userToShow = { CellPhone: cellPhone } as Data.User;
                var userRequested = { Name: requestedName, CellPhone: requestedCellPhone, ConnectionId: requestedConnectionId } as Data.User;
                this.$rootScope.$broadcast('requestedToShow', userToShow, userRequested);
            });

            this.proxy.on('userShowed', (name, cellPhone, connectionId) => {
                var user = { Name: name, CellPhone: cellPhone, ConnectionId: connectionId } as Data.User;
                this.$rootScope.$broadcast('userShowed', user);
            });

            this.proxy.on('connectionIdUpdated', (connectionId, cellPhone) => {
                var user = { ConnectionId: connectionId, CellPhone: cellPhone } as Data.User;
                this.$rootScope.$broadcast('connectionIdUpdated', user);
            })

            return this.connection.start();
        }

        IsConnecting(): boolean {
            return this.connection.state === 0;
        }

        IsConnected(): boolean {
            return this.connection.state === 1;
        }

        ConnectionState(): number {
            return this.connection.state;
        }

        ConnectionId(): string {
            return this.connection.id;
        }

        SendMessage(msg: Data.Message) {
            this.proxy.invoke('SendMessage', msg.From, msg.To, msg.Text);
        }

        ShowMySelf(mySelf: Data.User, to: Data.User) {
            this.proxy.invoke('ShowMySelf', mySelf.Name, mySelf.CellPhone, mySelf.ConnectionId, to.ConnectionId);
        }

        RequestToShow(showUser: Data.User, mySelf: Data.User) {
            this.proxy.invoke('RequestToShow', showUser.CellPhone, mySelf.ConnectionId, mySelf.Name, mySelf.CellPhone);
        }

        UpdateConnectionId(user: Data.User, to: Data.User) {
            this.proxy.invoke('UpdateConnectionId', user.ConnectionId, user.CellPhone, to.ConnectionId);
        }
    }
}