module Chat.Intranet.Controllers {
    import Data = Chat.Intranet.Interfaces;
    
    export class MessageController implements ng.IController {
        public static $inject = ["$scope", "HubService", "$sessionStorage"];
        $onInit = () => { };

        txtMessage: string;
        firstConnection: boolean = true;
        contactSelected: Data.User;
        cellphoneToAdd: string;
        showNewPhoneField: boolean = false;
        alerts: Data.Alert[] =[];
        constructor(public $scope, public service: Services.HubService, public $sessionStorage) {
            this.DefineWhatchers();

            this.Messages = this.Messages ? this.Messages : [];
            this.UserLoged = this.UserLoged ? this.UserLoged : { Name: null, CellPhone: null, ConnectionId: null };
            this.Contacts = this.Contacts ? this.Contacts : [];

            this.UserLoged.ConnectionId = null;
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
            });

            this.$scope.$on('connectionIdUpdated', (event, user: Data.User) => {
                this.HandleContactUpdated(user);
            })
        }

        HandleContactUpdated(user: Data.User) {
            this.Contacts.filter(a => a.CellPhone == user.CellPhone)[0].ConnectionId = user.ConnectionId;
        }

        HandleRequestToShow(userToShow: Data.User, userRequested: Data.User) {
            if (this.UserLoged.CellPhone == userToShow.CellPhone) {
                this.Contacts.push(userRequested);
                this.service.ShowMySelf(this.UserLoged, userRequested);
            }
        }

        FirstConnection() {
            this.service.Connect().done(() => {
                this.UserLoged.ConnectionId = this.service.ConnectionId();
                this.$scope.$apply();
            });
        }

        Connect() {
            this.service.Connect().done(() => {
                this.UserLoged.ConnectionId = this.service.ConnectionId();
                this.Contacts.forEach(a => { this.service.UpdateConnectionId(this.UserLoged, a); })
                this.$scope.$apply();
            })
        }

        SendMessage() {
            var msg: Data.Message = { Date: new Date(), From: this.UserLoged.ConnectionId, To: this.contactSelected.ConnectionId, Text: this.txtMessage };
            this.Messages.push(msg);
            this.service.SendMessage(msg);
            this.txtMessage = null;
        }

        LastMessage(user: Data.User): string {
            var msgs = this.Messages && this.Messages.filter(a => a.From == user.ConnectionId || a.To == user.ConnectionId);
            return msgs && msgs[msgs.length - 1] && msgs[msgs.length - 1].Text;             
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
        
    }
}