//-----------------------------------------------------------------------
// <copyright file="SignalConfigurationControl.xaml.cs" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.Azure.Monitoring.SmartSignals.Emulator.Controls
{
    using System.Windows;
    using System.Windows.Controls;
    using Microsoft.Azure.Monitoring.SmartSignals.Emulator.ViewModels;
    using Unity;    

    /// <summary>
    /// Interaction logic for SignalsControl.xaml
    /// </summary>
    public partial class SignalConfigurationControl : UserControl
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="SignalConfigurationControl"/> class.
        /// </summary>
        public SignalConfigurationControl()
        {
            this.InitializeComponent();
            this.DataContext = App.Container.Resolve<SignalsControlViewModel>();
        }
    }
}
