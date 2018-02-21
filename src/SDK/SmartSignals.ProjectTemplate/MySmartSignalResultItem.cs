namespace $safeprojectname$
{
    using Microsoft.Azure.Monitoring.SmartAlerts;

    /// <summary>
    /// The base class for representing a specific item in the Smart Signal result.
    /// Each result item instance contains both the detected issue's data and representation properties.
    /// </summary>
    public class MySmartSignalResultItem : SmartSignalResultItem
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="SmartSignalResultItem"/> class.
        /// </summary>
        /// <param name="title">The result item's title.</param>
        /// <param name="resourceIdentifier">The resource identifier that this items applies to.</param>
        public MySmartSignalResultItem(string title, ResourceIdentifier resourceIdentifier) : base(title, resourceIdentifier)
        {
        }
    }
}