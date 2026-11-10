<script setup>
import SimpleKeyboard from './components/SimpleKeyboard.vue';
import { reactive, ref, onMounted, onUnmounted, computed, watch, nextTick } from 'vue'
import WordRow from './components/WordRow.vue';
import TickSoundSrc from '/sounds/tick.mp3'
import WinSoundSrc from '/sounds/win.mp3'
import LoseSoundSrc from '/sounds/lose.mp3'
import WordList from './assets/wordlist.json'
import { gameHasProgress, normalizeKey, shouldSubmitInsteadOfButton } from './game.js'

const HARD_MODE_KEY = "wordle-hard-mode"

const readHardMode = () => {
  try {
    return localStorage.getItem(HARD_MODE_KEY) === "1"
  } catch {
    return false
  }
}

const writeHardMode = (enabled) => {
  try {
    localStorage.setItem(HARD_MODE_KEY, enabled ? "1" : "0")
    return true
  } catch {
    return false
  }
}

let tick = new Audio(TickSoundSrc)
let win = new Audio(WinSoundSrc)
let lose = new Audio(LoseSoundSrc)
let errorTimer = 0
const confirmHardMode = ref(false)
const cancelButton = ref(null)
const roundId = ref(0)

const play = (audio) => {
  audio.play().catch(() => {})
}

const state = reactive({
  solution: "",
  guesses: ["","","","","",""],
  availableWords: WordList.words,
  currentGuessIndex: 0,
  hardMode: readHardMode(),
  error: "",
  guessedLetters: {
    miss: [],
    found: [],
    hint: []
  }
})

const wonGame = computed(() =>
  state.currentGuessIndex > 0 &&
  state.guesses[state.currentGuessIndex - 1] === state.solution
)

const lostGame = computed(() =>
  !wonGame.value && state.currentGuessIndex >= 6
)

watch(wonGame, (won) => {
  if (won) play(win)
})

watch(lostGame, (lost) => {
  if (lost) play(lose)
})

const pickSolution = () => {
  const words = state.availableWords
  return words[Math.floor(Math.random() * words.length)].toLowerCase()
}

const resetRound = () => {
  state.solution = pickSolution()
  state.guesses = ["", "", "", "", "", ""]
  state.currentGuessIndex = 0
  state.error = ""
  state.guessedLetters = { miss: [], found: [], hint: [] }
  window.clearTimeout(errorTimer)
  roundId.value += 1
}

const refreshPage = (event) => {
  resetRound()
  event?.currentTarget?.blur?.()
}

const cancelHardModeSwitch = () => {
  confirmHardMode.value = false
}

const confirmHardModeSwitch = () => {
  state.hardMode = !state.hardMode
  writeHardMode(state.hardMode)
  confirmHardMode.value = false
  resetRound()
}

const requestHardModeToggle = (event) => {
  const currentGuess = state.guesses[state.currentGuessIndex] || ""
  if (!gameHasProgress(state.currentGuessIndex, currentGuess)) {
    state.hardMode = !state.hardMode
    writeHardMode(state.hardMode)
    event?.currentTarget?.blur?.()
    return
  }
  confirmHardMode.value = true
}

watch(confirmHardMode, async (open) => {
  if (!open) return
  await nextTick()
  cancelButton.value?.focus()
})

const showError = (message) => {
  state.error = message
  window.clearTimeout(errorTimer)
  errorTimer = window.setTimeout(() => {
    state.error = ""
  }, 2500)
}

const recordGuess = (currentGuess) => {
  state.currentGuessIndex++
  for (let i = 0; i < currentGuess.length; i++) {
    const c = currentGuess.charAt(i)
    if (c === state.solution.charAt(i)) {
      state.guessedLetters.found.push(c)
    } else if (state.solution.includes(c)) {
      state.guessedLetters.hint.push(c)
    } else {
      state.guessedLetters.miss.push(c)
    }
  }
  play(tick)
}

const handleInput = (key) => {
  if (confirmHardMode.value || state.currentGuessIndex >= 6 || wonGame.value) {
    return
  }

  const normalized = normalizeKey(key)
  if (!normalized) return

  const currentGuess = state.guesses[state.currentGuessIndex]

  if (normalized === "{enter}") {
    if (currentGuess.length !== 5) return
    state.error = ""
    if (state.hardMode && !state.availableWords.includes(currentGuess)) {
      showError("⚠️ Real Words only in Hard Mode!")
      return
    }
    recordGuess(currentGuess)
    return
  }

  if (normalized === "{bksp}") {
    state.guesses[state.currentGuessIndex] = currentGuess.slice(0, -1)
    play(tick)
    return
  }

  if (currentGuess.length < 5) {
    state.guesses[state.currentGuessIndex] += normalized
    play(tick)
  }
}

