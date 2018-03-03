module Chat.Intranet {
    angular.module('ChatApp', ['ui.mask', 'ui.utils.masks', 'ui.utils.masks.br', 'ngStorage', "ui.bootstrap"])
        .value("$", $)
        .controller('MessageController', Chat.Intranet.Controllers.MessageController)
        .service('HubService', Chat.Intranet.Services.HubService)
        .directive('enterAction', Chat.Intranet.Directives.EnterAction)
}
