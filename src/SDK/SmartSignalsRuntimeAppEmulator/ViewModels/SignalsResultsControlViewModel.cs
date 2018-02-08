//-----------------------------------------------------------------------
// <copyright file="SignalsResultsControlViewModel.cs" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.Azure.Monitoring.SmartSignals.Emulator.ViewModels
{
    using System.Collections.Generic;
    using System.Collections.ObjectModel;
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

        private ObservableCollection<User> users;

        #region Ctros

        /// <summary>
        /// Initializes a new instance of the <see cref="SignalsResultsControlViewModel"/> class for design time only.
        /// </summary>
        public SignalsResultsControlViewModel()
        {
            List<User> items = new List<User>();
            items.Add(new User() { Name = "John Doe", Age = 42, Mail = "john@doe-family.com" });
            items.Add(new User() { Name = "Jane Doe", Age = 39, Mail = "jane@doe-family.com" });
            items.Add(new User() { Name = "Sammy Doe", Age = 7, Mail = "sammy.doe@gmail.com" });

            this.Users = new ObservableCollection<User>(items);
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="SignalsResultsControlViewModel"/> class.
        /// </summary>
        /// <param name="signalRunner">The smart signal runner.</param>
        [InjectionConstructor]
        public SignalsResultsControlViewModel(SmartSignalRunner signalRunner)
        {
            this.SignalRunner = signalRunner;

            List<User> items = new List<User>();
            items.Add(new User() { Name = "John Doe", Age = 42, Mail = "john@doe-family.com" });
            items.Add(new User() { Name = "Jane Doe", Age = 39, Mail = "jane@doe-family.com" });
            items.Add(new User() { Name = "Sammy Doe", Age = 7, Mail = "sammy.doe@gmail.com" });

            this.Users = new ObservableCollection<User>(items);
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

        /// <summary>
        /// Gets the signal runner.
        /// </summary>
        public ObservableCollection<User> Users
        {
            get
            {
                return this.users;
            }

            private set
            {
                this.users = value;
                this.OnPropertyChanged();
            }
        }

        #endregion
    }
}
