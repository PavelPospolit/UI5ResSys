sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("reservierungssystem.controller.View1", {
            onInit: function () {
                var sEmail = localStorage.getItem("email");
                var oRouter = this.getOwnerComponent().getRouter();

                if (!sEmail) {
                    oRouter.navTo("login");
                }
                else if (sEmail) {
                    oRouter.navTo("homepage");
                }
            }
        });
    });
