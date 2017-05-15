'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var rxjs_Subject = require('rxjs/Subject');
var rxjs_observable_merge = require('rxjs/observable/merge');
var rxjs_observable_fromPromise = require('rxjs/observable/fromPromise');
var rxjs_operator_map = require('rxjs/operator/map');
var rxjs_operator_switchMap = require('rxjs/operator/switchMap');
var rxjs_operator_filter = require('rxjs/operator/filter');
var rxjs_operator_partition = require('rxjs/operator/partition');
var rxjs_operator_groupBy = require('rxjs/operator/groupBy');
var rxjs_operator_mergeMap = require('rxjs/operator/mergeMap');

var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();













var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};











var objectWithoutProperties = function (obj, keys) {
  var target = {};

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
};





var set = function set(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};

var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

var defaultAdapter = (function (_ref) {
  var endpoint = _ref.endpoint,
      others = objectWithoutProperties(_ref, ["endpoint"]);

  return fetch(endpoint, others);
});

var CALL_API = Symbol('CALL_API');
var REDUCER_PATH = 'api_calls';
var ACTION_FETCH_START = '@@api/FETCH_START';
var ACTION_FETCH_COMPLETE = '@@api/FETCH_COMPLETE';
var ACTION_FETCH_FAILURE = '@@api/FETCH_FAILURE';
var ACTION_UPDATE_LOCAL = '@@api/UPDATE_LOCAL';
var ACTION_RESET_LOCAL = '@@api/RESET_LOCAL';

var makeStartErrorAction = function makeStartErrorAction(api) {
  return function (error) {
    return {
      type: ACTION_FETCH_START,
      error: true,
      payload: _extends({
        error: error
      }, api)
    };
  };
};

var makeStartAction = function makeStartAction(api) {
  return function () {
    return {
      type: ACTION_FETCH_START,
      payload: _extends({}, api, {
        requestedAt: Date.now()
      })
    };
  };
};

var makeSuccessAction = function makeSuccessAction(api) {
  return function (json) {
    return {
      type: ACTION_FETCH_COMPLETE,
      payload: _extends({}, api, {
        json: json,
        respondedAt: Date.now()
      })
    };
  };
};

var makeFailureAction = function makeFailureAction(api) {
  return function (json) {
    return {
      type: ACTION_FETCH_FAILURE,
      payload: _extends({}, api, {
        json: json,
        respondedAt: Date.now()
      })
    };
  };
};

var reduceKeys = function reduceKeys(obj) {
  return function (reducer, seed) {
    return Object.keys(obj).reduce(function (acc, key) {
      return _extends({}, acc, reducer(obj, key));
    }, seed);
  };
};

var bindFunction = function bindFunction(getState) {
  return function (obj, key) {
    return defineProperty({}, key, typeof obj[key] === 'function' ? obj[key](getState()) : obj[key]);
  };
};

var applyFunctions = (function (getState) {
  return function (api) {
    return reduceKeys(api)(bindFunction(getState), {});
  };
});

var isValid = function isValid(api) {
  return typeof api.name === 'string' && typeof api.endpoint === 'string';
};

var makeHOObservableFromActionCreator = function makeHOObservableFromActionCreator(actionCreator) {
  return function (_ref) {
    var api = _ref.api,
        resp = _ref.resp,
        error = _ref.error;
    return rxjs_observable_fromPromise.fromPromise(error ? Promise.resolve(actionCreator(api)({ error: error })) : resp.json().then(function (json) {
      return actionCreator(api)(json);
    }));
  };
};

var fromRespToSuccessActionStream = makeHOObservableFromActionCreator(makeSuccessAction);
var fromRespToFailureActionStream = makeHOObservableFromActionCreator(makeFailureAction);
var fromRespToActionStream = function fromRespToActionStream(data) {
  return data.resp && data.resp.ok ? fromRespToSuccessActionStream(data) : fromRespToFailureActionStream(data);
};

var callApiInGroup = function callApiInGroup(group$, adapter) {
  return rxjs_operator_switchMap.switchMap.call(group$, function (api) {
    return rxjs_observable_fromPromise.fromPromise(adapter(api).then(function (resp) {
      return { resp: resp, api: api };
    }, function (error) {
      return { error: error, api: api };
    }));
  });
};

var createActionStream = (function (actions$, _ref2, adapter) {
  var _context;

  var getState = _ref2.getState;

  var api$ = (_context = rxjs_operator_map.map.call(actions$, function (action) {
    return action[CALL_API];
  }), rxjs_operator_map.map).call(_context, applyFunctions(getState));

  var _ref3 = rxjs_operator_partition.partition.call(api$, isValid),
      _ref4 = slicedToArray(_ref3, 2),
      valid$ = _ref4[0],
      invalid$ = _ref4[1];

  var startError$ = rxjs_operator_map.map.call(invalid$, function (api) {
    return makeStartErrorAction(api)();
  });
  var start$ = rxjs_operator_map.map.call(valid$, function (api) {
    return makeStartAction(api)();
  });

  var apiGroup$ = rxjs_operator_groupBy.groupBy.call(valid$, function (api) {
    return api.name;
  });

  var resp$ = rxjs_operator_mergeMap.mergeMap.call(apiGroup$, function (apiInGroup$) {
    return callApiInGroup(apiInGroup$, adapter);
  });

  var fetchDoneActions$ = rxjs_operator_mergeMap.mergeMap.call(resp$, fromRespToActionStream);

  return rxjs_observable_merge.merge(start$, startError$, fetchDoneActions$);
});

