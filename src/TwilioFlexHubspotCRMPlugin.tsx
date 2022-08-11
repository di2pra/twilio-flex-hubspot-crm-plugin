import { FlexPlugin } from '@twilio/flex-plugin';
import * as Flex from '@twilio/flex-ui';

// @ts-ignore
import CallingExtensions from "@hubspot/calling-extensions-sdk";

const PLUGIN_NAME = 'TwilioFlexHubspotCRMPlugin';

export default class TwilioFlexHubspotCRMPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof Flex }
   * @param manager { Flex.Manager }
   */
  async init(flex: typeof Flex, manager: Flex.Manager): Promise<void> {

    if (window.self !== window.top) {
      /*// Define a function for what to do when a message from postMessage() comes in
      const receiveMessage = (event: any) => {
        // Invoke the Flex Outbound Call Action
        flex.Actions.invokeAction("StartOutboundCall", { destination: event.data });
      }

      // Add an event listener to associate the postMessage() data with the receiveMessage logic
      window.addEventListener("message", receiveMessage, false);*/

      flex.AgentDesktopView.defaultProps.showPanel2 = false;

      const options = {
        // Whether to log various inbound/outbound messages to console
        debugMode: true,
        // eventHandlers handle inbound messages
        eventHandlers: {
          onReady: () => {
            /* HubSpot is ready to receive messages. */
            console.log("hubspot is ready");
          },
          onDialNumber: (event: any) => {
            const {
              phoneNumber,
              ownerId,
              portalId,
              objectId,
              objectType
            } = event;

            console.log("call number " + phoneNumber);

            flex.Actions.invokeAction("StartOutboundCall", { destination: phoneNumber });

          },
          onEngagementCreated: (event: any) => {
            /* HubSpot has created an engagement for this call. */
          },
          onVisibilityChanged: (event: any) => {
            /* Call widget's visibility is changed. */
          }
        }
      };

      const cti = new CallingExtensions(options);

      const afterHangupCallListener = (payload: any) => {
        console.log("call ended");
        cti.callEnded();
      };

      flex.Actions.addListener("afterHangupCall", afterHangupCallListener);

      const afterStartOutboundCallListener = (payload: any) => {
        console.log("call start");
        console.log(payload);
        cti.outgoingCall({
          createEngagement: true,
          phoneNumber: ""
        });
      };

      flex.Actions.addListener("afterStartOutboundCall", afterStartOutboundCallListener)

    }

    flex.CRMContainer.defaultProps.uriCallback = (task) => {
      return (task && task.attributes.hubspot_contact_id)
        ? `https://app-eu1.hubspot.com/contacts/25832262/contact/${task.attributes.hubspot_contact_id}`
        : 'https://app-eu1.hubspot.com/contacts/25832262/objects/0-1/views/all/list';
    }

  }
}
