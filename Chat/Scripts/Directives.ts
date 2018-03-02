module Chat.Intranet.Directives {
    export class MyEnter {
        public link: (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => void;
        public template = '<div>{{name}}</div>';
        public scope = {};

        constructor() {
            MyEnter.prototype.link = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => {

            }https://stackoverflow.com/questions/17470790/how-to-use-a-keypress-event-in-angularjs
        }
    }
}