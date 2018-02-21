﻿//-----------------------------------------------------------------------
// <copyright file="MainWindowViewModel.cs" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.Azure.Monitoring.SmartSignals.Emulator.ViewModels
{
    using Microsoft.Azure.Monitoring.SmartSignals.Emulator.Models;
    using Unity.Attributes;
    using Unity.Injection;

    /// <summary>
    /// The view model class for the <see cref="MainWindow"/> control.
    /// </summary>
    public class MainWindowViewModel : ObservableObject
    {
        private int numberOfResultsFound;
        private SmartSignalRunner signalRunner;
        private string userName;

        /// <summary>
        /// Initializes a new instance of the <see cref="MainWindowViewModel"/> class for design time only.
        /// </summary>
        public MainWindowViewModel()
        {
            this.UserName = "Lionel";
            this.NumberOfResultsFound = 20;
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="MainWindowViewModel"/> class.
        /// </summary>
        /// <param name="signalsResultsRepository">The signal results repository model.</param>
        /// <param name="authenticationServices">The authentication services to use.</param>
        /// <param name="signalRunner">The smart signal runner.</param>
        [InjectionConstructor]
        public MainWindowViewModel(SignalsResultsRepository signalsResultsRepository, AuthenticationServices authenticationServices, SmartSignalRunner signalRunner)
        {
            this.NumberOfResultsFound = 0;
            signalsResultsRepository.Results.CollectionChanged +=
                (sender, args) => { this.NumberOfResultsFound = args.NewItems.Count; };

            this.UserName = authenticationServices.AuthenticationResult.UserInfo.GivenName;
            this.SignalRunner = signalRunner;
        }

        /// <summary>
        /// Gets the number of results found in this run.
        /// </summary>
        public int NumberOfResultsFound
        {
            get => this.numberOfResultsFound;

            private set
            {
                this.numberOfResultsFound = value;
                this.OnPropertyChanged();
            }
        }

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
        /// Gets the name of the signed in user.
        /// </summary>
        public string UserName
        {
            get => this.userName;

            private set
            {
                this.userName = value;
                this.OnPropertyChanged();
            }
        }
    }
}