const onKeyDown = (event) => {
  if (confirmHardMode.value || event.key !== "Enter") return
  const gameControl = event.target?.closest?.("[data-game-control]")
  if (!gameControl) return
  const currentGuess = state.guesses[state.currentGuessIndex] || ""
  if (shouldSubmitInsteadOfButton(currentGuess, state.currentGuessIndex, wonGame.value)) {
    event.preventDefault()
  }
}

const onKeyUp = (event) => {
  if (confirmHardMode.value) {
    if (event.key === "Escape") cancelHardModeSwitch()
    event.preventDefault()
    return
  }
  event.preventDefault()
  handleInput(event.key)
}

onMounted(() => {
  window.addEventListener("keydown", onKeyDown)
  window.addEventListener("keyup", onKeyUp)
  state.solution = pickSolution()
})

onUnmounted(() => {
  window.removeEventListener("keydown", onKeyDown)
  window.removeEventListener("keyup", onKeyUp)
  window.clearTimeout(errorTimer)
})
</script>

<template>
  <div class="bg-white flex flex-col h-screen max-w-md mx-auto justify-evenly">
    <div class="grid grid-cols-6">
      <button
        type="button"
        data-game-control
        class="bg-green-600 text-white rounded p-4 font-bold col-span-2 mx-auto border-0"
        @click="refreshPage"
      >
        Play Again?
      </button>
      <div class="flex justify-center col-span-2">
      <a class="myBtn" href="https://jaimegonzalezjr.com">
          <div class="myBtnTeal" />
          <div class="myBtnPurple" />
      </a>
    </div>
      <button
        type="button"
        data-game-control
        class="text-center cursor-pointer text-white rounded flex items-center p-4 font-bold col-span-2 mx-auto border-0"
        @click="requestHardModeToggle"
        :class="[state.hardMode ? 'bg-red-500' : 'bg-orange-500']"
      >
        Hard Mode: {{state.hardMode ? 'Y' : 'N'}}
      </button>
    </div>
    <div>
      <word-row
        v-for="(guess, i) in state.guesses"
        :key="`${roundId}-${i}`"
        :value="guess"
        :solution="state.solution"
        :submitted="i < state.currentGuessIndex"
      />
    </div>
    <div class="text-center rounded mx-16">
      <p v-if="wonGame">
        🏆 Congrats you solved it!
      </p>
      <p v-else-if="lostGame">
      😔 Out of tries. Word was "{{state.solution}}"
      </p>
      <p v-else :class="[state.error ? 'text-black':'text-white']">
        {{state.error ? state.error : '.'}}
      </p>
    </div>
    <simple-keyboard
      :key="roundId"
      @onKeyPress="handleInput"
      :guessedLetters="state.guessedLetters"
    />
    <div
      v-if="confirmHardMode"
      class="fixed inset-0 z-20 flex items-center justify-center bg-black/40 px-6"
      @click.self="cancelHardModeSwitch"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="hard-mode-title"
        class="w-full max-w-sm rounded bg-white p-6 text-center shadow-lg"
      >
        <h2 id="hard-mode-title" class="text-lg font-bold">Start a new game?</h2>
        <p class="mt-2 text-sm text-gray-700">
          Hard mode is for the whole puzzle. Switching it clears this board and picks a new word.
        </p>
        <div class="mt-5 flex justify-center gap-3">
          <button
            ref="cancelButton"
            type="button"
            class="rounded bg-gray-200 px-4 py-2 font-bold"
            @click="cancelHardModeSwitch"
          >
            Cancel
          </button>
          <button
            type="button"
            class="rounded bg-green-600 px-4 py-2 font-bold text-white"
            @click="confirmHardModeSwitch"
          >
            New game
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.logo{
  position:absolute;
  top: 0;
  left: 48%;
}
.myBtn{
  width: 90px;
  height: 90px;
  position: relative;
  cursor: pointer;
  transform: scale(0.7);
}

.myBtnTeal, .myBtnPurple{
  width: 60px;
  height: 60px;
  position: absolute;
  transition: all 0.5s ease-in-out;
}

.myBtnTeal{
  background-color: #3bf2c4;
  transform: translate(35px, 35px);
}
.myBtnTeal::before{
  content:"G";
  height:100%;
  font-size:2rem;
  font-weight: bold;
  display:flex;
  justify-content: center;
  align-items: center;
}
.myBtn:hover > .myBtnTeal{
  transform: translate(40px, 40px);
}

.myBtnPurple{
  background-color: #7772b1;
  transform: translate(-5px, -5px);
}

.myBtnPurple::before{
  content:"J";
  height:100%;
  font-size:2rem;
  font-weight: bold;
  display:flex;
  justify-content: center;
  align-items: center;
}
.myBtn:hover > .myBtnPurple{
  transform: translate(-10px, -10px);
}
</style>