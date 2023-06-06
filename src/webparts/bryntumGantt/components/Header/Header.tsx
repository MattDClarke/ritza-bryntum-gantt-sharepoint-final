/**
 * Demo header implementation
 */
import * as React from 'react';
import styles from './Header.module.scss';

export interface IHeaderProps {
    hidden: boolean
    description: string
}

/**
 * Header of the webpart.
 * @param props
 * @constructor
 */
const Header: React.FC<IHeaderProps> = props => {
    if (!props.hidden) {
        return (
            <header className={styles.appHeader}>
                <div className={styles.titleContainer}>
                    <a className={styles.title} href=".">React Basic {props.description} Sharepoint Web Part</a>
                </div>
                {/*Add additional header items here*/}
            </header>
        );
    }
    else return (<></>);
};

export default Header;
