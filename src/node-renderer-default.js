import React, { PropTypes } from 'react';
import _ from 'lodash';
import { getIEVersion } from './utils/browser-utils';
import baseStyles from './node-renderer-default.scss';

let styles = baseStyles;
// Add extra classes in browsers that don't support flex
if (getIEVersion < 10) {
    styles = {
        ...baseStyles,
        row:         `${styles.row} ${styles.row_NoFlex}`,
        rowContents: `${styles.rowContents} ${styles.rowContents_NoFlex}`,
        rowLabel:    `${styles.rowLabel} ${styles.rowLabel_NoFlex}`,
        rowToolbar:  `${styles.rowToolbar} ${styles.rowToolbar_NoFlex}`,
    };
}

const NodeRendererDefault = ({
    toggleChildrenVisibility,
    connectDragPreview,
    connectDragSource,
    showRedHover,
    isDragging,
    isOver,
    node,
    path,
    treeIndex,
    buttons,
    className,
    startDrag: _startDrag,
    endDrag: _endDrag,
    ...otherProps,
}) => {
    let handle;
    if (typeof node.children === 'function' && node.expanded) {
        // Show a loading symbol on the handle when the children are expanded
        //  and yet still defined by a function (a callback to fetch the children)
        handle = (
            <div className={styles.loadingHandle}>
                <div className={styles.loadingCircle}>
                    <div className={styles.loadingCirclePoint} />
                    <div className={styles.loadingCirclePoint} />
                    <div className={styles.loadingCirclePoint} />
                    <div className={styles.loadingCirclePoint} />
                    <div className={styles.loadingCirclePoint} />
                    <div className={styles.loadingCirclePoint} />
                    <div className={styles.loadingCirclePoint} />
                    <div className={styles.loadingCirclePoint} />
                    <div className={styles.loadingCirclePoint} />
                    <div className={styles.loadingCirclePoint} />
                    <div className={styles.loadingCirclePoint} />
                    <div className={styles.loadingCirclePoint} />
                </div>
            </div>
        );
    } else {
        // Show the handle used to initiate a drag-and-drop
        handle = connectDragSource((
            <div className={styles.moveHandle} />
        ), { dropEffect: 'copy' });
    }
    const newProps = _.omit(otherProps, [ 'showRedHover', 'rendererProps', 'removeNode', 'addNode', 'isSearchMatch', 'isSearchFocus', 'scaffoldBlockPxWidth', 'draggedNode' ]);

    return (
        <div
            style={{ height: '100%' }}
            onClick={() => toggleChildrenVisibility && toggleChildrenVisibility({node, path, treeIndex})}
            {...newProps}
        >
            <div className={styles.rowWrapper}>
                {/* Set the row preview to be used during drag and drop */}
                {connectDragPreview(
                    <div
                        className={styles.row +
                            (isDragging && isOver && !showRedHover ? ` ${styles.rowCancelPad}` : '') +
                            (isDragging && !isOver && !showRedHover ? ` ${styles.rowCancelPad}` : '') +
                            (isDragging && isOver && showRedHover ? ` ${styles.rowLandingPad}` : '') +
                            (isDragging && !isOver && showRedHover ? ` ${styles.rowCancelPad}` : '') +
                            (className ? ` ${className}` : '')
                        }
                    >
                        {handle}

                        <div className={styles.rowContents}>
                            <div className={styles.rowLabel}>
                                <span
                                    className={styles.rowTitle +
                                        (node.subtitle ? ` ${styles.rowTitleWithSubtitle}` : '')
                                    }
                                >
                                    {typeof node.title === 'function' ?
                                        node.title({node, path, treeIndex }) :
                                        node.title
                                    }
                                </span>

                                {node.subtitle &&
                                    <span className={styles.rowSubtitle}>
                                        {typeof node.subtitle === 'function' ?
                                            node.subtitle({node, path, treeIndex }) :
                                            node.subtitle
                                        }
                                    </span>
                                }
                            </div>

                            <div className={styles.rowToolbar}>
                                {buttons && buttons.map((btn, index) => (
                                    <div key={index} className={styles.toolbarButton}>
                                        {btn}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

NodeRendererDefault.propTypes = {
    node:          PropTypes.object.isRequired,
    path:          PropTypes.arrayOf(PropTypes.oneOfType([ PropTypes.string, PropTypes.number ])).isRequired,
    treeIndex:     PropTypes.number.isRequired,
    isSearchMatch: PropTypes.bool,
    isSearchFocus: PropTypes.bool,

    scaffoldBlockPxWidth:     PropTypes.number.isRequired,
    toggleChildrenVisibility: PropTypes.func,
    buttons:                  PropTypes.arrayOf(PropTypes.node),
    className:                PropTypes.string,
    style:                    PropTypes.object,

    // Drag and drop API functions
    // Drag source
    connectDragPreview: PropTypes.func.isRequired,
    connectDragSource:  PropTypes.func.isRequired,
    startDrag:          PropTypes.func.isRequired, // Needed for drag-and-drop utils
    endDrag:            PropTypes.func.isRequired, // Needed for drag-and-drop utils
    isDragging:         PropTypes.bool.isRequired,
    draggedNode:        PropTypes.object,
    // Drop target
    isOver:  PropTypes.bool.isRequired,
    canDrop: PropTypes.bool.isRequired,
    showRedHover: PropTypes.bool.isRequired,
};

export default NodeRendererDefault;
