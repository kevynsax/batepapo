using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(Chat.SignalR.Owin))]

namespace Chat.SignalR
{
    public class Owin
    {
        public void Configuration(IAppBuilder app)
        {
            app.MapSignalR();
        }
    }
}
