using Microsoft.Azure.Monitoring.SmartSignals.RuntimeShared.AzureStorage;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Microsoft.Azure.Monitoring.SmartSignals
{
    public class BlobStateRepository : IStateRepository
    {
        private ICloudBlobContainerWrapper cloudBlobContainerWrapper;

        public BlobStateRepository(ICloudStorageProviderFactory cloudStorageProviderFactory)
        {
            cloudBlobContainerWrapper = cloudStorageProviderFactory.GetSmartSignalStateStorageContainer();
        }

        public Task AddOrUpdateStateAsync<T>(string key, T state, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }

        public Task<T> GetStateAsync<T>(string key, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }
    }
}
