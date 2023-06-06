import { UpdateAction } from './UpdatePackage';
import { Response } from './Response';

/**
 * Interface for the list proxy
 */
export default interface ITaskList {
    deleteTaskListItems(listId: string, actions: UpdateAction[]): Promise<UpdateAction[]>

    addTaskListItems(listId: string, actions: UpdateAction[]): Promise<UpdateAction[]>

    updateTaskListItems(listId: string, actions: UpdateAction[]): Promise<UpdateAction[]>

    getTaskListItems(listId: string): Promise<Response>
}
