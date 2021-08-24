import React from 'react';
import { Loader, Dimmer } from 'semantic-ui-react';

const Spinner = () => (
  <Dimmer active>
    <Loader size="huge" content={"Starting chat in a moment ..."} />
  </Dimmer>
);

export default Spinner;