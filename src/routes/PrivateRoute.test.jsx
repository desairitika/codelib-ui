import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "../redux/reducers";

// we're going to spy on validateAction to make sure it's not invoked repeatedly
import * as authActions from "../redux/actions/authActions";

vi.mock("../redux/actions/authActions", () => {
  const original = vi.importActual("../redux/actions/authActions");
  return {
    ...original,
    validateAction: vi.fn(() => async (dispatch) => {
      // simulate a failing validation by dispatching loginFailure
      dispatch({ type: "LOGIN_FAILURE", payload: "test" });
    }),
  };
});

import PrivateRoute from "./PrivateRoute";

// helper to render the routing structure with given initial store state
function renderWithRoute(store, initialEntries = ["/"]) {
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <div data-testid="protected">protected content</div>
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<div data-testid="login">login page</div>} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
}

describe("<PrivateRoute>", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("redirects to login when there is no token", () => {
    const store = configureStore({
      reducer: rootReducer,
      preloadedState: {
        auth: { loading: false, isAuthenticated: false, user: null, token: null, error: null },
      },
    });

    renderWithRoute(store);
    expect(screen.queryByTestId("protected")).not.toBeInTheDocument();
    expect(screen.getByTestId("login")).toBeInTheDocument();
  });

  it("only invokes validateAction once when token exists but validation fails", async () => {
    const store = configureStore({
      reducer: rootReducer,
      preloadedState: {
        auth: { loading: false, isAuthenticated: false, user: null, token: "abc", error: null },
      },
    });

    renderWithRoute(store);
    // initial call should have happened
    expect(authActions.validateAction).toHaveBeenCalledTimes(1);

    // wait a bit to ensure there aren't additional calls
    await waitFor(
      () => {
        expect(authActions.validateAction).toHaveBeenCalledTimes(1);
      },
      { timeout: 1000 }
    );

    // after failure we should be redirected to login
    expect(screen.getByTestId("login")).toBeInTheDocument();
  });
});
