using System;
using System.Collections.Generic;
using System.ComponentModel.Composition;
using System.Threading.Tasks;
using Microsoft.VisualStudio.ProjectSystem;
using Microsoft.VisualStudio.ProjectSystem.Debug;
using Microsoft.VisualStudio.ProjectSystem.Properties;
using Microsoft.VisualStudio.ProjectSystem.VS.Debug;

namespace SmartSignals
{
    [ExportDebugger(SmartSignalsDebugger.SchemaName)]
    [AppliesTo(MyUnconfiguredProject.UniqueCapability)]
    public class SmartSignalsDebuggerLaunchProvider : DebugLaunchProviderBase
    {
        [ImportingConstructor]
        public SmartSignalsDebuggerLaunchProvider(ConfiguredProject configuredProject)
            : base(configuredProject)
        {
        }

        [ExportPropertyXamlRuleDefinition("SmartSignals, Version=1.0.0.0, Culture=neutral, PublicKeyToken=9be6e469bc4921f1", "XamlRuleToCode:SmartSignalsDebugger.xaml", "Project")]
        [AppliesTo(MyUnconfiguredProject.UniqueCapability)]
        private object DebuggerXaml { get { throw new NotImplementedException(); } }

        /// <summary>
        /// Gets project properties that the debugger needs to launch.
        /// </summary>
        [Import]
        private ProjectProperties DebuggerProperties { get; set; }

        public override async Task<bool> CanLaunchAsync(DebugLaunchOptions launchOptions)
        {
            var properties = await this.DebuggerProperties.GetSmartSignalsDebuggerPropertiesAsync();
            string commandValue = await properties.SmartSignalsDebuggerCommand.GetEvaluatedValueAtEndAsync();
            return !string.IsNullOrEmpty(commandValue);
        }

        public override async Task<IReadOnlyList<IDebugLaunchSettings>> QueryDebugTargetsAsync(DebugLaunchOptions launchOptions)
        {
            var settings = new DebugLaunchSettings(launchOptions);

            // The properties that are available via DebuggerProperties are determined by the property XAML files in your project.
            var debuggerProperties = await this.DebuggerProperties.GetSmartSignalsDebuggerPropertiesAsync();     
            settings.Executable = await debuggerProperties.SmartSignalsDebuggerCommand.GetEvaluatedValueAtEndAsync();
            settings.Arguments = await debuggerProperties.SmartSignalsDebuggerCommandArguments.GetEvaluatedValueAtEndAsync();
            settings.LaunchOperation = DebugLaunchOperation.CreateProcess;

            settings.LaunchDebugEngineGuid = DebuggerEngines.ManagedOnlyEngine;

            return new IDebugLaunchSettings[] { settings };
        }
    }
}
