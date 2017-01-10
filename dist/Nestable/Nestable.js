'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactAddonsShallowCompare = require('react-addons-shallow-compare');

var _reactAddonsShallowCompare2 = _interopRequireDefault(_reactAddonsShallowCompare);

var _reactAddonsUpdate = require('react-addons-update');

var _reactAddonsUpdate2 = _interopRequireDefault(_reactAddonsUpdate);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _utils = require('../utils');

//require('./Nestable.css');

var _NestableItem = require('./NestableItem');

var _NestableItem2 = _interopRequireDefault(_NestableItem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Nestable = (function (_Component) {
    _inherits(Nestable, _Component);

    function Nestable(props) {
        _classCallCheck(this, Nestable);

        var _this = _possibleConstructorReturn(this, (Nestable.__proto__ || Object.getPrototypeOf(Nestable)).call(this, props));

        _this.collapse = function (itemIds) {
            var childrenProp = _this.props.childrenProp;
            var items = _this.state.items;

            if (itemIds == 'NONE') {
                _this.setState({
                    collapsedGroups: []
                });
            } else if (itemIds == 'ALL') {
                _this.setState({
                    collapsedGroups: items.filter(function (item) {
                        return item[childrenProp].length;
                    }).map(function (item) {
                        return item.id;
                    })
                });
            } else if ((0, _utils.isArray)(itemIds)) {
                var groups = items.filter(function (item) {
                    return item[childrenProp].length && itemIds.indexOf(item.id);
                }).map(function (item) {
                    return item.id;
                });

                _this.setState({
                    collapsedGroups: groups
                });
            }
        };

        _this.startTrackMouse = function () {
            document.addEventListener('mousemove', _this.onMouseMove);
            document.addEventListener('mouseup', _this.onDragEnd);
        };

        _this.stopTrackMouse = function () {
            document.removeEventListener('mousemove', _this.onMouseMove);
            document.removeEventListener('mouseup', _this.onDragEnd);
            _this.elCopyStyles = null;
        };

        _this.getItemDepth = function (item) {
            var childrenProp = _this.props.childrenProp;

            var level = 1;

            if (item[childrenProp].length > 0) {
                var childrenDepths = item[childrenProp].map(_this.getItemDepth);
                level += Math.max(childrenDepths);
            }

            return level;
        };

        _this.onDragStart = function (e, item) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }

            _this.startTrackMouse();
            _this.onMouseMove(e);

            _this.setState({
                dragItem: item
            });
        };

        _this.onDragEnd = function (e) {
            e && e.preventDefault();

            var onChange = _this.props.onChange;
            var _this$state = _this.state,
                items = _this$state.items,
                isDirty = _this$state.isDirty,
                dragItem = _this$state.dragItem;

            _this.stopTrackMouse();

            _this.setState({
                dragItem: null,
                isDirty: false
            });

            onChange && isDirty && onChange(items, dragItem);
        };

        _this.onMouseMove = function (e) {
            var _this$props = _this.props,
                group = _this$props.group,
                threshold = _this$props.threshold;
            var dragItem = _this.state.dragItem;
            var target = e.target,
                clientX = e.clientX,
                clientY = e.clientY;

            var el = (0, _utils.closest)(target, '.nestable-item');
            var elCopy = document.querySelector('.nestable-' + group + ' .nestable-drag-layer > .nestable-list');

            if (!_this.elCopyStyles) {
                var offset = (0, _utils.getOffsetRect)(el);
                var scroll = {
                    top: document.body.scrollTop,
                    left: document.body.scrollLeft
                };

                _this.elCopyStyles = {
                    marginTop: offset.top - clientY - scroll.top,
                    marginLeft: offset.left - clientX - scroll.left,
                    transform: _this.getTransformProps(clientX, clientY).transform
                };
            } else {
                _this.elCopyStyles.transform = _this.getTransformProps(clientX, clientY).transform;
                elCopy.style.transform = _this.elCopyStyles.transform;

                var diffX = clientX - _this.mouse.last.x;
                if (diffX >= 0 && _this.mouse.shift.x >= 0 || diffX <= 0 && _this.mouse.shift.x <= 0) {
                    _this.mouse.shift.x += diffX;
                } else {
                    _this.mouse.shift.x = 0;
                }
                _this.mouse.last.x = clientX;

                if (Math.abs(_this.mouse.shift.x) > threshold) {
                    if (_this.mouse.shift.x > 0) {
                        _this.tryIncreaseDepth(dragItem);
                    } else {
                        _this.tryDecreaseDepth(dragItem);
                    }

                    _this.mouse.shift.x = 0;
                }
            }
        };

        _this.onMouseEnter = function (e, item) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }

            var dragItem = _this.state.dragItem;

            if (dragItem.id === item.id) return;

            var pathFrom = _this.getPathById(dragItem.id);
            var pathTo = _this.getPathById(item.id);

            _this.moveItem({ dragItem: dragItem, pathFrom: pathFrom, pathTo: pathTo });
        };

        _this.onToggleCollapse = function (item) {
            var collapsedGroups = _this.state.collapsedGroups;

            var index = collapsedGroups.indexOf(item.id);

            if (index > -1) {
                _this.setState({
                    collapsedGroups: collapsedGroups.filter(function (id) {
                        return id != item.id;
                    })
                });
            } else {
                _this.setState({
                    collapsedGroups: collapsedGroups.concat(item.id)
                });
            }
        };

        _this.state = {
            items: [],
            dragItem: null,
            isDirty: false,
            collapsedGroups: []
        };

        _this.elCopyStyles = null;
        _this.mouse = {
            last: { x: 0 },
            shift: { x: 0 }
        };
        return _this;
    }

    _createClass(Nestable, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var items = this.props.items;

            // make sure every item has property 'children'

            items = (0, _utils.listWithChildren)(items);

            this.setState({ items: items });
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            var itemsNew = nextProps.items;

            var isPropsUpdated = (0, _reactAddonsShallowCompare2.default)({ props: this.props, state: {} }, nextProps, {});

            if (isPropsUpdated) {
                this.stopTrackMouse();

                this.setState({
                    items: (0, _utils.listWithChildren)(itemsNew),
                    dragItem: null,
                    isDirty: false
                });
            }
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.stopTrackMouse();
        }

        // ––––––––––––––––––––––––––––––––––––
        // Public Methods
        // ––––––––––––––––––––––––––––––––––––

        // ––––––––––––––––––––––––––––––––––––
        // Methods
        // ––––––––––––––––––––––––––––––––––––

    }, {
        key: 'moveItem',
        value: function moveItem(_ref) {
            var dragItem = _ref.dragItem,
                pathFrom = _ref.pathFrom,
                pathTo = _ref.pathTo;
            var childrenProp = this.props.childrenProp;
            var items = this.state.items;

            // the remove action might affect the next position,
            // so update next coordinates accordingly

            var realPathTo = this.getRealNextPath(pathFrom, pathTo);

            var removePath = this.getSplicePath(pathFrom, {
                numToRemove: 1,
                childrenProp: childrenProp
            });

            var insertPath = this.getSplicePath(realPathTo, {
                numToRemove: 0,
                itemsToInsert: [dragItem],
                childrenProp: childrenProp
            });

            items = (0, _reactAddonsUpdate2.default)(items, removePath);
            items = (0, _reactAddonsUpdate2.default)(items, insertPath);

            this.setState({
                items: items,
                isDirty: true
            });
        }
    }, {
        key: 'tryIncreaseDepth',
        value: function tryIncreaseDepth(dragItem) {
            var _props = this.props,
                maxDepth = _props.maxDepth,
                childrenProp = _props.childrenProp;
            var collapsedGroups = this.state.collapsedGroups;

            var pathFrom = this.getPathById(dragItem.id);
            var itemIndex = pathFrom[pathFrom.length - 1];
            var newDepth = pathFrom.length + this.getItemDepth(dragItem);

            // has previous sibling and isn't at max depth
            if (itemIndex > 0 && newDepth <= maxDepth) {
                var prevSibling = this.getItemByPath(pathFrom.slice(0, -1).concat(itemIndex - 1));

                // previous sibling is not collapsed
                if (collapsedGroups.indexOf(prevSibling.id) == -1) {
                    var pathTo = pathFrom.slice(0, -1).concat(itemIndex - 1).concat(prevSibling[childrenProp].length);

                    this.moveItem({ dragItem: dragItem, pathFrom: pathFrom, pathTo: pathTo });
                }
            }
        }
    }, {
        key: 'tryDecreaseDepth',
        value: function tryDecreaseDepth(dragItem) {
            var childrenProp = this.props.childrenProp;

            var pathFrom = this.getPathById(dragItem.id);
            var itemIndex = pathFrom[pathFrom.length - 1];

            // has parent
            if (pathFrom.length > 1) {
                var parent = this.getItemByPath(pathFrom.slice(0, -1));

                // is last item in array
                if (itemIndex + 1 == parent[childrenProp].length) {
                    var pathTo = pathFrom.slice(0, -1);
                    pathTo[pathTo.length - 1] += 1;

                    this.moveItem({ dragItem: dragItem, pathFrom: pathFrom, pathTo: pathTo });
                }
            }
        }

        // ––––––––––––––––––––––––––––––––––––
        // Getter methods
        // ––––––––––––––––––––––––––––––––––––

    }, {
        key: 'getTransformProps',
        value: function getTransformProps(x, y) {
            return {
                transform: 'translate(' + x + 'px, ' + y + 'px)'
            };
        }
    }, {
        key: 'getPathById',
        value: function getPathById(id) {
            var _this2 = this;

            var items = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.state.items;
            var childrenProp = this.props.childrenProp;

            var path = [];

            items.every(function (item, i) {
                if (item.id === id) {
                    path.push(i);
                } else if (item[childrenProp]) {
                    var childrenPath = _this2.getPathById(id, item[childrenProp]);

                    if (childrenPath.length) {
                        path = path.concat(i).concat(childrenPath);
                    }
                }

                return path.length == 0;
            });

            return path;
        }
    }, {
        key: 'getItemByPath',
        value: function getItemByPath(path) {
            var items = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.state.items;
            var childrenProp = this.props.childrenProp;

            var item = null;

            path.forEach(function (index, i) {
                var list = item ? item[childrenProp] : items;
                item = list[index];
            });

            return item;
        }

        /*getItemById(id, items = this.state.items) {
            const { childrenProp } = this.props;
            let item = null;
             items.forEach((index, i) => {
                const list = item ? item[childrenProp] : items;
                item = list[index];
            });
             return item;
        }*/

    }, {
        key: 'getSplicePath',
        value: function getSplicePath(path) {
            var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            var splicePath = {};
            var numToRemove = options.numToRemove || 0;
            var itemsToInsert = options.itemsToInsert || [];
            var lastIndex = path.length - 1;
            var currentPath = splicePath;

            path.forEach(function (index, i) {
                if (i === lastIndex) {
                    currentPath.$splice = [[index, numToRemove].concat(_toConsumableArray(itemsToInsert))];
                } else {
                    var nextPath = {};
                    currentPath[index] = _defineProperty({}, options.childrenProp, nextPath);
                    currentPath = nextPath;
                }
            });

            return splicePath;
        }
    }, {
        key: 'getRealNextPath',
        value: function getRealNextPath(prevPath, nextPath) {
            var childrenProp = this.props.childrenProp;
            var collapsedGroups = this.state.collapsedGroups;

            var ppLastIndex = prevPath.length - 1;
            var npLastIndex = nextPath.length - 1;

            if (prevPath.length < nextPath.length) {
                var _ret = (function () {
                    // move into deep
                    var wasShifted = false;

                    return {
                        v: nextPath.map(function (nextIndex, i) {
                            if (wasShifted) {
                                return i == npLastIndex ? nextIndex + 1 : nextIndex;
                            }

                            if (typeof prevPath[i] !== 'number') {
                                return nextIndex;
                            }

                            if (nextPath[i] > prevPath[i] && i == ppLastIndex) {
                                wasShifted = true;
                                return nextIndex - 1;
                            }

                            return nextIndex;
                        })
                    };
                })();

                if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
            } else if (prevPath.length == nextPath.length) {
                // if move bottom + move to item with children => make it a first child instead of swap
                if (nextPath[npLastIndex] > prevPath[npLastIndex]) {
                    var target = this.getItemByPath(nextPath);

                    if (target[childrenProp] && target[childrenProp].length && collapsedGroups.indexOf(target.id) == -1) {
                        return nextPath.slice(0, -1).concat(nextPath[npLastIndex] - 1).concat(0);
                    }
                }
            }

            return nextPath;
        }
    }, {
        key: 'getItemOptions',
        value: function getItemOptions() {
            var _props2 = this.props,
                renderItem = _props2.renderItem,
                handler = _props2.handler,
                childrenProp = _props2.childrenProp;
            var _state = this.state,
                dragItem = _state.dragItem,
                collapsedGroups = _state.collapsedGroups;

            return {
                dragItem: dragItem,
                collapsedGroups: collapsedGroups,
                childrenProp: childrenProp,
                renderItem: renderItem,
                handler: handler,

                onDragStart: this.onDragStart,
                onMouseEnter: this.onMouseEnter,
                onToggleCollapse: this.onToggleCollapse
            };
        }

        // ––––––––––––––––––––––––––––––––––––
        // Click handlers or event handlers
        // ––––––––––––––––––––––––––––––––––––

    }, {
        key: 'renderDragLayer',

        // ––––––––––––––––––––––––––––––––––––
        // Render methods
        // ––––––––––––––––––––––––––––––––––––
        value: function renderDragLayer() {
            var group = this.props.group;
            var dragItem = this.state.dragItem;

            var el = document.querySelector('.nestable-' + group + ' .nestable-item-' + dragItem.id);

            var listStyles = {
                width: el.clientWidth
            };
            if (this.elCopyStyles) {
                listStyles = _extends({}, listStyles, this.elCopyStyles);
            }

            var options = this.getItemOptions();

            return _react2.default.createElement(
                'div',
                { className: 'nestable-drag-layer' },
                _react2.default.createElement(
                    'ol',
                    { className: 'nestable-list', style: listStyles },
                    _react2.default.createElement(_NestableItem2.default, {
                        item: dragItem,
                        options: options,
                        isCopy: true
                    })
                )
            );
        }
    }, {
        key: 'render',
        value: function render() {
            var _state2 = this.state,
                items = _state2.items,
                dragItem = _state2.dragItem;
            var group = this.props.group;

            var options = this.getItemOptions();

            return _react2.default.createElement(
                'div',
                { className: (0, _classnames2.default)("nestable", "nestable-" + group, { 'is-drag-active': dragItem }) },
                _react2.default.createElement(
                    'ol',
                    { className: 'nestable-list nestable-group' },
                    items.map(function (item, i) {
                        return _react2.default.createElement(_NestableItem2.default, {
                            key: i,
                            item: item,
                            options: options
                        });
                    })
                ),
                dragItem && this.renderDragLayer()
            );
        }
    }]);

    return Nestable;
})(_react.Component);

Nestable.propTypes = {
    items: _react.PropTypes.arrayOf(_react.PropTypes.shape({
        id: _react.PropTypes.any.isRequired
    })),
    threshold: _react.PropTypes.number,
    maxDepth: _react.PropTypes.number,
    childrenProp: _react.PropTypes.string,
    renderItem: _react.PropTypes.func,
    onChange: _react.PropTypes.func
};
Nestable.defaultProps = {
    items: [],
    threshold: 30,
    maxDepth: 10,
    group: 0,
    childrenProp: 'children',
    renderItem: function renderItem(_ref2) {
        var item = _ref2.item;
        return item.toString();
    },
    onChange: function onChange() {}
};
exports.default = Nestable;
