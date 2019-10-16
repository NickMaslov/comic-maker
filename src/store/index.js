import { createStore, combineReducers, applyMiddleware } from "redux";
import { createLogger } from "redux-logger";
import thunkMiddleware from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

import user from "./user";
import stories from "./stories";
import chapters from "./chapters";
import templates from "./templates";

const reducer = combineReducers({
  user,
  stories,
  chapters,
  templates
});

const middleware = composeWithDevTools(
  applyMiddleware(thunkMiddleware, createLogger({ collapsed: true }))
);
const store = createStore(reducer, middleware);

export default store;
export * from "./user";
export * from "./stories";
export * from "./chapters";
export * from "./templates";
