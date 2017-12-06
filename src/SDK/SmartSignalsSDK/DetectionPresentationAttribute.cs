﻿namespace Microsoft.Azure.Monitoring.SmartSignals
{
    using System;

    /// <summary>
    /// An attribute defining the presentation of a specific property in a Smart Signal detection.
    /// The attribute determines which section the property will be presented in, the display title for the
    /// property and an optional info balloon.
    /// </summary>
    [AttributeUsage(AttributeTargets.Property, AllowMultiple = false, Inherited = true)]
    public class DetectionPresentationAttribute : Attribute
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="DetectionPresentationAttribute"/> class.
        /// </summary>
        /// <param name="section">The section in which the property will be presented.</param>
        /// <param name="title">The title to use when presenting the property's value.</param>
        /// <exception cref="ArgumentNullException"><paramref name="title"/> is null or contains only white-spaces.</exception>
        public DetectionPresentationAttribute(DetectionPresentationSection section, string title)
        {
            if (string.IsNullOrWhiteSpace(title))
            {
                throw new ArgumentNullException(nameof(title), "A property cannot be presented without a title");
            }

            this.Section = section;
            this.Title = title;
        }

        /// <summary>
        /// Gets the section in which the property will be presented.
        /// </summary>
        public DetectionPresentationSection Section { get; }

        /// <summary>
        /// Gets the title to use when presenting the property's value.
        /// </summary>
        public string Title { get; }

        /// <summary>
        /// Gets or sets  an (optional) info balloon to show when hovering over the property's presentation.
        /// </summary>
        public string InfoBalloon { get; set; }
    }
}
