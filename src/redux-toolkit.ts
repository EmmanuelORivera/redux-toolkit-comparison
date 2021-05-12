import {
  combineReducers,
  configureStore,
  createSlice,
  PayloadAction,
  getDefaultMiddleware,
} from '@reduxjs/toolkit';
import { v4 as uuid } from 'uuid';
import logger from 'redux-logger';
import { Todo } from './type';

const initialState: Todo[] = [
  {
    id: uuid(),
    desc: 'Learn React',
    isComplete: true,
  },
  {
    id: uuid(),
    desc: 'Learn Redux',
    isComplete: true,
  },
  {
    id: uuid(),
    desc: 'Learn Redux-ToolKit',
    isComplete: false,
  },
];

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    create: {
      reducer: (
        state,
        action: PayloadAction<{ id: string; desc: string; isComplete: boolean }>
      ) => {
        state.push(action.payload);
      },
      prepare: ({ desc }: { desc: string }) => ({
        payload: { id: uuid(), desc, isComplete: false },
      }),
    },
    edit: (state, action: PayloadAction<{ id: string; desc: string }>) => {
      const { payload } = action;
      const todoToEdit = state.find((todo) => todo.id === payload.id);
      if (todoToEdit) {
        todoToEdit.desc = payload.desc;
      }
    },
    toggle: (
      state,
      action: PayloadAction<{ id: string; isComplete: boolean }>
    ) => {
      const { payload } = action;
      const todoToggled = state.find((todo) => todo.id === payload.id);
      if (todoToggled) {
        todoToggled.isComplete = payload.isComplete;
      }
    },
    remove: (state, action: PayloadAction<{ id: string }>) => {
      const INDEX_NOT_FOUND = -1;
      const index = state.findIndex((todo) => todo.id === action.payload.id);
      if (index !== INDEX_NOT_FOUND) {
        state.splice(index, 1);
      }
    },
  },
});

const selectedTodoSlice = createSlice({
  name: 'selectedTodo',
  initialState: null as string | null,
  reducers: {
    select: (state, action: PayloadAction<{ id: string }>) => action.payload.id,
  },
});

const counterSlice = createSlice({
  name: 'counter',
  initialState: 0,
  reducers: {},
  extraReducers: {
    [todosSlice.actions.create.type]: (state) => state + 1,
    [todosSlice.actions.edit.type]: (state) => state + 1,
    [todosSlice.actions.toggle.type]: (state) => state + 1,
    [todosSlice.actions.remove.type]: (state) => state + 1,
  },
});

export const {
  toggle: toggleTodoActionCreator,
  create: createTodoActionCreator,
  edit: editTodoActionCreator,
  remove: deleteTodoActionCreator,
} = todosSlice.actions;

export const { select: selectTodoActionCreator } = selectedTodoSlice.actions;

const rootReducer = combineReducers({
  todos: todosSlice.reducer,
  selectedTodo: selectedTodoSlice.reducer,
  counter: counterSlice.reducer,
});

const middleware = [...getDefaultMiddleware(), logger];
export const store = configureStore({
  reducer: rootReducer,
  middleware,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
