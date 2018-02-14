using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Microsoft.Azure.Monitoring.SmartSignals.State
{
    public class BlolState
    {
        public string SignalId { get; set; }

        public string Key { get; set; }

        public string SerializedState { get; set; }
    }
}
