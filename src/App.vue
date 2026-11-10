<script setup>
import SimpleKeyboard from './components/SimpleKeyboard.vue';
import { reactive, onMounted, onUnmounted, computed, watch } from 'vue'
import WordRow from './components/WordRow.vue';
import TickSoundSrc from '/sounds/tick.mp3'
import WinSoundSrc from '/sounds/win.mp3'
import LoseSoundSrc from '/sounds/lose.mp3'
import WordList from './assets/wordlist.json'
import { normalizeKey } from './game.js'

let tick = new Audio(TickSoundSrc)
let win = new Audio(WinSoundSrc)
let lose = new Audio(LoseSoundSrc)
let errorTimer = 0

const play = (audio) => {
  audio.play().catch(() => {})
}

const state = reactive({
  solution: "",
  guesses: ["","","","","",""],
  availableWords: WordList.words,
  currentGuessIndex: 0,
  hardMode: false,
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

const refreshPage = () => {
  window.location.reload();
}

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
  if (state.currentGuessIndex >= 6 || wonGame.value) {
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

const onKeyUp = (event) => {
  event.preventDefault()
  handleInput(event.key)
}

onMounted(() => {
  window.addEventListener("keyup", onKeyUp)
  const words = state.availableWords
  state.solution = words[Math.floor(Math.random() * words.length)].toLowerCase()
})

onUnmounted(() => {
  window.removeEventListener("keyup", onKeyUp)
  window.clearTimeout(errorTimer)
})
</script>

<template>
  <div class="bg-white flex flex-col h-screen max-w-md mx-auto justify-evenly">
    <div class="grid grid-cols-6">
      <button
        class="bg-green-600 text-white rounded p-4 font-bold col-span-2 mx-auto"
        @click="refreshPage()"
      >
        Play Again?
      </button>
      <div class="flex justify-center col-span-2">
      <a class="myBtn" href="https://jaimegonzalezjr.com">
          <div class="myBtnTeal" />
          <div class="myBtnPurple" />
      </a>
    </div>
      <div
        class="text-center cursor-pointer text-white rounded flex items-center p-4 font-bold col-span-2 mx-auto"
        @click="state.hardMode = !state.hardMode"
        :class="[state.hardMode ? 'bg-red-500' : 'bg-orange-500']"
      >
        Hard Mode: {{state.hardMode ? 'Y' : 'N'}}
      </div>
    </div>
    <div>
      <word-row
        v-for="(guess, i) in state.guesses"
        :key="i"
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
      @onKeyPress="handleInput"
      :guessedLetters="state.guessedLetters"
    />
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