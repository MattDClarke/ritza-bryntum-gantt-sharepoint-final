import { BryntumGantt } from '@bryntum/gantt-react';
import React from 'react';
import { IGanttProps } from './IGanttProps';

import { ganttConfig } from './GanttConfig';

// import css theme
import '@bryntum/gantt/gantt.stockholm.css';

/**
 * Gantt React component.
 *
 * This component renders the Bryntum Gantt widget.
 */
export default class Gantt extends React.Component<IGanttProps> {

    constructor(props: Readonly<IGanttProps>) {
        super(props);
        // Add a reference to the gantt engine in the service
        props.service.ganttRef = React.createRef();
    }

    public render(): React.ReactNode {
        return <BryntumGantt
            ref={this.props.service.ganttRef}

            project={this.props.service.getTaskListModel()}

            {...ganttConfig}
        />;
    }

    public shouldComponentUpdate(nextProps: Readonly<IGanttProps>, nextState: Readonly<IGanttProps>): boolean {
        // This component should never update
        return false;
    }
}
