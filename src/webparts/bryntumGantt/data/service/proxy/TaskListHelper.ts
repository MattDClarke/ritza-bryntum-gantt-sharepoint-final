export class TaskListHelper {

    /**
     * Function for processing flat tree data into structured tree
     * @param items
     */
    public static getRootNodes(items: any[]): any[] {

        const
            map = {},
            rootNodes = [];
        let i = 0, item;
        items = items || [];

        for (; i < items.length; i++) {
            item = items[i];
            item.leaf = true;
            map[item.Id] = item;
        }

        for (i = 0; i < items.length; i++) {

            item = items[i];

            if (item.ParentIDId) {

                const parent = map[item.ParentIDId];

                if (parent.leaf) {
                    parent.leaf = false;
                    parent.children = [];
                }
                parent.children.push(item);
            }
            else {
                rootNodes.push(item);
            }
        }
        return rootNodes;
    }
}
