import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Device from './Device';

function Devices() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path='/dashboard/devices/:id' component={Device} />
      </Switch>
    </BrowserRouter>
  );
}

export default Devices;
