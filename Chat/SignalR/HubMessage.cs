using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;

namespace Chat.SignalR
{
    [HubName("HubMessage")]
    public class HubMessage : Hub
    {
        public void SendMessage(string from, string to, string msg)
        {
            Clients.Client(to).messageAdded(from, msg);
        }

        public void ShowMySelf(string name, string cellPhone, string connectionId, string reviewTo)
        {
            Clients.Client(reviewTo).userShowed(name, cellPhone, connectionId);
        }

        public void RequestToShow(string cellPhone, string requestedConnectionId, string requestedName, string requestedCellPhone)
        {
            Clients.All.requestedToShow(cellPhone, requestedConnectionId, requestedName, requestedCellPhone);
        }

        public void UpdateConnectionId(string connectionId, string cellPhone, string to)
        {
            Clients.Client(to).connectionIdUpdated(connectionId, cellPhone);
        }

        public void ConfirmUpdate(string confirmTo, string confirmatedConnectionId)
        {
            Clients.Client(confirmTo).didUpdated(confirmatedConnectionId);
        }
    }
}