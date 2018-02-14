using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Microsoft.Azure.Monitoring.SmartSignals
{
    public interface IStateRepository
    {
        Task<T> GetStateAsync<T>(string key, CancellationToken cancellationToken);

        Task AddOrUpdateStateAsync<T>(string key, T state, CancellationToken cancellationToken);
    }
}
