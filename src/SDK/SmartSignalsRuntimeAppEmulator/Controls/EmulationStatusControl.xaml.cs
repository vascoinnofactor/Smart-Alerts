﻿//-----------------------------------------------------------------------
// <copyright file="EmulationStatusControl.xaml.cs" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.Azure.Monitoring.SmartSignals.Emulator.Controls
{
    using System.Windows.Controls;
    using Microsoft.Azure.Monitoring.SmartSignals.Emulator.ViewModels;
    using Unity;

    /// <summary>
    /// Interaction logic for EmulationStatusControl.xaml
    /// </summary>
    public partial class EmulationStatusControl : UserControl
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="EmulationStatusControl"/> class.
        /// </summary>
        public EmulationStatusControl()
        {
            this.InitializeComponent();
            this.DataContext = App.Container.Resolve<EmulationStatusControlViewModel>();
        }
    }
}
