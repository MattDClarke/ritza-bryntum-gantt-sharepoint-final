import { BryntumGanttProps } from '@bryntum/gantt-react';
import styles from '../App.module.scss';

export const ganttConfig: Partial<BryntumGanttProps> = {

    cls : styles.gantt,

    viewPreset : 'weekAndDayLetter',

    barMargin : 10,

    autoHeight : true,

    columns: [
      { type: "name", width: 180, text: "TASK" },
      {
        type: "resourceassignment",
        text: "Assigned Resources",
        showAvatars: false,
        width: 160,
      },
  
      {
        type: "percent",
        text: "PROGRESS",
        field: "percentDone",
        showValue: true,
        width: 160,
      },
      { type: "date", field: "startDate", text: "START", width: 110 },
      { type: "date", field: "endDate", text: "END", width: 110 },
    ],

    rollupsFeature : true,

    filterFeature : true,

    dependencyEditFeature : true,

    timeRangesFeature : {
        showCurrentTimeLine : true
    },

    labelsFeature : {
        left : {
            field  : 'name',
            editor : {
                type : 'textfield'
            }
        }
    }
};
