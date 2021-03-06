import {
    DragDropContext as dragDropContext,
    DragSource as dragSource,
    DropTarget as dropTarget,
} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import {
    getDepth,
} from './tree-data-utils';

const nodeDragSource = {
    beginDrag(props) {
        props.startDrag(props);

        return {
            node: props.node,
            path: props.path,
        };
    },

    endDrag(props, monitor) {
        props.endDrag(monitor.getDropResult());
    },

    isDragging(props, monitor) {
        const dropTargetNode = monitor.getItem().node;
        const draggedNode    = props.node;

        return draggedNode === dropTargetNode;
    }
};

function getTargetDepth(dropTargetProps, monitor) {
    let dropTargetDepth = 0;
    const draggedItem = monitor.getItem();
    const rowAbove = dropTargetProps.getPrevRow();
    if (rowAbove) {
        // Limit the length of the path to the deepest possible
        dropTargetDepth = Math.min(rowAbove.path.length, dropTargetProps.path.length);
    }

    const blocksOffset = Math.round(
        monitor.getDifferenceFromInitialOffset().x /
        dropTargetProps.scaffoldBlockPxWidth
    );

    let targetDepth = Math.min(dropTargetDepth, Math.max(0, draggedItem.path.length + blocksOffset - 1));

    // If a maxDepth is defined, constrain the target depth
    if (typeof dropTargetProps.maxDepth !== 'undefined' && dropTargetProps.maxDepth !== null) {
        const draggedNode       = monitor.getItem().node;
        const draggedChildDepth = getDepth(draggedNode);

        targetDepth = Math.min(targetDepth, dropTargetProps.maxDepth - draggedChildDepth - 1);
    }

    return targetDepth;
}
let dropTargetPropsDefault = {};
let draggedNodeDefault = {};

function canDrop(dropTargetProps, monitor, isHover = false) {
    let abovePath      = [];
    let aboveNode      = {};
    const rowAbove = dropTargetProps.getPrevRow();
    if (rowAbove) {
        abovePath = rowAbove.path;
        aboveNode = rowAbove.node;
    }
    const targetDepth = getTargetDepth(dropTargetProps, monitor);
    const draggedNode = monitor.getItem();
    dropTargetPropsDefault = dropTargetProps;
    draggedNodeDefault = draggedNode;

    return /* (draggedNode.path.length === dropTargetProps.path.length) && */ (
        // Either we're not adding to the children of the row above...
        targetDepth < abovePath.length ||
        // ...or we guarantee it's not a function we're trying to add to
        typeof aboveNode.children !== 'function'
    ) && (
        // Ignore when hovered above the identical node...
        !(dropTargetProps.node === draggedNode.node && isHover === true) ||
        // ...unless it's at a different level than the current one
        targetDepth !== (dropTargetProps.path.length - 1)
    );
}
function showRedHover() {
    if (Object.keys(dropTargetPropsDefault).length === 0 || Object.keys(draggedNodeDefault).length === 0) {
        return false;
    }
    return draggedNodeDefault.path.length === dropTargetPropsDefault.path.length;
}

const nodeDropTarget = {
    drop(dropTargetProps, monitor) {
        const draggedNode = monitor.getItem();
        if (draggedNode.path.length !== dropTargetProps.path.length) {
            return {
                node:             draggedNode.node,
                path:             draggedNode.path,
                minimumTreeIndex: draggedNode.path[draggedNode.path.length - 1],
                depth:            (draggedNode.path.length - 1),
            };
        }
        return {
            node:             draggedNode.node,
            path:             draggedNode.path,
            minimumTreeIndex: dropTargetProps.treeIndex,
            depth:            getTargetDepth(dropTargetProps, monitor),
        };
    },

    hover(dropTargetProps, monitor) {
        if (!canDrop(dropTargetProps, monitor, true)) {
            return;
        }
        dropTargetProps.dragHover({
            node:             monitor.getItem().node,
            path:             monitor.getItem().path,
            minimumTreeIndex: dropTargetProps.listIndex,
            depth:            getTargetDepth(dropTargetProps, monitor),
        });
    },
    canDrop,
};

function nodeDragSourcePropInjection(connect, monitor) {
    return {
        connectDragSource:  connect.dragSource(),
        connectDragPreview: connect.dragPreview(),
        isDragging:         monitor.isDragging(),
    };
}

function nodeDropTargetPropInjection(connect, monitor) {
    const dragged = monitor.getItem();
    return {
        connectDropTarget: connect.dropTarget(),
        isOver:            monitor.isOver(),
        canDrop:           monitor.canDrop(),
        draggedNode:       dragged ? dragged.node : null,
        showRedHover:      showRedHover(),
    };
}

export function dndWrapSource(el, type) {
    return dragSource(type, nodeDragSource, nodeDragSourcePropInjection)(el);
}

export function dndWrapTarget(el, type) {
    return dropTarget(type, nodeDropTarget, nodeDropTargetPropInjection)(el);
}

export function dndWrapRoot(el) {
    return dragDropContext(HTML5Backend)(el);
}
