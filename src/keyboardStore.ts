import { writable } from 'svelte/store';

export type CharStatus = 'incorrect' | 'present' | 'correct';

export interface Guess {
  letters: string[];
  statuses: CharStatus[];
}

export interface IKeyboardStore {
  letterStatus: Map<string, CharStatus>;
  disabled: boolean;
}

function translateHierarchy(status?: CharStatus) {
  if (status === 'incorrect') return 1;
  if (status === 'present') return 2;
  if (status === 'correct') return 3;
  return 0;
}

function createKeyboardStore() {
  const init = { letterStatus: new Map(), disabled: false };
  const { subscribe, update, set } = writable<IKeyboardStore>(init);

  return {
    subscribe,
    reset: () => set({ ...init, letterStatus: new Map() }),
    setDisabled: (val: boolean) => update((s) => ({ ...s, disabled: val })),
    setLetterStatus: (guess: Guess) => {
      update(({ letterStatus, ...rest }) => {
        guess.letters.forEach((char, i) => {
          const currentStatus = translateHierarchy(letterStatus.get(char));
          console.log(currentStatus)

          const incomingStatus = translateHierarchy(guess.statuses[i]);
          console.log(guess.statuses[i])

          if (incomingStatus > currentStatus) {
            letterStatus.set(char, guess.statuses[i]);
          }

        });
        return { letterStatus, ...rest };
      });
    }
  };
}

export const keyboardStore = createKeyboardStore();
