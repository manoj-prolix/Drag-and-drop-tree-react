import React, { PropTypes, Children, cloneElement } from 'react';
import styles from './tree-node.scss';

const TreeNode = ({
    children,
    scaffoldBlockPxWidth,
    lowerSiblingCounts,
    connectDropTarget,
    isOver,
    draggedNode,
    canDrop,
    getPrevRow: _getPrevRow, // Delete from otherProps
    node:       _node,       // Delete from otherProps
    path:       _path,       // Delete from otherProps
    maxDepth:   _maxDepth,   // Delete from otherProps
    dragHover:  _dragHover,  // Delete from otherProps
    ...otherProps,
}) => {
    // Construct the scaffold representing the structure of the tree
    const scaffoldBlockCount = lowerSiblingCounts.length;

    return connectDropTarget(
        <div
            {...otherProps}
        >
            <div
                className={styles.nodeContent}
                style={{ left: scaffoldBlockPxWidth * scaffoldBlockCount }}
            >
                {Children.map(children, child => cloneElement(child, {
                    isOver,
                    canDrop,
                    draggedNode,
                }))}
            </div>
        </div>
    );
};

TreeNode.propTypes = {
    treeIndex:            PropTypes.number.isRequired,
    node:                 PropTypes.object.isRequired,
    path:                 PropTypes.arrayOf(PropTypes.oneOfType([ PropTypes.string, PropTypes.number ])).isRequired,
    swapFrom:             PropTypes.number,
    swapDepth:            PropTypes.number,
    swapLength:           PropTypes.number,
    scaffoldBlockPxWidth: PropTypes.number.isRequired,
    lowerSiblingCounts:   PropTypes.array.isRequired,

    listIndex: PropTypes.number.isRequired,
    children:  PropTypes.node,

    // Drop target
    connectDropTarget: PropTypes.func.isRequired,
    isOver:            PropTypes.bool.isRequired,
    canDrop:           PropTypes.bool.isRequired,
    draggedNode:       PropTypes.object,
};

export default TreeNode;
