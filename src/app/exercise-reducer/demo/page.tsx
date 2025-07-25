'use client';

import { Button } from '@/components/ui/button';
import { createContext, use, useEffect, useReducer } from 'react';

const FlowContext = createContext<{
  state: FlowState;
  dispatch: (action: FlowAction) => void;
}>(
  null as unknown as {
    state: FlowState;
    dispatch: (action: FlowAction) => void;
  }
);

function SearchView() {
  const { dispatch } = use(FlowContext);

  return (
    <div>
      <h1>Search for stuff</h1>
      <Button onClick={() => dispatch({ type: 'search' })}>Search</Button>
    </div>
  );
}

function ResultsView() {
  const { state, dispatch } = use(FlowContext);

  if (state.status !== 'results') {
    // hopefully we never get here
    return <div>Error: something went wrong</div>;
  }

  return (
    <div>
      <h1>Results</h1>
      {state.results.map((result) => (
        <div key={result}>{result}</div>
      ))}
      <Button onClick={() => dispatch({ type: 'back' })}>Back</Button>
    </div>
  );
}

function LoadingView() {
  return (
    <div>
      <h1>Loading...</h1>
    </div>
  );
}

type FlowState = {
  results: string[] | undefined;
} & (
  | {
      status: 'search';
    }
  | {
      status: 'loading';
    }
  | {
      status: 'results';
      results: string[];
    }
);

type FlowAction =
  | {
      type: 'search';
    }
  | {
      type: 'receivedResults';
      results: string[];
    }
  | {
      type: 'back';
    };

function flowReducer(state: FlowState, action: FlowAction): FlowState {
  switch (action.type) {
    case 'search':
      return {
        ...state,
        status: 'loading',
      };
    case 'receivedResults':
      return {
        ...state,
        status: 'results',
        results: action.results,
      };
    case 'back':
      if (state.status === 'search') {
        return state;
      }

      // state is 'results'
      return {
        ...state,
        status: 'search',
      };
    default:
      return state;
  }
}

function FlowProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(flowReducer, {
    status: 'search',
    results: undefined,
  });

  useEffect(() => {
    if (state.status === 'loading') {
      const id = setTimeout(() => {
        dispatch({
          type: 'receivedResults',
          results: ['result 1', 'result 2'],
        });
      }, 1000);

      return () => clearTimeout(id);
    }
  }, [state.status]);

  return (
    <FlowContext.Provider value={{ state, dispatch }}>
      {children}
    </FlowContext.Provider>
  );
}

function FlowContent() {
  const { state } = use(FlowContext);

  return (
    <div>
      {state.status === 'search' && <SearchView />}
      {state.status === 'loading' && <LoadingView />}
      {state.status === 'results' && <ResultsView />}
    </div>
  );
}

export default function Page() {
  return (
    <FlowProvider>
      <FlowContent />
    </FlowProvider>
  );
}
