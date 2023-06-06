/* eslint-disable @typescript-eslint/explicit-function-return-type */

import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
    IPropertyPaneConfiguration,
    PropertyPaneTextField,
    PropertyPaneCheckbox,
    PropertyPaneDropdown,
    PropertyPaneButton,
    PropertyPaneChoiceGroup,
    IPropertyPaneDropdownOption
} from '@microsoft/sp-property-pane';
import { PropertyFieldDateTimePicker, DateConvention, IDateTimeFieldValue } from '@pnp/spfx-property-controls/lib/PropertyFieldDateTimePicker';

import { PropertyFieldNumber } from '@pnp/spfx-property-controls/lib/PropertyFieldNumber';

import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import { getSP } from './pnpjsConfig';

import * as strings from 'BryntumGanttWebPartStrings';
import App from './components/App';

import DataService from './data/DataService';
import BaseService from './data/service/BaseService';

export interface IBryntumGanttWebPartProps {
    showHeader: boolean
    description: string // Description set in the header and used for tasklist creation
    listId: string // The list guid
    disableCreateTaskList: boolean // Set to false to disable tasklist creation
    startDate: IDateTimeFieldValue // Start date of the timespan
    range: number // Number of months from startdate
    demoData: string// Single or full demo
}

export default class BryntumGanttWebPart extends BaseClientSideWebPart <IBryntumGanttWebPartProps> {

    private taskLists: IPropertyPaneDropdownOption[] = [];
    private service: BaseService;


    public render(): void {

        // Initial startDate for the Gantt view
        const startDate =  this.properties.startDate ? this.properties.startDate.value : new Date();

        const element = React.createElement(
            App,
            {
                title       : this.context.pageContext.web.title,
                showHeader  : this.properties.showHeader,
                description : this.properties.description,
                service     : this.service,
                listId      : this.properties.listId,
                startDate   : startDate,
                range       : this.properties.range
            }
        );
        ReactDom.render(element, this.domElement);
    }

    protected onInit(): Promise<void> {
        return super.onInit().then(_ => {

            // Get the Service, Mock or Remote SPService
            this.service = DataService.getService(this.context);

            // When running on the SharePoint tenant
            getSP(this.context);

            this.properties.disableCreateTaskList = false;

            // Get all available TaskLists and trigger load
            this.getTaskLists().catch(err => {
                alert(err.message);
            });
        });
    }

    /**
   * Get available tasklists. Sets the retrieved items in the dropdown box in the PropertyPane.
   * On callback the default or saved listId will be loaded.
   */
    private getTaskLists(): Promise<{ key: string; text: string }[]> {
        return new Promise<{ key: string; text: string }[]>((resolve, reject) => {
            this.service.getTaskLists().then(items => {
                // Sets the retrieved items on the PropertyPaneDropDown automatically setting attached `listId` which will cause the default(set) list load
                this.taskLists = items;
                resolve(items);
            }).catch(reject);
        });
    }

    /**
   * Create a demolist or ensure it exists on the SharePoint tenant.
   * On callback the newly created list is loaded by setting `listId` after refreshing the available tasklists.
   */
    private ensureTaskList() {
        this.properties.disableCreateTaskList = true;
        // eslint-disable-next-line no-void
        void this.service.ensureList(this.properties.description + 'Demo', this.properties.demoData).then(guid => {
            // eslint-disable-next-line no-void
            void this.getTaskLists().then(() => {
                this.properties.disableCreateTaskList = false;
                this.properties.listId = guid;
                this.service.listId = guid;
                this.context.propertyPane.refresh();
            });
        });
        return true;
    }

    protected onDispose(): void {
        ReactDom.unmountComponentAtNode(this.domElement);
    }

    protected get dataVersion(): Version {
        return Version.parse('1.0');
    }

    /**
   * The PropertyPane with items for the WebPart configuration.
   * - Description field
   * - StartDate Picker field
   * - Timespan Range field (the length of the timespan in months)
   * - Dropdown field containing all available tasklists with `Bryntum demo` mentioned in the description
   * - Choice box field to add a single task or full demo project to a newly created tasklist
   * - Create button for a new demo tasklist. The name of the list is set in the PropertyPane Description field.
   */
    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
        return {
            pages : [
                {
                    header : {
                        description : strings.PropertyPaneDescription
                    },
                    groups : [
                        {
                            groupName   : strings.BasicGroupName,
                            groupFields : [
                                PropertyPaneCheckbox('showHeader', {
                                    text : strings.ShowHeaderLabel
                                }),
                                PropertyPaneTextField('description', {
                                    label : strings.DescriptionFieldLabel
                                }),
                                PropertyFieldDateTimePicker('startDate', {
                                    label                  : strings.StartDateFieldLabel,
                                    initialDate            : { value : new Date(), displayValue : new Date().toISOString() },
                                    dateConvention         : DateConvention.Date,
                                    onPropertyChange       : this.onPropertyPaneFieldChanged,
                                    properties             : this.properties,
                                    onGetErrorMessage      : null,
                                    deferredValidationTime : 0,
                                    key                    : 'startDateFieldId',
                                    showLabels             : false
                                }),
                                PropertyFieldNumber('range', {
                                    key         : 'numberValue',
                                    label       : strings.RangeFieldLabel,
                                    description : strings.RangeFieldDescription,
                                    value       : this.properties.range,
                                    maxValue    : 10,
                                    minValue    : 1,
                                    disabled    : false
                                }),
                                PropertyPaneDropdown('listId', {
                                    label       : strings.TaskListDropdownLabel,
                                    options     : this.taskLists,
                                    selectedKey : this.properties.listId
                                }),
                                PropertyPaneChoiceGroup('demoData', {
                                    label   : strings.DemoDataFieldLabel,
                                    options : [
                                        { key : 'single', text : strings.DemoDataFieldOption1 },
                                        { key : 'fulldemo', text : strings.DemoDataFieldOption2 }
                                    ]
                                }),
                                PropertyPaneButton('disableCreateTaskList', {
                                    text     : strings.TaskListButtonCreateLabel + this.properties.description + 'Demo',
                                    onClick  : this.ensureTaskList.bind(this),
                                    disabled : this.properties.disableCreateTaskList
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    }
}
