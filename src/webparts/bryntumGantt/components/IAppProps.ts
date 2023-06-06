import Service from '../data/service/Service';

export interface IAppProps {
    title: string
    showHeader: boolean
    description: string
    service: Service
    listId: string
    startDate: Date
    range: number
}
