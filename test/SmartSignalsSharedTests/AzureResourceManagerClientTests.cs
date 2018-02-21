//-----------------------------------------------------------------------
// <copyright file="AzureResourceManagerClientTests.cs" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace SmartSignalsSharedTests
{
    using Microsoft.Azure.Monitoring.SmartAlerts;
    using Microsoft.Azure.Monitoring.SmartAlerts.Clients;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using Moq;

    [TestClass]
    public class AzureResourceManagerClientTests
    {
        [TestMethod]
        public void WhenConvertingVmResourceTheConversionIsSuccessful()
        {
            string testResourceId = "/subscriptions/7904b7bd-5e6b-4415-99a8-355657b7da19/resourceGroups/MyResourceGroupName/providers/Microsoft.Compute/virtualMachines/MyVirtualMachineName";
            ResourceIdentifier testResourceIdentifier = new ResourceIdentifier(ResourceType.VirtualMachine, "7904b7bd-5e6b-4415-99a8-355657b7da19", "MyResourceGroupName", "MyVirtualMachineName");
            this.VerifyConversion(testResourceId, testResourceIdentifier);
        }

        private void VerifyConversion(string testResourceId, ResourceIdentifier testResourceIdentifier)
        {
            var resourceIdentifier = ResourceIdentifier.CreateWithResourceId(testResourceId);
            var resourceId = resourceIdentifier.GetResourceId();
            Assert.AreEqual(testResourceId, resourceId, "Resource IDs are different");
            Assert.AreEqual(testResourceIdentifier, resourceIdentifier, "Resource identifiers are are different");

            resourceId = testResourceIdentifier.GetResourceId();
            resourceIdentifier = ResourceIdentifier.CreateWithResourceId(resourceId);
            Assert.AreEqual(testResourceId, resourceId, "Resource IDs are different");
            Assert.AreEqual(testResourceIdentifier, resourceIdentifier, "Resource identifiers are are different");
        }
    }
}