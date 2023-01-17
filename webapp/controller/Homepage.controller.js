sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageBox) {
        "use strict";

        return Controller.extend("reservierungssystem.controller.Homepage", {
            onInit: function () {
                var sEmail = localStorage.getItem("email"),
                    iId = localStorage.getItem("id"),
                    oRouter = this.getOwnerComponent().getRouter(),
                    oHomePage = this.getView().byId("homaPageTitle");


                oHomePage.setTitle(`${sEmail}'s Homepage`)

                if (!sEmail) {
                    oRouter.navTo("login");
                }

                var oModel = new sap.ui.model.json.JSONModel();
                oModel.setData({
                    id: iId
                });
            },
            onAfterRendering() {
                var iId = localStorage.getItem("id"),
                    oTable = this.getView().byId("myReservations");
                var oBinding = oTable.getBinding("items")
                oBinding.filter([
                    new sap.ui.model.Filter("employeeid", sap.ui.model.FilterOperator.EQ, iId)
                ]);
            },
            onLogOut: function () {
                localStorage.removeItem("email");
                localStorage.removeItem("id");
                location.reload();
            },
            onCancelReservation: function () {
                var tChosenRes = this.getView().byId("tChosenRes"),
                    chosenReservationID = tChosenRes.getText(),
                    oModel = this.getOwnerComponent().getModel("db");
                if (chosenReservationID) {
                    oModel.remove(`/RESERVATIONS(${chosenReservationID})`);
                    oModel.submitChanges();
                    tChosenRes.setText("");
                    MessageBox.show("Reservierung erfolgreich gelöscht!", {
                        duration: 3000
                    });
                }
                else if (!chosenReservationID) {
                    MessageBox.show("Keine Reservierung zum löschen ausgewählt!", {
                        duration: 3000
                    });
                }
            },
            onNavToReservation: function () {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("reservation");
                location.reload();
            },
            handleItemClick: function (oEvent) {
                var tChosenRes = this.getView().byId("tChosenRes"),
                    oItem = oEvent.getSource().getCells()[1].getText();
                tChosenRes.setText(oItem);
            }
        });
    });
