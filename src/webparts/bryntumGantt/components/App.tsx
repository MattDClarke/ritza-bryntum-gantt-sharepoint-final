import React, { useEffect } from 'react';
import styles from './App.module.scss';
import { IAppProps } from './IAppProps';
import Header from './Header/Header';
import Toolbar from './Toolbar/Toolbar';
import Gantt from './Gantt/Gantt';
import { DateHelper } from '@bryntum/gantt';

/**
 * The WebPart App component. Includes a Header and the Gantt Component
 *
 * @param props
 * @constructor
 */
const App: React.FC<IAppProps> = props => {

    const listIdChange = () => {
        // Will trigger a loading operation on the provided listId
        props.service.listId = props.listId;
    };

    // Listen for property changes on the listId
    useEffect(listIdChange, [props.listId]);

    const timeSpanChange = () => {

        const startDate: Date = props.startDate || new Date();
        const range = props.range || 1;

        if (startDate instanceof Date) {
            props.service.setTimeSpan(startDate, range);
        }
        else {
            props.service.setTimeSpan(DateHelper.parse(startDate, DateHelper.defaultFormat), range);
        }
    };

    // Listen for a timespan change set in the PropertyPane
    useEffect(timeSpanChange, [props.startDate, props.range]);

    return (
        <>
            <div className={styles.app}>
                <Header
                    hidden={!props.showHeader}
                    description={props.description}
                />
                <div className={styles.container}>
                    <Toolbar
                        service={props.service}
                     />
                    <Gantt
                        service={props.service}
                     />
                </div>
            </div>
        </>
    );
};

export default App;
