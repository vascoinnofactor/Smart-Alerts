// -----------------------------------------------------------------------
// <copyright file="index.tsx" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import * as React from 'react';

import Navbar from '../Navbar';

class App extends React.Component {

  render() {
    var { children } = this.props;

    return (
      <div>
        <Navbar>
          {children}
        </Navbar>
      </div>
    );
  }
}

export default App;