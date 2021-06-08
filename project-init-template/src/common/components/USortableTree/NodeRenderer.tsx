/**
 * @file: USortableTree默认渲染
 * @author: liyunkun(liyunkun@baidu.com)
 */
/* eslint-disable indent */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
import React from 'react';
import _ from 'lodash';
import {NodeRendererProps} from 'react-sortable-tree';
import {isDescendant} from './tree-data-utils';
import './node-renderer.less';

const classnames = (...classes: any) => classes.filter(Boolean).join(' ');

export interface UNodeRendererProps extends NodeRendererProps {
  customerContent: HTMLElement | JSX.Element;
  [props: string]: any;
}

// eslint-disable-next-line complexity
function NodeRendererDefault(props: UNodeRendererProps) {
  const {
    scaffoldBlockPxWidth,
    toggleChildrenVisibility,
    connectDragPreview,
    connectDragSource,
    isDragging,
    canDrop = false,
    canDrag,
    node,
    title = null,
    subtitle = null,
    draggedNode,
    path,
    treeIndex,
    isSearchMatch = false,
    isSearchFocus = false,
    buttons = [],
    className = '',
    style = {},
    didDrop,
    // treeId,
    customerContent,
    // isOver, // Not needed, but preserved for other renderers
    // parentNode, // Needed for dndManager
    rowDirection = 'ltr',
    ...otherProps
  } = props;

  const nodeTitle = title || node.title;
  const nodeSubtitle = subtitle || node.subtitle;
  const rowDirectionClass = rowDirection === 'rtl' ? 'rst__rtl' : null;

  let handle: JSX.Element = null;
  if (canDrag) {
    if (typeof node.children === 'function' && node.expanded) {
        /**
         * Show a loading symbol on the handle when the children are expanded
         * and yet still defined by a function (a callback to fetch the children)
         */
        handle = (
          <div className="rst__loadingHandle">
            <div className="rst__loadingCircle">
              {[...new Array(12)].map((_, index) => (
                <div
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
                  className={classnames(
                    'rst__loadingCirclePoint',
                    rowDirectionClass
                  )}
                />
              ))}
            </div>
          </div>
        );
    } else {
      // Show the handle used to initiate a drag-and-drop
      handle = connectDragSource(<div className={`rst__moveHandle layer-${node.layer}`} />, {
        dropEffect: 'copy',
      });
    }
  }

  const isDraggedDescendant = draggedNode && isDescendant(draggedNode, node);
  const isLandingPadActive = !didDrop && isDragging;

  let buttonStyle: React.CSSProperties = {left: -0.5 * scaffoldBlockPxWidth};
  if (rowDirection === 'rtl') {
    buttonStyle = {right: -0.5 * scaffoldBlockPxWidth};
  }

  return (
    <div style={{height: '100%'}} className={className} {..._.omit(otherProps, 'parentNode', 'isOver', 'treeId')}>
      {
        toggleChildrenVisibility
        && node.children
        && (node.children.length > 0 || typeof node.children === 'function')
        ? (
          <div>
            <button
              type="button"
              aria-label={node.expanded ? 'Collapse' : 'Expand'}
              className={classnames(
                node.expanded ? 'rst__collapseButton' : 'rst__expandButton',
                rowDirectionClass
              )}
              style={buttonStyle}
              onClick={() => {
                toggleChildrenVisibility({
                  node,
                  path,
                  treeIndex,
                });
              }}
            />

            {node.expanded && !isDragging && (
              <div
                style={{width: scaffoldBlockPxWidth}}
                className={classnames('rst__lineChildren', rowDirectionClass)}
              />
            )}
          </div>
        )
        : null
      }

      <div className={classnames('rst__rowWrapper', rowDirectionClass)}>
        {/* Set the row preview to be used during drag and drop */}
        {connectDragPreview(
          <div
            className={classnames(
              'rst__row',
              isLandingPadActive && 'rst__rowLandingPad',
              isLandingPadActive && !canDrop && 'rst__rowCancelPad',
              isSearchMatch && 'rst__rowSearchMatch',
              isSearchFocus && 'rst__rowSearchFocus',
              rowDirectionClass,
              className)
            }
            style={{
              opacity: isDraggedDescendant ? 0.5 : 1,
              ...style,
            }}
          >
            {handle}

            <div
              className={classnames(
                'rst__rowContents',
                !canDrag && 'rst__rowContentsDragDisabled',
                rowDirectionClass
              )}
            >
              <div className={classnames('rst__rowLabel', rowDirectionClass)}>
                <span
                  className={classnames(
                    'rst__rowTitle',
                    node.subtitle && 'rst__rowTitleWithSubtitle'
                  )}
                >
                  {typeof nodeTitle === 'function'
                    ? nodeTitle({
                        node,
                        path,
                        treeIndex,
                      })
                    : nodeTitle}
                </span>

                {nodeSubtitle && (
                  <span className="rst__rowSubtitle">
                    {typeof nodeSubtitle === 'function'
                      ? nodeSubtitle({
                          node,
                          path,
                          treeIndex,
                        })
                      : nodeSubtitle}
                  </span>
                )}
              </div>

              <div className="customer-content">
                {customerContent}
              </div>

              <div className="rst__rowToolbar">
                {buttons.map((btn, index) => (
                  <div
                    key={index} // eslint-disable-line react/no-array-index-key
                    className="rst__toolbarButton"
                  >
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
}

export default NodeRendererDefault;
