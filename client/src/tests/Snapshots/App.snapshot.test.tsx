import React from 'react';
import renderer from 'react-test-renderer';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { test, expect } from '@jest/globals';
import App from '../../app/App';

const mockStore = configureStore([]);
const initialState = {
  safety: { locked: false, alarm: null },
  user: { hasCheckedUsername: true, username: null },
  mode: { darkMode: false },
  error: { error: null, trackErrorChange: false },
};

const store = mockStore(initialState);

test('renders App correctly', () => {
  // ARRANGE
  const component = (
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  );

  // ACT
  const tree = renderer.create(component).toJSON();

  // ASSERT
  expect(tree).toMatchSnapshot();
});
