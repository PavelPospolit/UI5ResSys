sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/Label",
    "sap/m/ColumnListItem",
    "sap/m/MessageToast"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Label, ColumnListItem, MessageToast) {
        "use strict";

        return Controller.extend("reservierungssystem.controller.Reservation", {
            onInit: function () {
                var sEmail = localStorage.getItem("email"),
                    oRouter = this.getOwnerComponent().getRouter(),
                    dpStart = this.getView().byId("dpStart"),
                    dpEnd = this.getView().byId("dpEnd"),
                    // @ts-ignore
                    oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
                        format: "yyyyMMdd",
                        pattern: "yyyy-MM-dd"
                    });
                if (!sEmail) {
                    oRouter.navTo("login");
                }
                dpStart.setValue(oDateFormat.format(new Date()));
                dpEnd.setValue(oDateFormat.format(new Date()));
                dpEnd.setMinDate(new Date(dpStart.getValue()));
                this._loadStuff();

            },
            onNavToHomepage: function () {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("homepage");
                location.reload();
            },
            onLogOut: function () {
                localStorage.removeItem("email");
                localStorage.removeItem("id");
                location.reload();
            },
            _loadRooms: function () {
                //debugger;
                var oModel = this.getOwnerComponent().getModel("db");
                // @ts-ignore
                return new Promise(function (resolve, reject) {
                    oModel.read("/ROOMS", {
                        success: function (oData) {
                            resolve(oData);
                        },
                        error: function (err) {
                            //debugger;
                            reject(err);
                        }
                    });
                })
            },
            dpStartHandleChange: function (evt) {
                var dpStart = this.getView().byId("dpStart"),
                    dpEnd = this.getView().byId("dpEnd");
                dpEnd.setMinDate(new Date(dpStart.getValue()));
                this._loadStuff()
            },
            tpEndHandleChange: function (evt) {
                var dpStart = this.getView().byId("dpStart"),
                    tpStart = this.getView().byId("tpStart"),
                    dpEnd = this.getView().byId("dpEnd"),
                    tpEnd = this.getView().byId("tpEnd");
                if (((tpEnd.getValue() < tpStart.getValue()) && (dpStart.getValue() === dpEnd.getValue())) ||
                    ((tpEnd.getValue() === tpStart.getValue()) && (dpStart.getValue() === dpEnd.getValue()))) {
                    MessageToast.show("Endzeit muss nach der Startzeit liegen", {
                        duration: 3000
                    });
                    (tpEnd.setValue(""));
                }
                this._loadStuff()
            },
            dpEndHandleChange: function () {
                this._loadStuff();
            },
            tpStartHandleChange: function () {
                this._loadStuff();
            },
            onReservation: function (evt) {
                //hier koennte ihr Code stehen!///////////
                var dateStart = this.getView().byId("dpStart").getValue(),
                    timeStart = this.getView().byId("tpStart").getValue(),
                    dateEnd = this.getView().byId("dpEnd").getValue(),
                    timeEnd = this.getView().byId("tpEnd").getValue(),
                    oRoom = this.getView().byId("tChosenRoom").getText(),
                    oModel = this.getOwnerComponent().getModel("db"),
                    iEmployeeID = localStorage.getItem("id"),
                    newGeneratedID;

                if (oRoom) {
                    this._getReservationID().then(function (newID) {
                        newGeneratedID = newID;
                        if (!timeStart || !dateEnd || !timeEnd) {
                            MessageToast.show("Bitte Datum und Uhrzeit wählen!", {
                                duration: 3000
                            });
                        } else {
                            oModel.createEntry("/RESERVATIONS", {
                                properties: {
                                    reservationid: newGeneratedID, employeeid: iEmployeeID, roomnumber: oRoom, starting_date: dateStart, starting_time: timeStart, ending_date: dateEnd, ending_time_: timeEnd
                                }
                            });
                            oModel.submitChanges();
                            MessageToast.show("Reservierung erfolgreich abgeschlossen!", {
                                duration: 3000
                            });
                        }
                    }).then(function () {
                        location.reload()
                    })
                }
                else {
                    MessageToast.show("Kein Raum ausgewählt!", {
                        duration: 3000
                    })
                }

                this.getView().byId("tChosenRoom").setText("");
            },
            _getReservationID: function () {
                var oModel = this.getOwnerComponent().getModel("db");
                // @ts-ignore
                return new Promise(function (resolve, reject) {
                    oModel.read("/RESERVATIONS", {
                        success: function (oData) {
                            if (oData.results.length != 0) {
                                var newID = oData.results[oData.results.length - 1].reservationid + 1;
                            }
                            else {
                                newID = 1;
                            }
                            resolve(newID);
                        },
                        error: function (err) {
                            reject(err);
                        }
                    });
                })
            },
            _getReservations: function () {
                var oModel = this.getOwnerComponent().getModel("db");
                // @ts-ignore
                return new Promise(function (resolve, reject) {
                    oModel.read("/RESERVATIONS", {
                        //filters: aFilter,
                        success: function (oData) {
                            resolve(oData);
                        },
                        error: function (err) {
                            reject(err);
                        }
                    });
                })
            },
            onRoomSelected: function (oEvent) {
                var tChosenRes = this.getView().byId("tChosenRoom"),
                    oItem = oEvent.getSource().getCells()[0].getText();
                console.log(oItem);
                tChosenRes.setText(oItem);
            },
            _loadStuff: function () {
                var sEmail = localStorage.getItem("email"),
                    oRouter = this.getOwnerComponent().getRouter(),
                    oTable = this.getView().byId("allRooms"),
                    pickerStartDate = this.getView().byId("dpStart").getValue(),
                    pickerStartTime = this.getView().byId("tpStart").getValue(),
                    pickerEndDate = this.getView().byId("dpEnd").getValue(),
                    pickerEndTime = this.getView().byId("tpEnd").getValue(),
                    // @ts-ignore
                    oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
                        format: "yyyyMMdd",
                        pattern: "yyyy-MM-dd"
                    }),
                    // @ts-ignore
                    oTimeFormat = sap.ui.core.format.DateFormat.getTimeInstance({
                        format: "Hms",
                        style: "short",
                        UTC: "true",
                        pattern: "HH:mm"
                    }),
                    oBinding = oTable.getBinding("items");

                if (!sEmail) {
                    oRouter.navTo("login");
                }
                var arrayReservations = [];
                this._getReservations().then(function (oData) {
                    for (var i = 0; i < oData.results.length; i++) {
                        arrayReservations.push(oData.results[i])
                    }

                })

                this._loadRooms().then(function (oData) {
                    var aFilter = [];
                    oBinding.filter();

                    for (var i = 0; i < oData.results.length; i++) {
                        for (var j = 0; j < arrayReservations.length; j++) {
                            var resStartTime = oTimeFormat.format(new Date(new Date(arrayReservations[j].starting_time.ms).toUTCString())),
                                resEndTime = oTimeFormat.format(new Date(new Date(arrayReservations[j].ending_time_.ms).toUTCString())),
                                resStartDate = oDateFormat.format(new Date(arrayReservations[j].starting_date)),
                                resEndDate = oDateFormat.format(new Date(arrayReservations[j].ending_date));
                            if ((pickerStartDate && pickerStartTime && pickerEndDate && pickerEndTime && (oData.results[i].roomnumber === arrayReservations[j].roomnumber)) &&
                                ((pickerStartDate > resStartDate && pickerStartDate < resEndDate) ||
                                    ((pickerStartDate === resStartDate) && (pickerStartTime <= resStartTime)) ||
                                    ((pickerStartDate === resEndDate) && ((pickerStartTime <= resEndTime))) ||
                                    ((pickerEndDate === resEndDate) && (pickerEndTime <= resEndTime)) ||
                                    (pickerEndDate > resStartDate && pickerEndDate < resEndDate) ||
                                    (pickerStartDate < resStartDate && pickerEndDate > resEndDate) ||
                                    (pickerStartDate < resStartDate && pickerEndDate > resEndDate))) {
                                var iRoomnumber = oData.results[i].roomnumber;
                                aFilter.push(new sap.ui.model.Filter("roomnumber", sap.ui.model.FilterOperator.NE, iRoomnumber));
                                break;
                            }
                        }
                    }
                    if (aFilter.length != 0) {
                        oBinding.filter(new sap.ui.model.Filter(aFilter, true));
                    }
                }).catch(function (err) {
                    console.log(`Beim Filtern der Tabelle ist folgender Fehler aufgetreten: ${err}`);
                });
            }
        });
    });
