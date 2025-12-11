import {
  createContext,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
  useContext,
  useMemo,
  useState,
} from 'react';

export function createSharedState<
  TState extends Record<string, unknown>,
  TActions extends Record<string, (...args: unknown[]) => unknown>,
>(initState: TState, createActions: (set: Dispatch<SetStateAction<TState>>) => TActions) {
  const StateContext = createContext<TState | undefined>(undefined);
  const ActionsContext = createContext<TActions | undefined>(undefined);

  function Provider({ children }: PropsWithChildren) {
    const [state, setState] = useState(initState);

    const set: Dispatch<SetStateAction<TState>> = action =>
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
  }

  function useSharedState() {
    const context = useContext(StateContext);
    if (!context) {
      throw new Error('Provider 안에서 사용되어야 합니다.');
    }
    return context;
  }

  function useSharedActions() {
    const context = useContext(ActionsContext);
    if (!context) {
      throw new Error('Provider 안에서 사용되어야 합니다.');
    }
    return context;
  }

  // state와 actions를 한번에 가져오는 편의 훅
  function useShared(): TState & TActions {
    return { ...useSharedState(), ...useSharedActions() };
  }

  return { Provider, useSharedState, useSharedActions, useShared };
}
