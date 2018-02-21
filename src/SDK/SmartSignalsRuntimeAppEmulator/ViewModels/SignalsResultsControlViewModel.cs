//-----------------------------------------------------------------------
// <copyright file="SignalsResultsControlViewModel.cs" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.Azure.Monitoring.SmartAlerts.Emulator.ViewModels
{
    using Microsoft.Azure.Monitoring.SmartAlerts.Emulator.Controls;
    using Microsoft.Azure.Monitoring.SmartAlerts.Emulator.Models;
    using Unity.Attributes;

    /// <summary>
    /// Occurs when the user closed the result details control.
    /// </summary>
    public delegate void ResultDetailsControlClosedEventHandler();

    /// <summary>
    /// The view model class for the <see cref="SignalResultsControl"/> control.
    /// </summary>
    public class SignalsResultsControlViewModel : ObservableObject
    {
        private SmartSignalRunner signalRunner;

        private SignalResultItem selectedResult;

        private SignalResultDetailsControlViewModel signalResultDetailsControlViewModel;

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
            this.SignalResultDetailsControlViewModel = null;

            this.ResultDetailsControlClosed += () =>
            {
                this.SelectedResult = null;
            };
        }

        #endregion

        /// <summary>
        /// Handler for closing the result details control event.
        /// </summary>
        public event ResultDetailsControlClosedEventHandler ResultDetailsControlClosed;

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
        public SignalResultItem SelectedResult
        {
            get
            {
                return this.selectedResult;
            }

            set
            {
                this.selectedResult = value;
                this.OnPropertyChanged();

                if (this.selectedResult != null)
                {
                    this.SignalResultDetailsControlViewModel = new SignalResultDetailsControlViewModel(this.selectedResult, this.ResultDetailsControlClosed);
                }
                else
                {
                    this.SignalResultDetailsControlViewModel = null;
                }
            }
        }

        /// <summary>
        /// Gets or sets the selected result details control view model.
        /// </summary>
        public SignalResultDetailsControlViewModel SignalResultDetailsControlViewModel
        {
            get
            {
                return this.signalResultDetailsControlViewModel;
            }

            set
            {
                this.signalResultDetailsControlViewModel = value;
                this.OnPropertyChanged();
            }
        }

        #endregion

        #region Commands

        /// <summary>
        /// Gets the command that runs the signal.
        /// </summary>
        public CommandHandler CloseControlCommand { get; }

        #endregion
    }
}
