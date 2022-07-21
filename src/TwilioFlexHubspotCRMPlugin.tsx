import { FlexPlugin } from '@twilio/flex-plugin';
import * as Flex from '@twilio/flex-ui';


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

    flex.CRMContainer.defaultProps.uriCallback = (task) => {
      return (task && task.attributes.hubspot_contact_id)
        ? `https://app-eu1.hubspot.com/contacts/25832262/contact/${task.attributes.hubspot_contact_id}`
        : 'https://app-eu1.hubspot.com/contacts/25832262/objects/0-1/views/all/list';
    }

  }
}
