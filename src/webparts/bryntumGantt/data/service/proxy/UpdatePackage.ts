import LookupTaskModel from '../../model/LookupTaskModel';

export class UpdateAction {
    public record: any;// needs to have at least { id: id } not needed for adding records
    public data: any;// modifications
    public skip = false;// used for deletions, child nodes are skipped when parents get deleted

    constructor(record, data) {
        this.record = record;
        this.data = data;
    }
}

export class UpdatePackage {
    public add: UpdateAction[] = [];
    public update: UpdateAction[] = [];
    public remove: UpdateAction[] = [];

    /**
     * Add and prepare an update action to persist a change in the TaskList
     * @param task
     * @param modifications
     * @param removed
     */
    public addActionToUpdatePackage(task: LookupTaskModel, modifications, removed = false) {

        if (!modifications && !removed) {
            return;
        }

        const slot = removed ? 'remove' : task.isPhantom ? 'add' : 'update';
        const config = new UpdateAction(task, modifications);

        if (slot === 'add') {
            config.data['ParentIDId'] = task.parentId;
            this.add.push(config);
        }

        if (slot === 'update') {
            this.update.push(config);
        }

        if (slot === 'remove') {
            this.remove.push(config);
        }
    }
}
