// -----------------------------------------------------------------------
// <copyright file="index.tsx" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import * as React from 'react';
import { Card as MDCard, CardTitle, CardText } from 'react-md/lib/Cards';
import { Tooltipped } from 'react-md/lib/Tooltips';

import VisualizationFactory from '../../factories/VisualizationsFactory';
import ChartType from '../../models/ChartType';

import './indexStyle.css';

interface CardProps {
    title: string;
    presentedValue: string;
    bottomText: string;
    resourceName: string;
    data?: { time: string, number: number }[];
    chartType?: ChartType;
    hideXAxis?: boolean;
    hideYAxis?: boolean;
    hideLegend?: boolean;
}

/**
 * This component represents a card which presents a title, sub-titles and a chart.
 */
export default class Card extends React.Component<CardProps> {
    constructor(props: CardProps) {
        super(props);
    }

    public render() {
        const { title, presentedValue, bottomText, resourceName } = this.props;

        return (
            <div className="cardContainer">
                <MDCard>
                    <div className="cardHeader">
                        <Tooltipped label={title} position="top">
                            <CardTitle 
                                title=""
                                subtitle={title}
                                children={this.getHeaderInsightTimestampElement()}
                            />
                        </Tooltipped>
                    </div>
                    <CardText>
                        <div className="cardContent">
                            <div>
                                <div className="presentedValue">
                                    {presentedValue}
                                </div>
                                <div className="bottomText">
                                    {bottomText}
                                </div>
                                <div className="resourceName">
                                    {resourceName}
                                </div>
                            </div>
                            <div className="chart-container">
                                {
                                    this.props.data && this.props.chartType &&
                                    VisualizationFactory.create(this.props.chartType, this.props.data,
                                                                undefined, this.props.hideXAxis, this.props.hideYAxis,
                                                                this.props.hideLegend)
                                }
                            </div>
                        </div>
                    </CardText>
                </MDCard>
            </div>
        );
    }

    private getHeaderInsightTimestampElement(): JSX.Element {
        // TODO - convert the given timestamp to the required format
        return (
            <div className="insightTimestamp">
                4/14/2017 9:49 PM
            </div>
        );
    }
}