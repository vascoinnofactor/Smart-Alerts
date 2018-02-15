//-----------------------------------------------------------------------
// <copyright file="SmartSignalConfiguredProject.cs" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------


namespace SmartSignals
{
    using System;
    using System.ComponentModel.Composition;
    using System.Diagnostics.CodeAnalysis;
    using System.Threading.Tasks;
    using System.Threading.Tasks.Dataflow;
    using Microsoft.VisualStudio.ProjectSystem;
    using Microsoft.VisualStudio.Shell;
    using Microsoft.VisualStudio.Shell.Interop;
    using Task = System.Threading.Tasks.Task;

    [Export]
    [AppliesTo(SmartSignalUnconfiguredProject.UniqueCapability)]
    internal class SmartSignalConfiguredProject
    {
        [Import, SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "MEF")]
        internal ConfiguredProject ConfiguredProject { get; private set; }

        [Import, SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "MEF")]
        internal ProjectProperties Properties { get; private set; }
    }
}
