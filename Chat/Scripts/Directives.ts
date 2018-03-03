module Chat.Intranet.Directives {
    export function EnterAction(): ng.IDirective {
        return {
            template: '',
            scope: {},
            link: function (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes){
                element.bind("keydown keypress", function (event) {
                    if (event.which === 13) {
                        scope.$apply(function () {
                            scope.$parent.$eval(attrs.enterAction);
                        });
                    }
                })
            }
        }
    }
}