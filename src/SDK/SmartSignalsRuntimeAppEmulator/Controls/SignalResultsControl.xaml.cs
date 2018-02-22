//-----------------------------------------------------------------------
// <copyright file="SignalResultsControl.xaml.cs" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.Azure.Monitoring.SmartSignals.Emulator.Controls
{
    using System.Windows.Controls;
    using Microsoft.Azure.Monitoring.SmartSignals.Emulator.ViewModels;
    using Unity;

    /// <summary>
    /// Interaction logic for SignalResultsControl.xaml
    /// </summary>
    public partial class SignalResultsControl : UserControl
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="SignalResultsControl"/> class.
        /// </summary>
        public SignalResultsControl()
        {
            this.InitializeComponent();
            this.DataContext = App.Container.Resolve<SignalsResultsControlViewModel>();
        }
    }
}
