sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageToast, MessageBox) {
        "use strict";

        return Controller.extend("reservierungssystem.controller.Login", {
            onInit: function () {
                var sEmail = localStorage.getItem("email"),
                    oRouter = this.getOwnerComponent().getRouter();

                if (sEmail) {
                    oRouter.navTo("homepage");
                }
            },
            goToRegister: function (oEvent) {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("register");
            },
            onLogIn: function () {
                var email = this.getView().byId("emailInput").getValue(),
                    emailInput = this.getView().byId("emailInput"),
                    sPassword = this.getView().byId("passwordInput").getValue(),
                    sPasswordInput = this.getView().byId("passwordInput");

                this._tmpLogin(email).then(function (oData) {
                    if (sPassword === oData.results[0].employee_password) {
                        localStorage.setItem('email', email);
                        localStorage.setItem('id', oData.results[0].employeeid);
                        emailInput.setValue("");
                        sPasswordInput.setValue("");
                        location.reload();
                    }
                    else {
                        MessageToast.show("Einlogdaten falsch!", {
                            duration: 3000
                        })
                    }
                }).catch(function (err) {
                    MessageBox.show("Einlogdaten falsch!", {
                        duration: 3000
                    })
                });

            },
            _tmpLogin: function (email) {
                //debugger;
                var oModel = this.getOwnerComponent().getModel("db"),
                    // @ts-ignore
                    aFilter = [new sap.ui.model.Filter("emailaddress", sap.ui.model.FilterOperator.EQ, email)];

                // @ts-ignore
                return new Promise(function (resolve, reject) {
                    oModel.read("/EMPLOYEES", {
                        filters: aFilter,
                        success: function (oData) {
                            resolve(oData);
                        },
                        error: function (err) {
                            //debugger;
                            reject(err);
                        }
                    });
                })
            }
        });
    });
