sap.ui.define(
    [
        "sap/ui/core/mvc/Controller"
    ],
    function (BaseController) {
        "use strict";

        return BaseController.extend("reservierungssystem.controller.App", {
            onInit() {
                var sEmail = localStorage.getItem("email");
                var oRouter = this.getOwnerComponent().getRouter();

                if (!sEmail) {
                    oRouter.navTo("login");
                }
            }
        });
    }
);
