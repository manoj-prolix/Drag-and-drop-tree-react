import React, { PropTypes, Children, cloneElement } from 'react';
import _ from 'lodash';
import styles from './tree-node.scss';

const TreeNode = ({
    children,
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
    const newProps = _.omit(otherProps, [ 'treeIndex', 'listIndex', 'lowerSiblingCounts', 'scaffoldBlockPxWidth', 'swapFrom', 'swapLength', 'swapDepth' ]);

    return connectDropTarget(
        <div
            {...newProps}
        >
            <div
                className={styles.nodeContent}
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
