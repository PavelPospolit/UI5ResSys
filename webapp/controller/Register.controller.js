sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageToast) {
        "use strict";

        return Controller.extend("reservierungssystem.controller.Register", {
            onInit: function () {
            },
            goToLogin: function (oEvent) {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("login");
            },
            onRegister: function () {
                var rEmail = this.getView().byId("rEmail").getValue(),
                    rEmailInput = this.getView().byId("rEmail"),
                    rPassword = this.getView().byId("rPassword").getValue(),
                    rPasswordInput = this.getView().byId("rPassword"),
                    rReapeatPassword = this.getView().byId("rReapeatPassword").getValue(),
                    rReapeatPasswordInput = this.getView().byId("rReapeatPassword"),
                    oModel = this.getOwnerComponent().getModel("db"),
                    newGeneratedID;
                this._tmpgetID().then(function (newID) {
                    newGeneratedID = newID;
                })
                this._checkEmail(rEmail).then(function (oData) {
                    if (oData.results.length != 0) {
                        MessageToast.show("Emailaddresse bereits in Nutzung", {
                            duration: 3000
                        });
                        rEmailInput.setValue("");
                        rPasswordInput.setValue("");
                        rReapeatPasswordInput.setValue("");
                    } else {
                        if (rPassword === rReapeatPassword) {
                            /* ****************REGISTER FUNCTION************************* */
                            oModel.createEntry("/EMPLOYEES", {
                                properties: { employeeid: newGeneratedID, emailaddress: rEmail, employee_password: rPassword }
                            });
                            oModel.submitChanges();
                            rEmailInput.setValue("");
                            rPasswordInput.setValue("");
                            rReapeatPasswordInput.setValue("");
                            MessageToast.show("Mitarbeiter Erfolgreich hinzugefuegt!", {
                                duration: 3000
                            });
                            /* ********************************************************* */

                        } else {
                            MessageToast.show("Passwoerter stimmen nicht ueberein", {
                                duration: 3000
                            })
                        }
                    }
                });
            },
            _tmpgetID: function () {
                //debugger;
                var oModel = this.getOwnerComponent().getModel("db");

                // @ts-ignore
                return new Promise(function (resolve, reject) {
                    oModel.read("/EMPLOYEES", {
                        success: function (oData) {
                            var newID = oData.results[oData.results.length - 1].employeeid + 1;
                            resolve(newID);
                        },
                        error: function (err) {
                            //debugger;
                            reject(err);
                        }
                    });
                })
            },
            _checkEmail: function (email) {
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
                            reject(err);
                        }
                    });
                })
            }
        });
    });
