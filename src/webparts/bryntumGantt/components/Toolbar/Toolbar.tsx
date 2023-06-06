/**
 * Demo header implementation
 */
import * as React from 'react';
import styles from './Toolbar.module.scss';
import Service from '../../data/service/Service';
import { BryntumPanel } from '@bryntum/gantt-react';
import { Toast } from '@bryntum/gantt';

export interface IToolbarProps {
    service: Service
}

/**
 * Header of the webpart.
 * @param props
 * @constructor
 */
const Toolbar: React.FC<IToolbarProps> = (props) => {

    const service = props.service;

    const tbar = {
        cls   : styles.toolbar,
        items : [
            {
                type  : 'buttonGroup',
                items : [
                    {
                        type    : 'button',
                        color   : 'b-green',
                        ref     : 'addTaskButton',
                        icon    : 'b-fa b-fa-plus',
                        text    : 'Create',
                        tooltip : 'Create new task',
                        async onAction() {
                            service.gantt.taskStore.rootNode.appendChild({ name : 'New task', duration : 1 });
                        }
                    }
                ]
            },
            {
                type  : 'buttonGroup',
                items : [
                    {
                        type    : 'button',
                        color   : 'b-blue',
                        ref     : 'editTaskButton',
                        icon    : 'b-fa b-fa-pen',
                        text    : 'Edit',
                        tooltip : 'Edit selected task',
                        onAction() {
                            if (service.gantt.selectedRecord) {
                                service.gantt.editTask(service.gantt.selectedRecord);
                            }
                            else {
                                Toast.show('First select the task you want to edit');
                            }
                        }
                    }
                ]
            },
            {
                type  : 'buttonGroup',
                items : [
                    {
                        type     : 'button',
                        color    : 'b-blue',
                        ref      : 'expandAllButton',
                        icon     : 'b-fa b-fa-angle-double-down',
                        tooltip  : 'Expand all',
                        onAction : () => service.gantt.expandAll()
                    },
                    {
                        type     : 'button',
                        color    : 'b-blue',
                        ref      : 'collapseAllButton',
                        icon     : 'b-fa b-fa-angle-double-up',
                        tooltip  : 'Collapse all',
                        onAction : () => service.gantt.collapseAll()
                    }
                ]
            },
            {
                type  : 'buttonGroup',
                items : [
                    {
                        type     : 'button',
                        color    : 'b-blue',
                        ref      : 'zoomInButton',
                        icon     : 'b-fa b-fa-search-plus',
                        tooltip  : 'Zoom in',
                        onAction : () => service.gantt.zoomIn()
                    },
                    {
                        type     : 'button',
                        color    : 'b-blue',
                        ref      : 'zoomOutButton',
                        icon     : 'b-fa b-fa-search-minus',
                        tooltip  : 'Zoom out',
                        onAction : () => service.gantt.zoomOut()
                    },
                    {
                        type     : 'button',
                        color    : 'b-blue',
                        ref      : 'zoomToFitButton',
                        icon     : 'b-fa b-fa-compress-arrows-alt',
                        tooltip  : 'Zoom to fit',
                        onAction : () => service.gantt.zoomToFit({
                            leftMargin  : 50,
                            rightMargin : 50
                        })
                    }
                ]
            },
            {
                type  : 'buttonGroup',
                items : [
                    {
                        type     : 'button',
                        color    : 'b-blue',
                        ref      : 'previousButton',
                        icon     : 'b-fa b-fa-angle-left',
                        tooltip  : 'Previous time span',
                        onAction : () => service.gantt.shiftPrevious()
                    },
                    {
                        type     : 'button',
                        color    : 'b-blue',
                        ref      : 'nextButton',
                        icon     : 'b-fa b-fa-angle-right',
                        tooltip  : 'Next time span',
                        onAction : () => service.gantt.shiftNext()
                    }
                ]
            }
        ]
    };

    return (
        <BryntumPanel cls={styles.panel} type="panel" tbar={tbar} />
    );
};

export default Toolbar;
