//-----------------------------------------------------------------------
// <copyright file="App.xaml.cs" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.Azure.Monitoring.SmartSignals.Emulator
{
    using System;
    using System.IO;
    using System.Windows;
    using Microsoft.Azure.Monitoring.SmartSignals.Clients;
    using Microsoft.Azure.Monitoring.SmartSignals.Emulator.Models;
    using Microsoft.Azure.Monitoring.SmartSignals.Package;
    using Microsoft.Azure.Monitoring.SmartSignals.SignalLoader;
    using Microsoft.Azure.Monitoring.SmartSignals.Tools;
    using Microsoft.Azure.Monitoring.SmartSignals.Trace;
    using Unity;

    /// <summary>
    /// Interaction logic for App.xaml
    /// </summary>
    public partial class App : Application
    {
        /// <summary>
        /// Gets the unity container.
        /// </summary>
        public static IUnityContainer Container { get; private set; }

        /// <summary>
        /// Raises the <see cref="E:System.Windows.Application.Startup" /> event.
        /// </summary>
        /// <param name="e">A <see cref="T:System.Windows.StartupEventArgs" /> that contains the event data.</param>
        protected override void OnStartup(StartupEventArgs e)
        {
            var tracer = new ConsoleTracer(string.Empty);
            var signalLoader = new SmartSignalLoader(tracer);
            if (e.Args.Length != 1)
            {
                throw new ArgumentException($"Invalid number of arguments - expected 1, actual {e.Args?.Length}");
            }

            string signalPackagePath = Diagnostics.EnsureStringNotNullOrWhiteSpace(() => e.Args[0]);
            SmartSignalPackage signalPackage;
            using (var fileStream = new FileStream(signalPackagePath, FileMode.Open))
            {
                signalPackage = SmartSignalPackage.CreateFromStream(fileStream, tracer);
            }

            SmartSignalManifest signalManifest = signalPackage.Manifest;
            ISmartSignal signal = signalLoader.LoadSignal(signalPackage);

            // Authenticate the user to AAD
            var authenticationServices = new AuthenticationServices();
            authenticationServices.AuthenticateUser();
            var credentialsFactory = new ActiveDirectoryCredentialsFactory(authenticationServices);

            var azureResourceManagerClient = new AzureResourceManagerClient(credentialsFactory, tracer);

            // Create analysis service factory
            var queryRunInroProvider = new QueryRunInfoProvider(azureResourceManagerClient);
            var httpClientWrapper = new HttpClientWrapper();
            var analysisServicesFactory = new AnalysisServicesFactory(tracer, httpClientWrapper, credentialsFactory, azureResourceManagerClient, queryRunInroProvider);

            // Create a Unity container with all the required models and view models registrations
            Container = new UnityContainer();
            Container
                .RegisterInstance(tracer)
                .RegisterInstance(new SignalsResultsRepository())
                .RegisterInstance(authenticationServices)
                .RegisterInstance(azureResourceManagerClient)
                .RegisterInstance(signal)
                .RegisterInstance(signalManifest)
                .RegisterInstance(analysisServicesFactory);
        }
    }
}
