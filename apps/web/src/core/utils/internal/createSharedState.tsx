import { createContext, type Dispatch, type JSX, type PropsWithChildren, useContext, useMemo, useState } from 'react';

type AnyFunction = (...args: never[]) => unknown;

type Set<T extends Record<string, unknown>> = Partial<T> | ((prev: T) => Partial<T>);

type CreateSharedState<TState extends Record<string, unknown>, TActions extends Record<string, AnyFunction>> = {
  Provider: ({ children }: PropsWithChildren) => JSX.Element;
  useSharedState: () => TState;
  useSharedActions: () => TActions;
};

export function createSharedState<TState extends Record<string, unknown>, TActions extends Record<string, AnyFunction>>(
  initState: TState,
  createActions: (set: Dispatch<Set<TState>>) => TActions,
): CreateSharedState<TState, TActions> {
  const StateContext = createContext<TState | undefined>(undefined);
  const ActionsContext = createContext<TActions | undefined>(undefined);

  const Provider: CreateSharedState<TState, TActions>['Provider'] = ({ children }: PropsWithChildren) => {
    const [state, setState] = useState(initState);

    const set: Dispatch<Set<TState>> = action =>
      setState(prev => {
        const newState = typeof action === 'function' ? action(prev) : action;
        return { ...prev, ...newState };
      });

    // actions는 useMemo로 안정적인 참조 유지
    // → actions만 사용하는 컴포넌트는 state 변경 시 리렌더링 안됨
    const actions = useMemo(() => createActions(set), []);

    return (
      <StateContext.Provider value={state}>
        <ActionsContext.Provider value={actions}>{children}</ActionsContext.Provider>
      </StateContext.Provider>
    );
  };

  const useSharedState: CreateSharedState<TState, TActions>['useSharedState'] = () => {
    const context = useContext(StateContext);
    if (!context) {
      throw new Error('Provider 안에서 사용되어야 합니다.');
    }
    return context;
  };

  const useSharedActions: CreateSharedState<TState, TActions>['useSharedActions'] = () => {
    const context = useContext(ActionsContext);
    if (!context) {
      throw new Error('Provider 안에서 사용되어야 합니다.');
    }
    return context;
  };

  return { Provider, useSharedState, useSharedActions };
}
