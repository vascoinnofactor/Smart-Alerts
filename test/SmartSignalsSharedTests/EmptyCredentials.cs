//-----------------------------------------------------------------------
// <copyright file="EmptyCredentials.cs" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace SmartSignalsSharedTests
{
    using System.Net.Http;
    using System.Threading;
    using System.Threading.Tasks;
    using Microsoft.Rest;

    public class EmptyCredentials : ServiceClientCredentials
    {
        public override Task ProcessHttpRequestAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            // Do nothing
            return Task.CompletedTask;
        }
    }
}
