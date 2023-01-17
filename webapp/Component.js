/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "reservierungssystem/model/models",
    "sap/ui/fl/FakeLrepConnectorLocalStorage"
],
    function (UIComponent, Device, models, FakeLrepConnectorLocalStorage) {
        "use strict";

        return UIComponent.extend("reservierungssystem.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                // enable routing
                this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");
                FakeLrepConnectorLocalStorage.enableFakeConnector(sap.ui.require.toUrl("sap/ui/demo/smartControls/lrep/component-test-changes.json"));
            }
        });
    }
);