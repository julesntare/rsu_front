// import { applyMiddleware, createStore } from 'redux';
// import thunk from 'redux-thunk';
// import RootReducer from './reducers/RootReducer';

// export const Store = createStore(RootReducer, applyMiddleware(thunk));

import { createStore, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import RootReducer from './reducers/RootReducer';

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, RootReducer);
const Store = createStore(persistedReducer, applyMiddleware(thunk));
const persistor = persistStore(Store);

export { Store, persistor };