var middleware = (function () {
  var adapter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultAdapter;
  return function (_ref) {
    var dispatch = _ref.dispatch,
        getState = _ref.getState;

    var apiCallsAction$ = new rxjs_Subject.Subject();

    createActionStream(apiCallsAction$, { getState: getState }, adapter).subscribe(dispatch);

    return function (next) {
      return function (action) {
        if (!action[CALL_API]) {
          next(action);
          return;
        }

        apiCallsAction$.next(action);
      };
    };
  };
});

var get$1 = (function (array, defaulValue) {
  return function (state) {
    var finalValue = array.reduce(function (value, nextProp) {
      if (typeof value === 'undefined' || value === null) {
        return;
      }
      return value[nextProp];
    }, state);

    if (typeof finalValue === 'undefined') {
      return defaulValue;
    }

    return finalValue;
  };
});

var normalizeResetData = function normalizeResetData() {
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ['lastRequest', 'isFetching', 'isInvalidated', 'lastResponse', 'data', 'error'];

  if (typeof data === 'string') {
    return [data];
  }
  if (!Array.isArray(data)) {
    console.warn('You are using resetter wrong, the params should be string, array or undefined');
    return [];
  }
  return data;
};

var makeFetchAction = (function (apiName, apiConfigFn) {
  var selectorDescriptor = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var actionCreator = function actionCreator() {
    return defineProperty({}, CALL_API, _extends({}, apiConfigFn.apply(undefined, arguments), {
      name: apiName
    }));
  };

  var updater = function updater(data) {
    return {
      type: ACTION_UPDATE_LOCAL,
      payload: {
        name: apiName,
        data: data
      }
    };
  };

  var resetter = function resetter(data) {
    return {
      type: ACTION_RESET_LOCAL,
      payload: {
        name: apiName,
        data: normalizeResetData(data)
      }
    };
  };

  var isFetchingSelector = get$1([REDUCER_PATH, apiName, 'isFetching'], false);
  var isInvalidatedSelector = get$1([REDUCER_PATH, apiName, 'isInvalidated'], false);
  var dataSelector = get$1([REDUCER_PATH, apiName, 'data'], null);
  var errorSelector = get$1([REDUCER_PATH, apiName, 'error'], null);
  var lastResponseSelector = get$1([REDUCER_PATH, apiName, 'lastResponse'], null);

  return {
    actionCreator: actionCreator,
    updater: updater,
    isFetchingSelector: isFetchingSelector,
    isInvalidatedSelector: isInvalidatedSelector,
    dataSelector: dataSelector,
    errorSelector: errorSelector,
    lastResponseSelector: lastResponseSelector,
    resetter: resetter
  };
});

var handleActions = (function (handlers) {
  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var action = arguments[1];

    var handler = handlers[action.type];
    if (typeof handler !== 'function') {
      return state;
    }

    return handler(state, action);
  };
});

var _handleActions;

var getName = function getName(action) {
  return action.payload.name;
};
var getRequestedAt = function getRequestedAt(action) {
  return action.payload.requestedAt;
};
var getRespondedAt = function getRespondedAt(action) {
  return action.payload.respondedAt;
};
var getJSONResponse = function getJSONResponse(action) {
  return action.payload.json;
};
var getError = function getError(action) {
  return action.payload.error;
};
var getPreviousError = function getPreviousError(state, action) {
  return state[getName(action)] ? state[getName(action)].error : null;
};

var includeString = function includeString(element, array) {
  return array.indexOf(element) !== -1;
};
var resetOrKeepValue = function resetOrKeepValue(field, action, currentData) {
  return includeString(field, action.payload.data) ? undefined : currentData[field];
};

var updateWith = function updateWith(state, name, obj) {
  return _extends({}, state, defineProperty({}, name, _extends({}, state[name], obj)));
};

var reducer = handleActions((_handleActions = {}, defineProperty(_handleActions, ACTION_FETCH_START, function (state, action) {
  return updateWith(state, getName(action), {
    lastRequest: getRequestedAt(action),
    isFetching: !action.error,
    isInvalidated: true,
    error: action.error ? getError(action) : getPreviousError(state, action)
  });
}), defineProperty(_handleActions, ACTION_FETCH_COMPLETE, function (state, action) {
  return updateWith(state, getName(action), {
    isFetching: false,
    isInvalidated: false,
    lastResponse: getRespondedAt(action),
    data: getJSONResponse(action),
    error: null
  });
}), defineProperty(_handleActions, ACTION_FETCH_FAILURE, function (state, action) {
  return updateWith(state, getName(action), {
    isFetching: false,
    isInvalidated: true,
    error: getJSONResponse(action)
  });
}), defineProperty(_handleActions, ACTION_UPDATE_LOCAL, function (state, action) {
  return updateWith(state, getName(action), {
    data: action.payload.data
  });
}), defineProperty(_handleActions, ACTION_RESET_LOCAL, function (state, action) {
  var name = getName(action);
  var currentData = state[name] || {};
  return updateWith(state, name, {
    lastRequest: resetOrKeepValue('lastRequest', action, currentData),
    isFetching: resetOrKeepValue('isFetching', action, currentData),
    isInvalidated: resetOrKeepValue('isInvalidated', action, currentData),
    lastResponse: resetOrKeepValue('lastResponse', action, currentData),
    data: resetOrKeepValue('data', action, currentData),
    error: resetOrKeepValue('error', action, currentData)
  });
}), _handleActions));

var reducers = defineProperty({}, REDUCER_PATH, reducer);
var ACTIONS = {
  START: ACTION_FETCH_START,
  COMPLETE: ACTION_FETCH_COMPLETE,
  FAILURE: ACTION_FETCH_FAILURE,
  UPDATE_LOCAL: ACTION_UPDATE_LOCAL
};

exports.middleware = middleware;
exports.makeFetchAction = makeFetchAction;
exports.reducers = reducers;
exports.ACTIONS = ACTIONS;
