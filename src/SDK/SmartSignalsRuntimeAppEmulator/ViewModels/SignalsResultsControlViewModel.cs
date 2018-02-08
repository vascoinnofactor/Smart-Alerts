//-----------------------------------------------------------------------
// <copyright file="SignalsResultsControlViewModel.cs" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.Azure.Monitoring.SmartSignals.Emulator.ViewModels
{
    using Microsoft.Azure.Monitoring.SmartSignals.Emulator.Controls;
    using Microsoft.Azure.Monitoring.SmartSignals.Emulator.Models;
    using Unity.Attributes;

    /// <summary>
    /// The view model class for the <see cref="SignalResultsControl"/> control.
    /// </summary>
    public class SignalsResultsControlViewModel : ObservableObject
    {
        private SmartSignalRunner signalRunner;

        private SmartSignalResult selectedResult;

        #region Ctros

        /// <summary>
        /// Initializes a new instance of the <see cref="SignalsResultsControlViewModel"/> class for design time only.
        /// </summary>
        public SignalsResultsControlViewModel()
        {
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="SignalsResultsControlViewModel"/> class.
        /// </summary>
        /// <param name="signalRunner">The smart signal runner.</param>
        [InjectionConstructor]
        public SignalsResultsControlViewModel(SmartSignalRunner signalRunner)
        {
            this.SignalRunner = signalRunner;
        }

        #endregion

        #region Binded Properties

        /// <summary>
        /// Gets the signal runner.
        /// </summary>
        public SmartSignalRunner SignalRunner
        {
            get
            {
                return this.signalRunner;
            }

            private set
            {
                this.signalRunner = value;
                this.OnPropertyChanged();
            }
        }

        /// <summary>
        /// Gets or sets the selected result.
        /// </summary>
        public SmartSignalResult SelectedResult
        {
            get
            {
                return this.selectedResult;
            }

            set
            {
                this.selectedResult = value;
                this.OnPropertyChanged();
            }
        }

        #endregion
    }
}
