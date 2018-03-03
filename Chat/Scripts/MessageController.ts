module Chat.Intranet.Controllers {
    import Data = Chat.Intranet.Interfaces;
    
    export class MessageController implements ng.IController {
        public static $inject = ["$scope", "HubService", "$sessionStorage", "$timeout"];
        $onInit = () => { };

        txtMessage: string;
        firstConnection: boolean = true;
        contactSelected: Data.User;
        cellphoneToAdd: string;
        showNewPhoneField: boolean = false;
        alerts: Data.Alert[] = [];
        listContactsToUpdateMyConnectionId: Data.User[];

        constructor(public $scope, public service: Services.HubService, public $sessionStorage, public $timeout: ng.ITimeoutService) {
            this.DefineWhatchers();

            this.Messages = this.Messages ? this.Messages : [];
            this.UserLoged = this.UserLoged ? this.UserLoged : { Name: null, CellPhone: null, ConnectionId: null };
            this.Contacts = this.Contacts ? this.Contacts : [];
            
            if (this.UserLoged.CellPhone) this.Connect();
        }

        get Messages(): Data.Message[] { return this.$sessionStorage.messages as Data.Message[]; }
        set Messages(list: Data.Message[]) { this.$sessionStorage.messages = list; }

        get UserLoged(): Data.User { return this.$sessionStorage.logedUser as Data.User }
        set UserLoged(user: Data.User) { this.$sessionStorage.logedUser = user; }

        get Contacts(): Data.User[] { return this.$sessionStorage.contacts as Data.User[] }
        set Contacts(list: Data.User[]) { this.$sessionStorage.contacts = list;}

        DefineWhatchers() {
            this.$scope.$on('messageAdded', (event, msg: Data.Message) => {
                this.Messages.push(msg);
                this.$scope.$apply();
            });

            this.$scope.$on('requestedToShow', (event, userToShow: Data.User, userRequested: Data.User) => {
                this.HandleRequestToShow(userToShow, userRequested);
                this.$scope.$apply();
            });

            this.$scope.$on('userShowed', (event, user: Data.User) => {
                this.Contacts.push(user);
                this.$scope.$apply();
            });

            this.$scope.$on('connectionIdUpdated', (event, user: Data.User) => {
                this.HandleContactUpdated(user);
                this.$scope.$apply();
            });

            this.$scope.$on('didUpdated', (event, contact: Data.User) => {
                this.listContactsToUpdateMyConnectionId = this.listContactsToUpdateMyConnectionId.filter(a => a.ConnectionId != contact.ConnectionId);
            });
        }

        HandleContactUpdated(newUser: Data.User) {
            var user = this.Contacts.filter(a => a.CellPhone == newUser.CellPhone)[0];
            this.UpdateMessages(newUser, user);
            user.ConnectionId = newUser.ConnectionId;
        }

        UpdateMessages(newUser: Data.User, oldUser: Data.User) {
            this.Messages.filter(a => a.From == oldUser.ConnectionId).forEach(a => { a.From = newUser.ConnectionId; })
            this.Messages.filter(a => a.To == oldUser.ConnectionId).forEach(a => { a.To = newUser.ConnectionId; })
        }

        HandleRequestToShow(userToShow: Data.User, userRequested: Data.User) {
            if (this.UserLoged.CellPhone != userToShow.CellPhone)
                return;

            if (this.Contacts.filter(a => a.CellPhone == userRequested.CellPhone).length)
                this.HandleContactUpdated(this.Contacts.filter(a => a.CellPhone == userRequested.CellPhone)[0]);
            else
                this.Contacts.push(userRequested);

            this.service.ShowMySelf(this.UserLoged, userRequested);
        }

        FirstConnection() {
            this.service.Connect().done(() => {
                this.UserLoged.ConnectionId = this.service.ConnectionId();
                this.$scope.$apply();
            });
        }

        Connect() {
            this.service.Connect().done(() => {
                this.UpdateMessages(angular.extend({}, this.UserLoged, { ConnectionId: this.service.ConnectionId() } as Data.User), this.UserLoged);
                this.UserLoged.ConnectionId = this.service.ConnectionId();
                this.listContactsToUpdateMyConnectionId = angular.extend([], this.Contacts);
                this.UpdateConnectionIdToContacts();
                this.$scope.$apply();
            })
        }

        UpdateConnectionIdToContacts() {
            if (!!this.listContactsToUpdateMyConnectionId) {
                this.listContactsToUpdateMyConnectionId.forEach(a => { this.service.UpdateConnectionId(this.UserLoged, a); })
                this.$timeout(this.UpdateConnectionIdToContacts, 30000);
            }
        }

        SendMessage() {
            var msg: Data.Message = { Date: new Date(), From: this.UserLoged.ConnectionId, To: this.contactSelected.ConnectionId, Text: this.txtMessage };
            this.Messages.push(msg);
            this.service.SendMessage(msg);
            this.txtMessage = null;
        }

        LastMessage(user: Data.User): Data.Message {
            var msgs = this.Messages && this.Messages.filter(a => a.From == user.ConnectionId || a.To == user.ConnectionId);
            return msgs[msgs.length - 1];             
        }

        Clean() {
            this.Messages = [];
            this.UserLoged = { Name: null, CellPhone: null, ConnectionId: null };
            this.Contacts = [];
            this.firstConnection = true;
        }

        SelectContact(contact: Data.User) {
            this.contactSelected = contact;
        }

        RequestAddUser() {
            this.showNewPhoneField = false;
            this.service.RequestToShow({ CellPhone: this.cellphoneToAdd } as Data.User, this.UserLoged);
            this.cellphoneToAdd = null;

            this.InsertAlert("Solicitado o contato do usuário", "success");
        }

        InsertAlert(msg: string, type: Data.typeAlert = 'success') {
            this.alerts.push({ Text: msg, Type: type } as Data.Alert);
        }

        DidISend(msg: Data.Message): boolean {
            return msg.From == this.UserLoged.ConnectionId;
        }

        ListOfMessages(): Data.Message[] {
            return this.contactSelected && this.Messages && this.Messages.filter(a => a.From == this.contactSelected.ConnectionId || a.To == this.contactSelected.ConnectionId);
        }

        SelectedUserIsLogged(): boolean {
            return !!this.listContactsToUpdateMyConnectionId.filter(a => a.ConnectionId == this.contactSelected.ConnectionId).length;
        }
    }
}