//-----------------------------------------------------------------------
// <copyright file="SignalResultDetailsControlViewModel.cs" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.Azure.Monitoring.SmartSignals.Emulator.ViewModels
{
    using System;
    using System.Collections.Generic;
    using System.Collections.ObjectModel;
    using System.Linq;
    using Microsoft.Azure.Monitoring.SmartSignals.Emulator.Models;
    using Microsoft.Azure.Monitoring.SmartSignals.SignalResultPresentation;
    using Unity.Attributes;

    /// <summary>
    /// The view model class for the <see cref="SignalResultDetailsControlViewModel"/> control.
    /// </summary>
    public class SignalResultDetailsControlViewModel : ObservableObject
    {
        private SignalResultItem signalResult;

        private ObservableCollection<SmartSignalResultItemPresentationProperty> propertiesSectionProperties;

        private ObservableCollection<SmartSignalResultItemPresentationProperty> analysisSectionProperties;

        #region Ctros

        /// <summary>
        /// Initializes a new instance of the <see cref="SignalResultDetailsControlViewModel"/> class for design time only.
        /// </summary>
        public SignalResultDetailsControlViewModel()
        {
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="SignalResultDetailsControlViewModel" /> class.
        /// </summary>
        /// <param name="signalResult">The smart signal runner.</param>
        /// <param name="resultDetailsControlClosed">The smart signal runner gunner.</param>
        public SignalResultDetailsControlViewModel(SignalResultItem signalResult, ResultDetailsControlClosedEventHandler resultDetailsControlClosed)
        {
            this.SignalResult = signalResult;

            this.PropertiesSectionProperties = new ObservableCollection<SmartSignalResultItemPresentationProperty>(
                this.SignalResult.ResultItemPresentation.Properties
                    .Where(prop => prop.DisplayCategory == ResultItemPresentationSection.Property).ToList());

            this.AnalysisSectionProperties = new ObservableCollection<SmartSignalResultItemPresentationProperty>(
                this.SignalResult.ResultItemPresentation.Properties
                    .Where(prop => prop.DisplayCategory == ResultItemPresentationSection.Analysis
                                   && prop.Value != string.Empty).ToList());

            this.CloseControlCommand = new CommandHandler(() =>
            {
                resultDetailsControlClosed.Invoke();
            });
        }

        #endregion

        #region Binded Properties

        /// <summary>
        /// Gets the signal result.
        /// </summary>
        public SignalResultItem SignalResult
        {
            get
            {
                return this.signalResult;
            }

            private set
            {
                this.signalResult = value;
                this.OnPropertyChanged();
            }
        }

        /// <summary>
        /// Gets the signal result.
        /// </summary>
        public ObservableCollection<SmartSignalResultItemPresentationProperty> PropertiesSectionProperties
        {
            get
            {
                return this.propertiesSectionProperties;
            }

            private set
            {
                this.propertiesSectionProperties = value;
                this.OnPropertyChanged();
            }
        }

        /// <summary>
        /// Gets the signal result.
        /// </summary>
        public ObservableCollection<SmartSignalResultItemPresentationProperty> AnalysisSectionProperties
        {
            get
            {
                return this.analysisSectionProperties;
            }

            private set
            {
                this.analysisSectionProperties = value;
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
